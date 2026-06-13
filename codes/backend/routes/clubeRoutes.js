/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização das rotas de clubes (Nuvem Azure)
 * Projeto: ConectaBook
 * Data: 03/06/2026
 * Autor: Geovanna Silva / Alex Gomes
 * Versão: 1.2
 *******************************************************************************************/

const express = require('express')
const router = express.Router()
const cors = require('cors')

// Importações das configurações centralizadas do projeto
const upload = require('../config/multer.js')
const { uploadFileToAzure } = require('../model/DAO/azure/azureStorage.js')
const controllerClube = require('../controller/clube/clube_controller.js')

// Configuração do CORS para as rotas
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// URL: GET http://localhost:8080/v1/conectaBook/clubes
router.get('/', cors(), async function (request, response) {
    let dadosClube = await controllerClube.listarClubes()
    response.status(dadosClube.status_code).json(dadosClube)
})

// URL: GET http://localhost:8080/v1/conectaBook/clubes/:id
router.get('/:id', cors(), async function (request, response) {
    let idClube = request.params.id
    let dadosClube = await controllerClube.listarClubeID(idClube)
    response.status(dadosClube.status_code).json(dadosClube)
})

// URL: GET http://localhost:8080/v1/conectaBook/clubes/genero/:id
// Nota: Ajustada a URL para diferenciar da busca por ID do clube
router.get('/genero/:id', cors(), async function (request, response) {
    let idGenero = request.params.id;
    let result = await controllerClube.listarClubesPorGenero(idGenero);
    response.status(result.status_code).json(result);
});

// URL: POST http://localhost:8080/v1/conectaBook/clubes
// MODIFICADO: Upload da foto do clube enviado para a pasta virtual 'clubes' na Azure
router.post('/', cors(), upload.single('foto'), async function (request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    try {
        if (request.file) {
            const urlAzure = await uploadFileToAzure(request.file, 'clubes')
            dadosBody.foto = urlAzure
        } else {
            dadosBody.foto = null
        }

        let dadosClube = await controllerClube.criarClube(dadosBody, contentType)
        response.status(dadosClube.status_code).json(dadosClube)

    } catch (error) {
        console.error("🚨 Erro na Rota POST Clubes:", error.message)
        response.status(500).json({ status: false, message: "Erro no upload da foto do clube para a nuvem." })
    }
})

// URL: PUT http://localhost:8080/v1/conectaBook/clubes/:id
// MODIFICADO: Adicionado suporte a upload caso queiram atualizar a foto de capa do clube
router.put('/:id', cors(), upload.single('foto'), async function (request, response) {
    let dadosBody = request.body
    let idClube = request.params.id
    let contentType = request.headers['content-type']

    try {
        if (request.file) {
            const urlAzure = await uploadFileToAzure(request.file, 'clubes')
            dadosBody.foto = urlAzure
        }

        let dadosClube = await controllerClube.atualizarClube(dadosBody, contentType, idClube)
        response.status(dadosClube.status_code).json(dadosClube)

    } catch (error) {
        console.error("🚨 Erro na Rota PUT Clubes:", error.message)
        response.status(500).json({ status: false, message: "Erro ao atualizar foto do clube na nuvem." })
    }
})

// URL: DELETE http://localhost:8080/v1/conectaBook/clubes/:id
router.delete('/:id', cors(), async function (request, response) {
    let idClube = request.params.id
    let dadosClube = await controllerClube.excluirClube(idClube)
    response.status(dadosClube.status_code).json(dadosClube)
})

module.exports = router