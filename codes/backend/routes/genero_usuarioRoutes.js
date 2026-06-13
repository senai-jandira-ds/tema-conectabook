/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização das rotas de generos_usuarios
 * Projeto: ConectaBook
 * Data: 06/05/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.1
 *******************************************************************************************/

const express = require('express');
const router = express.Router();
const controllerGeneroUsuario = require('../controller/genero_usuario/genero_usuario_controller.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// URL: GET http://localhost:8080/v1/conectaBook/genero-usuario
// Listar todos os relacionamentos
router.get('/', cors(), async function(request, response) {
    let dados = await controllerGeneroUsuario.listarGenerosUsuario();
    response.status(dados.status_code).json(dados);
});

// URL: GET http://localhost:8080/v1/conectaBook/genero-usuario/:id
// Rota para buscar um relacionamento específico pelo ID
router.get('/:id', cors(), async function(request, response) {
    let id = request.params.id;
    let dados = await controllerGeneroUsuario.listarGeneroUsuarioID(id);

    response.status(dados.status_code);
    response.json(dados);
});

// URL: GET http://localhost:8080/v1/conectaBook/genero-usuario/usuario/:id
// Listar gêneros de um USUÁRIO específico
router.get('/usuario/:id', cors(), async function(request, response) {
    let idUsuario = request.params.id;
    let dados = await controllerGeneroUsuario.listarGenerosPorUsuario(idUsuario);
    response.status(dados.status_code).json(dados);
});

// URL: GET http://localhost:8080/v1/conectaBook/genero-usuario/genero/:id
// Listar usuários de um GÊNERO específico
router.get('/genero/:id', cors(), async function(request, response) {
    let idGenero = request.params.id;
    let dados = await controllerGeneroUsuario.listarUsuariosPorGenero(idGenero);
    response.status(dados.status_code).json(dados);
});

// URL: POST http://localhost:8080/v1/conectaBook/genero-usuario
// Inserir novo RELACIONAMENTO
router.post('/', cors(), jsonParser, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let result = await controllerGeneroUsuario.criarGeneroUsuario(dadosBody, contentType);
    response.status(result.status_code).json(result);
});

// URL: POST http://localhost:8080/v1/conectaBook/genero-usuario/multiplos
// Insere varios RELACIONAMENTOS
router.post('/multiplos', cors(), jsonParser, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerGeneroUsuario.criarMultiplosGenerosUsuario(dadosBody, contentType);

    response.status(result.status_code).json(result);
});

// URL: PUT http://localhost:8080/v1/conectaBook/genero-usuario/:id
// Rota para atualizar um relacionamento existente
router.put('/:id', cors(), jsonParser, async function(request, response) {
    let contentType = request.headers['content-type'];
    let id = request.params.id;
    let dadosBody = request.body;
    let result = await controllerGeneroUsuario.atualizarGeneroUsuario(dadosBody, contentType, id);

    response.status(result.status_code);
    response.json(result);
});

// URL: DELETE http://localhost:8080/v1/conectaBook/genero-usuario/:id
// Deletar um interesse
router.delete('/:id', cors(), async function(request, response) {
    let id = request.params.id;
    let result = await controllerGeneroUsuario.excluirGeneroUsuario(id);
    response.status(result.status_code).json(result);
});

// URL: DELETE http://localhost:8080/v1/conectaBook/genero-usuario/usuario/:id
// Rota para deletar todos os gêneros de um usuário específico
router.delete('/usuario/:id', async function(request, response) {
    let idUsuario = request.params.id;
    let result = await controllerGeneroUsuario.excluirGenerosPorUsuario(idUsuario);
    response.status(result.status_code).json(result);
});

module.exports = router;