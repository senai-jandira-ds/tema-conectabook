/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização das rotas de Livros
 * Projeto: ConectaBook
 * Data: 15/05/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.0
 *******************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const router = express.Router() 
const bodyParserJson = bodyParser.json()

// Importação da Controller de Livros da Geovanna
const controllerLivro = require('../controller/livro/livro_controller.js') // Ajuste o caminho se necessário

// Configuração do CORS local para as rotas
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// ENDPOINTS LIVROS

// URL: GET http://localhost:8080/v1/conectaBook/livros
// GET - Retorna uma lista de todos os livros
router.get('/', cors(), async function(request, response){
    // Chamada da função listarLivros da controller
    let dadosLivros = await controllerLivro.listarLivros()

    response.status(dadosLivros.status_code)
    response.json(dadosLivros)
})

// URL: GET http://localhost:8080/v1/conectaBook/livros/:id
// GET - Retorna um livro filtrando pelo ID
router.get('/:id', cors(), async function(request, response){
    let idLivro = request.params.id

    // Chamada da função listarLivrosID passando o parâmetro recebido por URL
    let dadosLivro = await controllerLivro.listarLivrosID(idLivro)

    response.status(dadosLivro.status_code)
    response.json(dadosLivro)
})

// URL: POST http://localhost:8080/v1/conectaBook/livros
// POST - Insere um novo livro dentro do Banco de Dados
router.post('/', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    // Chama a função criarLivro enviando o corpo da requisição e o content-type
    let result = await controllerLivro.criarLivro(dadosBody, contentType)

    response.status(result.status_code)
    response.json(result)
})

// URL: PUT http://localhost:8080/v1/conectaBook/livros/:id
// PUT - Atualiza os dados de um livro buscando pelo ID
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    let dadosBody = request.body
    let idLivro = request.params.id
    let contentType = request.headers['content-type']

    // Chama a função atualizarLivro da controller passando os argumentos na ordem correta
    let result = await controllerLivro.atualizarLivro(dadosBody, contentType, idLivro)

    response.status(result.status_code)
    response.json(result)
})

// URL: DELETE http://localhost:8080/v1/conectaBook/livros/:id
// DELETE - Deleta o registro de um livro filtrando pelo ID
router.delete('/:id', cors(), async function(request, response){
    let idLivro = request.params.id

    // Chama a função excluirLivro da controller
    let result = await controllerLivro.excluirLivro(idLivro)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router