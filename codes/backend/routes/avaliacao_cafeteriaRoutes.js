/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização das rotas de avaliações de cafeterias
 * Projeto: ConectaBook
 * Data: 26/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.0
 *******************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const router = express.Router() 
const bodyParserJson = bodyParser.json()

const controllerAvalCafeteria = require('../controller/avaliacao_cafeteria/avaliacao_cafeteria_controller.js')

// Configuração do CORS local para as rotas
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// ENDPOINTS - AVALIAÇÃO CAFETERIA

// http://localhost:8080/v1/conectaBook/avaliacao-cafeteria
// GET - Retorna uma lista de todos os relacionamentos avaliação_cafeteria do BD 
router.get('/', cors(), async function (request, response) {
    let dados = await controllerAvalCafeteria.listarAvaliacoesCafeterias()
    response.status(dados.status_code).json(dados)
})

// http://localhost:8080/v1/conectaBook/avaliacao-cafeteria/:id
// GET - Retorna um relacionamento pelo ID próprio dele
router.get('/:id', cors(), async function(request, response){
    let id = request.params.id
    let dados = await controllerAvalCafeteria.listarAvaliacaoCafeteriaID(id)
    response.status(dados.status_code).json(dados)
})

// http://localhost:8080/v1/conectaBook/avaliacao-cafeteria/cafeteria/:id
// GET - Retorna todas as avaliações de uma cafeteria específica (Usando ID da Cafeteria)
router.get('/cafeteria/:idCafeteria', cors(), async function(request, response){
    let idCafeteria = request.params.idCafeteria
    let dados = await controllerAvalCafeteria.listarAvaliacoesPorCafeteria(idCafeteria)
    response.status(dados.status_code).json(dados)
})

// http://localhost:8080/v1/conectaBook/avaliacao-livro/usuario/:id
// GET - Retorna todas as avaliações que um usuário específico fez em cafeterias (Usando ID do Usuário)
router.get('/usuario/:idUsuario', cors(), async function(request, response){
    let idUsuario = request.params.idUsuario
    let dados = await controllerAvalCafeteria.listarAvaliacoesPorUsuario(idUsuario)
    response.status(dados.status_code).json(dados)
})

// http://localhost:8080/v1/conectaBook/avaliacao-cafeteria/estatisticas/cafeteria/:id
// GET - Retorna estatísticas (total e média de estrelas) de uma cafeteria específica
router.get('/estatisticas/cafeteria/:idCafeteria', cors(), async function(request, response){
    let idCafeteria = request.params.idCafeteria
    let dados = await controllerAvalCafeteria.listarEstatisticasPorCafeteria(idCafeteria)
    response.status(dados.status_code).json(dados)
})

// http://localhost:8080/v1/conectaBook/avaliacao-cafeteria
// POST - Vincula uma nova avaliação a uma cafeteria
router.post('/', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let dados = await controllerAvalCafeteria.criarAvaliacaoCafeteria(dadosBody, contentType)
    response.status(dados.status_code).json(dados)
})

// http://localhost:8080/v1/conectaBook/avaliacao-cafeteria/1
// PUT - Atualiza os vínculos de uma avaliação_cafeteria existente
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    let dadosBody = request.body
    let id = request.params.id
    let contentType = request.headers['content-type']

    let dados = await controllerAvalCafeteria.atualizarAvaliacaoCafeteria(dadosBody, contentType, id)
    response.status(dados.status_code).json(dados)
})

// http://localhost:8080/v1/conectaBook/avaliacao-cafeteria/:id
// DELETE - Desvincula/Deleta uma avaliação de uma cafeteria do BD
router.delete('/:id', cors(), async function(request, response){
    let id = request.params.id

    let dados = await controllerAvalCafeteria.excluirAvaliacaoCafeteria(id)
    response.status(dados.status_code).json(dados)
})

module.exports = router;