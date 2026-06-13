/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização das rotas de Mensagens e Feeds (Nuvem Azure)
 * Projeto: ConectaBook
 * Data: 03/06/2026
 * Autor: Alex Gomes
 * Versão: 1.7
 *******************************************************************************************/

const express = require('express');
const cors = require('cors')
const router = express.Router();

// CORRIGIDO: Importação do Multer em memória a partir da nova pasta config
const upload = require('../config/multer.js');

// CORRIGIDO: Importação do serviço da Azure respeitando o espaço na pasta "model / DAO"
const { uploadFileToAzure } = require('../model/DAO/azure/azureStorage.js');

const mensagemController = require('../controller/mensagens/mensagem_controller.js')
const curtidasController = require('../controller/curtida/curtida_controller.js')

// Configuração do CORS local para as rotas de mensagens
router.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    next()
})

module.exports = function(io) {

// =========================================================================
// ENDPOINTS DE BUSCA E FEEDS (GET)
// =========================================================================

// URL: GET http://localhost:8080/v1/conectaBook/mensagem
router.get('/', async function (request, response) {
    let dados = await mensagemController.listarTodasMensagens();
    response.status(dados.status_code).json(dados);
});

// URL: GET http://localhost:8080/v1/conectaBook/mensagem/feed/principal
router.get('/feed/principal', async function (request, response) {
    let dados = await mensagemController.listarFeedPrincipalGeral();
    response.status(dados.status_code).json(dados);
});

// URL: GET http://localhost:8080/v1/conectaBook/mensagem/clube/:id/mensagens
router.get('/clube/:id/mensagens', async function (request, response) {
    let idClube = request.params.id;
    let dados = await mensagemController.listarMensagensPorClube(idClube);
    response.status(dados.status_code).json(dados);
});

// URL: GET http://localhost:8080/v1/conectaBook/mensagem/clube/:id/mensagens/principais
router.get('/clube/:id/mensagens/principais', async function (request, response) {
    let idClube = request.params.id;
    let dados = await mensagemController.listarMensagensPrincipaisPorClube(idClube);
    response.status(dados.status_code).json(dados);
});

// URL: GET http://localhost:8080/v1/conectaBook/mensagem/:id
router.get('/:id', async function (request, response) {
    let idMensagem = request.params.id;
    let dados = await mensagemController.buscarMensagemPorId(idMensagem);
    response.status(dados.status_code).json(dados);
});

// URL: GET http://localhost:8080/v1/conectaBook/mensagem/:id/respostas
router.get('/:id/respostas', async function (request, response) {
    let idMensagemPai = request.params.id;
    let dados = await mensagemController.listarRespostasDeMensagem(idMensagemPai);
    response.status(dados.status_code).json(dados);
});

// URL: GET http://localhost:8080/v1/conectaBook/mensagem/:id/curtidas
router.get('/:id/curtidas', cors(), async function (request, response) {
    let idMensagem = request.params.id;
    let dados = await curtidasController.listarCurtidasPorMensagem(idMensagem);
    response.status(dados.status_code).json(dados);
});

// =========================================================================
// ENDPOINTS DE MANIPULAÇÃO DE CONTEÚDO (POST / PUT)
// =========================================================================

// URL: POST http://localhost:8080/v1/conectaBook/mensagem
router.post('/', cors(), upload.single('arquivo'), async function (request, response) {
        let dadosBody = request.body;
        let contentType = request.headers['content-type'];

    try {
        if (request.file) {
            const urlAzure = await uploadFileToAzure(request.file, 'arquivos_mensagens');
            dadosBody.arquivo = urlAzure;
        } else {
            dadosBody.arquivo = null;
        }

        let dados = await mensagemController.inserirMensagem(dadosBody, contentType, io);
        response.status(dados.status_code).json(dados);

    } catch (error) {
        console.error("🚨 Erro na Rota POST ao subir para Azure:", error.message);
        response.status(500).json({ status: false, message: "Erro interno no processamento de upload para a nuvem." });
    }
});

// URL: PUT http://localhost:8080/v1/conectaBook/mensagem/:id
router.put('/:id', cors(), upload.single('arquivo'), async function (request, response) {
    let contentType = request.headers['content-type'];
    let idMensagem = request.params.id;
    let dadosBody = request.body;

    try {
        if (request.file) {
            const urlAzure = await uploadFileToAzure(request.file, 'arquivos_mensagens');
            dadosBody.arquivo = urlAzure;
        }

        let dados = await mensagemController.atualizarMensagem(dadosBody, contentType, idMensagem);
        response.status(dados.status_code).json(dados);

    } catch (error) {
        console.error("🚨 Erro na Rota PUT ao subir para Azure:", error.message);
        response.status(500).json({ status: false, message: "Erro interno no processamento de atualização na nuvem." });
    }
});

// =========================================================================
// ENDPOINTS DE EXCLUSÃO E LIMPEZA (DELETE)
// =========================================================================

// URL: DELETE http://localhost:8080/v1/conectaBook/mensagem/:id
router.delete('/:id', async function (request, response) {
        let idMensagem = request.params.id;

        let dados = await mensagemController.excluirMensagemComRespostas(idMensagem);
        
        // Se deletou do banco com sucesso, avisa o front-end em tempo real para sumir com o post
        if(dados.status_code === 200) {
            io.emit('mensagem_deletada', { id_mensagem: idMensagem });
        }

        response.status(dados.status_code).json(dados);
    });

// URL: DELETE http://localhost:8080/v1/conectaBook/mensagem/clube/:id
router.delete('/clube/:id', async function (request, response) {
    let idClube = request.params.id;
    let dados = await mensagemController.excluirTodasMensagensDoClube(idClube);
    response.status(dados.status_code).json(dados);
});

// URL: DELETE http://localhost:8080/v1/conectaBook/mensagem/usuario/:id
router.delete('/usuario/:id', async function (request, response) {
    let idUsuario = request.params.id;
    let dados = await mensagemController.excluirTodasMensagensDoUsuario(idUsuario);
    response.status(dados.status_code).json(dados);
});

   return router
}