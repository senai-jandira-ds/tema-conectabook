/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização das rotas de notificacoes
 * Projeto: ConectaBook
 * Data: 02/06/2026
 * Autor: Geovanna Silva de Sousa / Alex Gomes
 * Versão: 1.2
 *******************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const router = express.Router()
const bodyParserJson = bodyParser.json()

const controllerNotificacao = require('../controller/notificacao/notificacao_controller.js')

// Configuração do CORS local para as rotas
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// =========================================================================
// ENDPOINTS DE BUSCA (GET)
// =========================================================================

// URL: GET http://localhost:8080/v1/conectaBook/notificacao
// GET - Retorna uma lista de todas as notificacoes do bd
router.get('/', cors(), async function (request, response) {
    let dadosNotificacoes = await controllerNotificacao.listarNotificacoes()
    response.status(dadosNotificacoes.status_code).json(dadosNotificacoes)
})

// URL: GET http://localhost:8080/v1/conectaBook/notificacao/:id
// GET - Retorna uma notificacao filtrando pelo ID dela
router.get('/:id', cors(), async function (request, response) {
    let idNotificacao = request.params.id
    let dadosNotificacoes = await controllerNotificacao.listarNotificacaoId(idNotificacao)
    response.status(dadosNotificacoes.status_code).json(dadosNotificacoes)
})

// URL: GET http://localhost:8080/v1/conectaBook/notificacao/usuario/:id
// GET - Retorna todas as notificações de um usuário específico
router.get('/usuario/:id', cors(), async function (request, response) {
    let idUsuario = request.params.id
    let dadosNotificacoes = await controllerNotificacao.listarNotificacoesIdUsuario(idUsuario)
    response.status(dadosNotificacoes.status_code).json(dadosNotificacoes)
})

// =========================================================================
// ENDPOINTS DE MANIPULAÇÃO (POST / PUT)
// =========================================================================

// URL: POST http://localhost:8080/v1/conectaBook/notificacao
// INSERT - Insere uma nova notificação no BD
router.post('/', cors(), bodyParserJson, async function (request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    // Chama a controller enviando o corpo da requisição e o content-type
    let dadosNotificacoes = await controllerNotificacao.criarNotificacao(dadosBody, contentType)

    response.status(dadosNotificacoes.status_code).json(dadosNotificacoes)
})

// URL: PUT http://localhost:8080/v1/conectaBook/notificacao/:id
// PUT - Atualiza uma notificação no BD
// URL: PUT http://localhost:8080/v1/conectaBook/notificacao/1
router.put('/:id', cors(), bodyParserJson, async function (request, response) {
    let dadosBody = request.body
    let idNotificacao = request.params.id
    let contentType = request.headers['content-type']

    let dadosNotificacoes = await controllerNotificacao.atualizarNotificacao(dadosBody, contentType, idNotificacao)

    response.status(dadosNotificacoes.status_code).json(dadosNotificacoes)
})

// =========================================================================
// ENDPOINTS DE EXCLUSÃO (DELETE)
// =========================================================================

// URL: DELETE http://localhost:8080/v1/conectaBook/notificacao/:id
// DELETE - Deleta um registro de uma notificação no BD
router.delete('/:id', cors(), async function (request, response) {
    let idNotificacao = request.params.id // CORRIGIDO: Atribuição correta do parâmetro

    // CORRIGIDO: Removido chamada duplicada desnecessária
    let dadosNotificacoes = await controllerNotificacao.excluirNotificacao(idNotificacao)

    response.status(dadosNotificacoes.status_code).json(dadosNotificacoes)
})

module.exports = router