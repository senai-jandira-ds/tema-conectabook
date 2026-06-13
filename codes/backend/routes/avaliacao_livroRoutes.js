/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização das rotas de avaliações de livros
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

const controllerAvalLivro = require('../controller/avaliacao_livro/avaliacao_livro_controller.js')

// Configuração do CORS local para as rotas
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// ENDPOINTS - AVALIAÇÃO LIVRO

// GET - Retorna uma lista de todos os relacionamentos
router.get('/', cors(), async function (request, response) {
    let dados = await controllerAvalLivro.listarAvaliacoesLivros()
    response.status(dados.status_code).json(dados)
})

// GET - Retorna um relacionamento pelo ID próprio dele (ID numérico incremental)
router.get('/:id', cors(), async function(request, response){
    let id = request.params.id
    let dados = await controllerAvalLivro.listarAvaliacaoLivroID(id)
    response.status(dados.status_code).json(dados)
})

// AJUSTADO: GET - Retorna todas as avaliações de um livro específico (Usando String da API)
router.get('/livro/:idLivro', cors(), async function(request, response){
    let idLivro = request.params.idLivro
    let dados = await controllerAvalLivro.listarAvaliacoesPorLivro(idLivro)
    response.status(dados.status_code).json(dados)
})

// GET - Retorna todas as avaliações que um usuário específico fez em livros (Usando ID numérico do Usuário)
router.get('/usuario/:idUsuario', cors(), async function(request, response){
    let idUsuario = request.params.idUsuario
    let dados = await controllerAvalLivro.listarAvaliacoesPorUsuario(idUsuario)
    response.status(dados.status_code).json(dados)
})

// AJUSTADO: GET - Retorna estatísticas (total e média de estrelas) de um livro específico (Usando String da API)
router.get('/estatisticas/livro/:idLivro', cors(), async function(request, response){
    let idLivro = request.params.idLivro
    let dados = await controllerAvalLivro.listarEstatisticasPorLivro(idLivro)
    response.status(dados.status_code).json(dados)
})

// POST - Vincula uma nova avaliação a um livro (id_livro string no body)
router.post('/', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let dados = await controllerAvalLivro.criarAvaliacaoLivro(dadosBody, contentType)
    response.status(dados.status_code).json(dados)
})

// PUT - Atualiza os vínculos de uma avaliação_livro existente
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    let dadosBody = request.body
    let id = request.params.id
    let contentType = request.headers['content-type']

    let dados = await controllerAvalLivro.atualizarAvaliacaoLivro(dadosBody, contentType, id)
    response.status(dados.status_code).json(dados)
})

// DELETE - Desvincula/Deleta uma avaliação de um livro do BD
router.delete('/:id', cors(), async function(request, response){
    let id = request.params.id

    let dados = await controllerAvalLivro.excluirAvaliacaoLivro(id)
    response.status(dados.status_code).json(dados)
})

module.exports = router;