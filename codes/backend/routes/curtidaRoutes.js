/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realizacão das rotas de Curtidas
 * Projeto: ConectaBook
 * Data: 26/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.1
 *******************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const router = express.Router()
const bodyParserJson = bodyParser.json()

const controllerCurtida = require('../controller/curtida/curtida_controller')


// Configuração do CORS local para as rotas
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

// ENDPOINTS Curtidas

// GET - Retorna uma lista de curtidas do BD
router.get('/', cors(), async function (request, response) {
    // Chamada da função listarCurtidas da controller
    let dadosCurtidas = await controllerCurtida.listarTodasCurtidas()

    console.log(dadosCurtidas)
    response.status(dadosCurtidas.status_code)
    response.json(dadosCurtidas)
})

// GET - Retorna uma curtida do BD filtrando pelo o ID
router.get('/:id', cors(), async function (request, response) {
    // 1. Pega o ID enviado pela URL
    let idCurtida = request.params.id;

    // CORRIGIDO: Agora chamando a função corretamente e passando o ID por parâmetro ()
    let dadosCurtidas = await controllerCurtida.buscarCurtidaPorId(idCurtida);

    // 2. Envia a resposta com o status correto
    response.status(dadosCurtidas.status_code);
    response.json(dadosCurtidas);
});

// GET - Retorna uma curtida do BD filtrando pela mensagem
router.get('/mensagem/:id', cors(), async function (request, response) {
    // 1. Pega o ID enviado pela URL
    let idMensagem = request.params.id;

    // CORRIGIDO: Agora chamando a função corretamente e passando o ID por parâmetro ()
    let dadosCurtidas = await controllerCurtida.listarCurtidasPorMensagem(idMensagem);

    // 2. Envia a resposta com o status correto
    response.status(dadosCurtidas.status_code);
    response.json(dadosCurtidas);
});

// POST - Insere uma nova curtida no BD
router.post('/', cors(), bodyParserJson, async function (request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let dadosCurtidas = await controllerCurtida.inserirCurtida(dadosBody, contentType)

    response.status(dadosCurtidas.status_code)
    response.json(dadosCurtidas)

})


//DELETE - Deleta uma curtida do BD
router.delete('/:id', cors(), async function (request, response) {
    let idCurtida = request.params.id

    let dadosCurtidas = await controllerCurtida.excluirCurtida(idCurtida)

    response.status(dadosCurtidas.status_code)
    response.json(dadosCurtidas)

})

module.exports = router