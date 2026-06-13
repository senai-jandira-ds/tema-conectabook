/*******************************************************************************************
 * Objetivo: Arquivo responsável pelas rotas do histórico de acessos de livros
 * Projeto: ConectaBook
 * Data: 01/06/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.1
 *******************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const router = express.Router() 
const bodyParserJson = bodyParser.json()

const controllerAcesso = require('../controller/acesso_livro/acesso_controller.js')

// Configuração do CORS local
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    next()
})

// ENDPOINTS ACESSOS

// GET - Retorna o histórico de acessos geral do sistema
router.get('/', cors(), async function(request, response){
    let dados = await controllerAcesso.listarAcessos()
    response.status(dados.status_code).json(dados)
})

// GET - Retorna os dados de um acesso único pelo ID incremental da intermediária
router.get('/:id', cors(), async function(request, response){
    let idAcesso = request.params.id
    let dados = await controllerAcesso.buscarAcessoPorId(idAcesso)
    response.status(dados.status_code).json(dados)
})

// GET - Retorna todo o histórico de um usuário específico (id_usuario numérico)
router.get('/usuario/:id', cors(), async function(request, response){
    let idUsuario = request.params.id
    let dados = await controllerAcesso.listarHistoricoDoUsuario(idUsuario)
    response.status(dados.status_code).json(dados)
})

// POST - Registra um novo acesso quando o usuário entra na tela do livro (id_livro string no body)
router.post('/', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let result = await controllerAcesso.registrarAcesso(dadosBody, contentType)
    response.status(result.status_code).json(result)
})

// DELETE - Remove um registro do histórico pelo ID único da tabela intermediária
router.delete('/:id', cors(), async function(request, response){
    let idAcesso = request.params.id

    let result = await controllerAcesso.excluirAcesso(idAcesso)
    response.status(result.status_code).json(result)
})

module.exports = router;