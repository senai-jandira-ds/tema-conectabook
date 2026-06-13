/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização das rotas de avaliações 
 * Projeto: ConectaBook
 * Data: 21/05/2026
 * Autor: Alex Gomes
 * Versão: 1.0
 *******************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const router = express.Router() 
const bodyParserJson = bodyParser.json()

const controllerAval = require('../controller/avaliacao/avaliacao_controller.js')

// Configuração do CORS local para as rotas
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

//ENDPOINTS AVALIAÇÕES

// http://localhost:8080/v1/conectaBook/avaliacao
//GET - Retorna uma lista de avaliações do BD
router.get('/', cors(), async function (request, response) {
    //Chamada da função listarAvaliacos da controller
    let dadosAval = await controllerAval.listarAvaliacoes()
    
    response.status(dadosAval.status_code)
    response.json(dadosAval)
})

// http://localhost:8080/v1/conectaBook/avaliacao/:id
//GET - Retorna uma avaliação do BD filtrando pelo ID
router.get('/:id', cors(), async function(request, response){
    let idAval = request.params.id

    // Chamada da função listarAvaliacaoID validada manualmente na controller
    let dadosAval = await controllerAval.listarAvaliacaoID(idAval)

    response.status(dadosAval.status_code)
    response.json(dadosAval)
})

// http://localhost:8080/v1/conectaBook/avaliacao
// POST - Insere uma nova avaliação dentro do BD
router.post('/', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    // Chama a função criarAvaliacao enviando os dados e o content-type
    let dadosAval = await controllerAval.criarAvaliacao(dadosBody, contentType)

    response.status(dadosAval.status_code)
    response.json(dadosAval)
})

// http://localhost:8080/v1/conectaBook/avaliacao/:id
// PUT - Atualiza uma avaliacao dentro do BD
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    let dadosBody = request.body
    let idAval = request.params.id
    let contentType = request.headers['content-type']

    // Chama a função atualizarAvaliacao da controller
    let dadosAval = await controllerAval.atualizarAvaliacao(dadosBody, contentType, idAval)

    response.status(dadosAval.status_code)
    response.json(dadosAval)
})

// http://localhost:8080/v1/conectaBook/avaliacao/:id
// DELETE - Deleta um registro de uma avaliação do BD
router.delete('/:id', cors(), async function(request, response){
    let idAval = request.params.id

    // Chama a função excluirAvaliacao da controller
    let dadosAval = await controllerAval.excluirAvaliacao(idAval)

    response.status(dadosAval.status_code)
    response.json(dadosAval)
})

module.exports = router;