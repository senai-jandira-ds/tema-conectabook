/*******************************************************************************************
 * Objetivo: Arquivo responsável pelas rotas de Membros (Relacionamento Usuário/Clube)
 * Projeto: ConectaBook
 * Data: 14/05/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.0
 *******************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const router = express.Router() 
const bodyParserJson = bodyParser.json()

// Importação da Controller de Membros
const controllerMembros = require('../controller/membros/membros_controller.js')

// Configuração do CORS
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// --- ENDPOINTS DE CONSULTA (GET) ---

// URL: GET http://localhost:8080/v1/conectaBook/membros
// GET - Lista todos os vínculos de membros do banco
router.get('/', cors(), async function(request, response){
    let dados = await controllerMembros.listarMembros()
    response.status(dados.status_code).json(dados)
})

// URL: GET http://localhost:8080/v1/conectaBook/membros/:id
// GET - Retorna os detalhes de um vínculo específico pelo ID da tabela tbl_membros
router.get('/:id', cors(), async function(request, response){
    let id = request.params.id
    let dados = await controllerMembros.listarMembroID(id)
    response.status(dados.status_code).json(dados)
})

// URL: GET http://localhost:8080/v1/conectaBook/membros/clube/:id
// GET - Retorna todos os usuários que pertencem a um clube específico
router.get('/clube/:id', cors(), async function(request, response){
    let idClube = request.params.id
    let dados = await controllerMembros.listarMembrosPorClubeID(idClube)
    response.status(dados.status_code).json(dados)
})

// URL: GET http://localhost:8080/v1/conectaBook/membros/usuario/:id
// GET - Retorna todos os clubes que um usuário participa
router.get('/usuario/:id', cors(), async function(request, response){
    let idUsuario = request.params.id
    let dados = await controllerMembros.listarClubesPorUsuarioID(idUsuario)
    response.status(dados.status_code).json(dados)
})

// URL: GET http://localhost:8080/v1/conectaBook/membros/usuario/:id/admin
// GET - Retorna os clubes onde o usuário é administrador
router.get('/usuario/:id/admin', cors(), async function(request, response){
    let idUsuario = request.params.id
    let dados = await controllerMembros.listarClubesAdminPorUsuarioID(idUsuario)
    response.status(dados.status_code).json(dados)
})

// --- ENDPOINTS DE MANIPULAÇÃO (POST, PUT, DELETE) ---

// URL: POST http://localhost:8080/v1/conectaBook/membros
// POST - Adiciona um usuário a um clube (vínculo de membro)
router.post('/', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    // Aqui você definiu a variável como "dados"
    let dados = await controllerMembros.criarMembro(dadosBody, contentType)
    
    // CORRIGIDO: Trocado .json(result) para .json(dados)
    response.status(dados.status_code).json(dados)
})

// URL: PUT http://localhost:8080/v1/conectaBook/membros/:id
// PUT - Atualiza o status de um membro (ex: torná-lo administrador)
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    let idMembro = request.params.id
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    // ORDEM CORRETA: (corpo, tipo, id)
    let dados = await controllerMembros.atualizarMembro(dadosBody, contentType, idMembro)

    response.status(dados.status_code).json(dados)
})

// URL: DELETE http://localhost:8080/v1/conectaBook/membros/:id
// DELETE - Remove um usuário de um clube pelo ID do vínculo
router.delete('/:id', cors(), async function(request, response){
    let idMembro = request.params.id
    let dados = await controllerMembros.excluirMembro(idMembro)
    response.status(dados.status_code).json(dados)
})

// URL: DELETE http://localhost:8080/v1/conectaBook/membros/clube/:id
// DELETE - Remove todos os membros de um clube (Útil ao excluir um clube)
router.delete('/clube/:id', cors(), async function(request, response){
    let idClube = request.params.id
    let dados = await controllerMembros.excluirMembrosPorIdClube(idClube)
    response.status(dados.status_code).json(dados)
})

module.exports = router;