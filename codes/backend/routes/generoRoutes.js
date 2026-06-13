/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização das rotas de generos 
 * Projeto: ConectaBook
 * Data: 06/05/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.1
 *******************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const router = express.Router() 
const bodyParserJson = bodyParser.json()

const controllerGenero = require('../controller/genero/genero_controller.js')

// Configuração do CORS local para as rotas
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// ENDPOINTS GENEROS

// URL: GET http://localhost:8080/v1/conectaBook/generos
// GET - Retorna uma lista de generos do BD
router.get('/', cors(), async function(request, response){
    // Chamada da função listarGeneros da controller
    let dadosGeneros = await controllerGenero.listarGeneros()

    console.log(dadosGeneros)
    response.status(dadosGeneros.status_code)
    response.json(dadosGeneros)
})

// URL: GET http://localhost:8080/v1/conectaBook/generos/:id
// GET - Retorna um generos do BD filtrando pelo ID
router.get('/:id', cors(), async function(request, response){
    let idGenero = request.params.id

    // Chamada da função listarGenerosID validada manualmente na controller
    let dadosGeneros = await controllerGenero.listarGeneroID(idGenero)

    response.status(dadosGeneros.status_code)
    response.json(dadosGeneros)
})

// URL: POST http://localhost:8080/v1/conectaBook/generos
// POST - Insere um novo genero dentro do BD
router.post('/', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    // Chama a função criarGenero enviando os dados e o content-type
    let dadosGeneros = await controllerGenero.criarGenero(dadosBody, contentType)

    response.status(dadosGeneros.status_code)
    response.json(dadosGeneros)
})

// URL: PUT http://localhost:8080/v1/conectaBook/generos/:id
// PUT - Atualiza um genero dentro do BD
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    let dadosBody = request.body
    let idGenero = request.params.id
    let contentType = request.headers['content-type']

    // Chama a função atualizarGenero da controller
    let dadosGeneros = await controllerGenero.atualizarGenero(dadosBody, contentType, idGenero)

    response.status(dadosGeneros.status_code)
    response.json(dadosGeneros)
})

// URL: DELETE http://localhost:8080/v1/conectaBook/generos/:id
// DELETE - Deleta um registro de um genero do BD
router.delete('/:id', cors(), async function(request, response){
    let idGenero = request.params.id

    // Chama a função excluirGenero da controller
    let dadosGeneros = await controllerGenero.excluirGenero(idGenero)

    response.status(dadosGeneros.status_code)
    response.json(dadosGeneros)
})

module.exports = router