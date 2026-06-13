/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização das rotas de autenticação
 * Projeto: ConectaBook
 * Data: 27/05/2026
 * Autor: Alex Gomes
 * Versão: 1.2
 *******************************************************************************************/

const express = require('express')
const router = express.Router()
const authController = require('../controller/auth/auth_controller.js')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()
const cors = require('cors')

// http://localhost:8080/v1/conectaBook/auth/login
// Rota para realizar o login
router.post('/login', jsonParser, async function(request, response) {
    // Pegamos o Content-Type e o corpo da requisição
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    // Chama a controller que agora valida senha e gera o Token
    let result = await authController.validarLogin(dadosBody, contentType);

    // Verificação de segurança caso a controller falhe
    if (result) {
        return response.status(result.status_code).json(result);
    } else {
        return response.status(500).json({
            status: false,
            status_code: 500,
            message: "Erro interno no servidor de autenticação."
        })
    }
})

// URL: POST http://localhost:8080/v1/conectaBook/auth/recuperar-senha
router.post('/recuperar-senha', cors(), jsonParser, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let dados = await authController.solicitarRecuperacaoSenha(dadosBody, contentType)
    response.status(dados.status_code).json(dados)
})

// URL: POST http://localhost:8080/v1/conectaBook/auth/validar-codigo
router.post('/validar-codigo', cors(), jsonParser, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let dados = await authController.validarCodigoRecuperacao(dadosBody, contentType)
    response.status(dados.status_code).json(dados)
})

// URL: POST http://localhost:8080/v1/conectaBook/auth/redefinir-senha
router.post('/redefinir-senha', cors(), jsonParser, async function(request, response) {
    let dadosBody = request.body
    let contentType = request.headers['content-type']

    let dados = await authController.redefinirSenha(dadosBody, contentType)
    response.status(dados.status_code).json(dados)
})

module.exports = router;