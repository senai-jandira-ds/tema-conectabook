/*******************************************************************************************
 * Objetivo: Arquivo responsável pelas rotas da Estante (Gerenciamento de livros do usuário)
 * Projeto: ConectaBook
 * Data: 01/06/2026
 * Autor: Alex Gomes
 * Versão: 1.1
 *******************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const router = express.Router()
const bodyParserJson = bodyParser.json()

// Importação da Controller da Estante
const controllerEstante = require('../controller/estante/estante_controller.js') // Ajuste o caminho se necessário

// Configuração do CORS local para as rotas
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// =========================================================================
// ENDPOINTS: FILTROS DE STATUS DE LEITURA (GET)
// Base global configurada no app.js: /v1/conectaBook/estante
// =========================================================================

// URL: GET http://localhost:8080/v1/conectaBook/estante/usuario/:id/lido
// GET - Retorna os livros que o usuário já LEU
router.get('/usuario/:id/lido', cors(), async function (request, response) {
    let idUsuario = request.params.id
    let dados = await controllerEstante.listarLivrosLidos(idUsuario)
    response.status(dados.status_code).json(dados)
})

// URL: GET http://localhost:8080/v1/conectaBook/estante/usuario/:id/lendo
// GET - Retorna os livros que o usuário está LENDO atualmente
router.get('/usuario/:id/lendo', cors(), async function (request, response) {
    let idUsuario = request.params.id
    let dados = await controllerEstante.listarLivrosLendo(idUsuario)
    response.status(dados.status_code).json(dados)
})

// URL: GET http://localhost:8080/v1/conectaBook/estante/usuario/:id/quero-ler
// GET - Retorna os livros que o usuário QUER LER
router.get('/usuario/:id/quero-ler', cors(), async function (request, response) {
    let idUsuario = request.params.id
    let dados = await controllerEstante.listarLivrosQueroLer(idUsuario)
    response.status(dados.status_code).json(dados)
})


// =========================================================================
// ENDPOINTS DO CRUD TRADICIONAL DA ESTANTE
// =========================================================================

// URL: GET http://localhost:8080/v1/conectaBook/estante
// GET - Retorna o histórico bruto de todos os registros de estante do BD
router.get('/', cors(), async function (request, response) {
    let dados = await controllerEstante.listarTodasEstantes()
    response.status(dados.status_code).json(dados)
})

// URL: GET http://localhost:8080/v1/conectaBook/estante/:id
// GET - Retorna um registro específico de estante filtrando pelo ID único da tabela
router.get('/:id', cors(), async function (request, response) {
    let idEstante = request.params.id
    let dados = await controllerEstante.buscarEstantePorId(idEstante)
    response.status(dados.status_code).json(dados)
})

// URL: GET http://localhost:8080/v1/conectaBook/estante/usuario/:id
// GET - Retorna a estante completa de um usuário específico (todos os livros juntos)
router.get('/usuario/:id', cors(), async function (request, response) {
    let idUsuario = request.params.id
    let dados = await controllerEstante.listarEstantePorUsuario(idUsuario)
    response.status(dados.status_code).json(dados)
})

// URL: POST http://localhost:8080/v1/conectaBook/estante
// POST - Vincula um novo livro à estante de um usuário
router.post('/', cors(), bodyParserJson, async function (request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let dados = await controllerEstante.criarItemEstante(dadosBody, contentType)
    response.status(dados.status_code).json(dados)
})

// URL: PUT http://localhost:8080/v1/conectaBook/estante/:id
// PUT - Atualiza as informações (como trocar o id_status_livro) de um item da estante
router.put('/:id', cors(), bodyParserJson, async function (request, response) {
    let idEstante = request.params.id
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let dados = await controllerEstante.atualizarItemEstante(dadosBody, contentType, idEstante)
    response.status(dados.status_code).json(dados)
})

// URL: DELETE http://localhost:8080/v1/conectaBook/estante/:id
// DELETE - Remove um livro específico da estante pelo ID do registro
router.delete('/:id', cors(), async function (request, response) {
    let idEstante = request.params.id
    let dados = await controllerEstante.excluirItemEstante(idEstante)
    response.status(dados.status_code).json(dados)
})

module.exports = router