/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização das rotas de usuários (Nuvem Azure)
 * Projeto: ConectaBook
 * Data: 03/06/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.2
 *******************************************************************************************/

const express = require('express')
const cors = require('cors')
const router = express.Router()

// Importações das configurações centralizadas do projeto
const upload = require('../config/multer.js')
const { uploadFileToAzure } = require('../model/DAO/azure/azureStorage.js')
const controllerUsuario = require('../controller/usuario/usuario_controller.js')

// Configuração do CORS local para as rotas
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// =========================================================================
// ENDPOINTS USUARIOS
// =========================================================================

// URL: GET http://localhost:8080/v1/conectaBook/usuarios
router.get('/', cors(), async function (request, response) {
    let dadosUsuarios = await controllerUsuario.listarUsuarios()
    response.status(dadosUsuarios.status_code).json(dadosUsuarios)
})

// URL: GET http://localhost:8080/v1/conectaBook/usuarios/:id
router.get('/:id', cors(), async function (request, response) {
    let idUsuario = request.params.id
    let dadosUsuario = await controllerUsuario.listarUsuarioID(idUsuario)
    response.status(dadosUsuario.status_code).json(dadosUsuario)
})

// URL: POST http://localhost:8080/v1/conectaBook/usuarios
// MODIFICADO: Agora aceita cadastro inicial com foto e faz upload para a pasta 'usuarios'
router.post('/', cors(), upload.single('foto_perfil'), async function (request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    try {
        if (request.file) {
            const urlAzure = await uploadFileToAzure(request.file, 'usuarios')
            dadosBody.foto_perfil = urlAzure
        } else {
            dadosBody.foto_perfil = null
        }

        let result = await controllerUsuario.criarUsuario(dadosBody, contentType)
        response.status(result.status_code).json(result)

    } catch (error) {
        console.error("🚨 Erro na Rota POST Usuários:", error.message)
        response.status(500).json({ status: false, message: "Erro ao processar foto de perfil na nuvem." })
    }
})

// URL: PUT http://localhost:8080/v1/conectaBook/usuarios/:id
// MODIFICADO: Transforma o arquivo buffer em URL da Azure antes de enviar à controller
router.put('/:id', cors(), upload.single('foto_perfil'), async function (request, response) {
    let dadosBody = request.body
    let idUsuario = request.params.id
    let contentType = request.headers['content-type']
    let arquivoUrl = null

    try {
        if (request.file) {
            // Sobe para a nuvem e gera o link público
            arquivoUrl = await uploadFileToAzure(request.file, 'usuarios')
            dadosBody.foto_perfil = arquivoUrl // Injeta no body por segurança caso sua controller mude
        }

        // Mantém a assinatura da sua controller antiga enviando o link gerado (ou null) no lugar do arquivo local
        let result = await controllerUsuario.atualizarUsuario(dadosBody, contentType, idUsuario, arquivoUrl)
        response.status(result.status_code).json(result)

    } catch (error) {
        console.error("🚨 Erro na Rota PUT Usuários:", error.message)
        response.status(500).json({ status: false, message: "Erro ao atualizar foto de perfil na nuvem." })
    }
})

// URL: DELETE http://localhost:8080/v1/conectaBook/usuarios/:id
router.delete('/:id', cors(), async function (request, response) {
    let idUsuario = request.params.id
    let result = await controllerUsuario.excluirUsuario(idUsuario)
    response.status(result.status_code).json(result)
})

module.exports = router