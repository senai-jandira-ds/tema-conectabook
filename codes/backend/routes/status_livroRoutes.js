/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização das rotas de status livro
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

const controllerStatusLivro = require('../controller/status_livro/status_livro_controller.js')

// Configuração do CORS local para as rotas
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// ENDPOINTS STATUS LIVRO

// GET - Retorna uma lista de STATUS LIVRO do BD
router.get('/', cors(), async function(request, response){
    
    let dadosStatusLivro = await controllerStatusLivro.listarStatusLivro()

    console.log(dadosStatusLivro)
    response.status(dadosStatusLivro.status_code)
    response.json(dadosStatusLivro)
})

// GET - Retorna uma status livro do BD filtrando pelo ID
router.get('/:id', cors(), async function(request, response){
    let idStatuslivro = request.params.id

   
    let dadosStatusLivro = await controllerStatusLivro.listarStatusLivroID(idStatuslivro)
    response.status(dadosStatusLivro.status_code)
    response.json(dadosStatusLivro)
})

// POST - Insere um novo status livro dentro do BD
router.post('/', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    
    let dadosStatusLivro = await controllerStatusLivro.criarStatusLivro(dadosBody, contentType)

    response.status(dadosStatusLivro.status_code)
    response.json(dadosStatusLivro)
})

// PUT - Atualiza um status livro dentro do BD
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    let dadosBody = request.body
    let idStatuslivro= request.params.id
    let contentType = request.headers['content-type']

    // Chama a função atualizarStatusLivro da controller
    let dadosStatusLivro = await controllerStatusLivro.atualizarStatusLivro(dadosBody, contentType, idStatuslivro)

    response.status(dadosStatusLivro.status_code)
    response.json(dadosStatusLivro)
})

// DELETE - Deleta um registro de um genero do BD
router.delete('/:id', cors(), async function(request, response){
    let idStatuslivro = request.params.id

    // Chama a função excluirGenero da controller
    let dadosStatusLivro = await controllerStatusLivro.excluirStatusLivro(idStatuslivro)

    response.status(dadosStatusLivro.status_code)
    response.json(dadosStatusLivro)
})

module.exports = router