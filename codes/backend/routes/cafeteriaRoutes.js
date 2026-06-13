/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realizacão das rotas de Cafeterias 
 * Projeto: ConectaBook
 * Data: 13/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.1
 *******************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const router = express.Router() 
const bodyParserJson = bodyParser.json()

const controllerCafeteria = require('../controller/cafeteria/cafeteria_controller.js')

// Configuração do CORS local para as rotas
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// ENDPOINTS CAFETERIAS

// URL: GET http://localhost:8080/v1/conectaBook/cafeterias
// GET - Retorna uma lista de cafeterias do BD
router.get('/', cors(), async function(request, response){
    // Chamada da função listarCafeterias da controller
    let dadosCafeterias = await controllerCafeteria.listarCafeteria()

    console.log(dadosCafeterias)
    response.status(dadosCafeterias.status_code)
    response.json(dadosCafeterias)
})

// URL: GET http://localhost:8080/v1/conectaBook/cafeterias/:id
// GET - Retorna cafeterias do BD filtrando pelo ID
router.get('/:id', cors(), async function (request, response) {
    let idCafeteria = request.params.id

    let dadosCafeterias = await controllerCafeteria.listarCafeteriaID(idCafeteria)

    response.status(dadosCafeterias.status_code)
    response.json(dadosCafeterias)
})

// URL: POST http://localhost:8080/v1/conectaBook/cafeterias
// POST - Insere uma nova cafeteria no BD
router.post('/', cors(), bodyParserJson, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    // Chama a função criarCafeteria enviando os dados e o content-type
    let dadosCafeterias = await controllerCafeteria.criarCafeteria(dadosBody, contentType)

    response.status(dadosCafeterias.status_code)
    response.json(dadosCafeterias)
})

// URL: PUT http://localhost:8080/v1/conectaBook/cafeterias/:id
// PUT - Atualiza uma cafeteria no BD
router.put('/:id', cors(), bodyParserJson, async function(request, response){
    let dadosBody = request.body
    let idCafeteria = request.params.id
    let contentType = request.headers['content-type']

    // Chama a função atualizarCafeteria da controller
    let dadosCafeterias = await controllerCafeteria.atualizarCafeteria(dadosBody, contentType, idCafeteria)

    response.status(dadosCafeterias.status_code)
    response.json(dadosCafeterias)
})

// URL: DELETE http://localhost:8080/v1/conectaBook/cafeterias/:id
// DELETE - Deleta um registro de uma cafeteria no BD
router.delete('/:id', cors(), async function (request, response) {
    let idCafeteria = request.params.id

    let dadosCafeterias = await controllerCafeteria.excluirCafeteria(idCafeteria)

    response.status(dadosCafeterias.status_code)
    response.json(dadosCafeterias)
    
})

module.exports = router