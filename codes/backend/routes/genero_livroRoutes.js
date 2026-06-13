/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização das rotas de generos_livros
 * Projeto: ConectaBook
 * Data: 01/06/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.1
 *******************************************************************************************/

const express = require('express');
const router = express.Router();
const controllerGeneroLivro = require('../controller/genero_livro/genero_livro_controller.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// URL: GET http://localhost:8080/v1/conectaBook/genero-livro
// Listar todos os relacionamentos
router.get('/', cors(), async function(request, response) {
    let dados = await controllerGeneroLivro.listarTodosGenerosLivros();
    response.status(dados.status_code).json(dados);
});

// URL: GET http://localhost:8080/v1/conectaBook/genero-livro/:id
// Rota para buscar um relacionamento específico pelo ID
router.get('/:id', cors(), async function(request, response) {
    let id = request.params.id;
    let dados = await controllerGeneroLivro.buscarGeneroLivroPorId(id);

    response.status(dados.status_code);
    response.json(dados);
});

// URL: GET http://localhost:8080/v1/conectaBook/genero-livro/livro/:id
// Listar gêneros de um LIVRO específico
router.get('/livro/:id', cors(), async function(request, response) {
    let idUsuario = request.params.id;
    let dados = await controllerGeneroLivro.listarGenerosDeUmLivro(idUsuario);
    response.status(dados.status_code).json(dados);
});

// URL: GET http://localhost:8080/v1/conectaBook/genero-livro/genero/:id
// Listar livros de um GÊNERO específico
router.get('/genero/:id', cors(), async function(request, response) {
    let idGenero = request.params.id;
    let dados = await controllerGeneroLivro.listarLivrosDeUmGenero(idGenero);
    response.status(dados.status_code).json(dados);
});

// URL: POST http://localhost:8080/v1/conectaBook/genero-livro
// Inserir novo RELACIONAMENTO
router.post('/', cors(), jsonParser, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;
    let result = await controllerGeneroLivro.inserirGeneroLivro(dadosBody, contentType);
    response.status(result.status_code).json(result);
});

// URL: POST http://localhost:8080/v1/conectaBook/genero-livro/multiplos
// Insere varios RELACIONAMENTOS
router.post('/multiplos', cors(), jsonParser, async function(request, response) {
    let contentType = request.headers['content-type'];
    let dadosBody = request.body;

    let result = await controllerGeneroLivro.inserirMultiplosGenerosLivro(dadosBody, contentType);

    response.status(result.status_code).json(result);
});

// URL: PUT http://localhost:8080/v1/conectaBook/genero-livro/:id
// Rota para atualizar um relacionamento existente
router.put('/:id', cors(), jsonParser, async function(request, response) {
    let contentType = request.headers['content-type'];
    let id = request.params.id;
    let dadosBody = request.body;
    let result = await controllerGeneroLivro.atualizarGeneroLivro(dadosBody, contentType, id);

    response.status(result.status_code);
    response.json(result);
});

// URL: DELETE http://localhost:8080/v1/conectaBook/genero-livro/:id
// Deletar um interesse
router.delete('/:id', cors(), async function(request, response) {
    let id = request.params.id;
    let result = await controllerGeneroLivro.excluirGeneroLivro(id);
    response.status(result.status_code).json(result);
});

// URL: DELETE http://localhost:8080/v1/conectaBook/genero-livro/livros/:id
// Rota para deletar todos os gêneros de um livro específico
router.delete('/livros/:id', async function(request, response) {
    let idLivro = request.params.id;
    let result = await controllerGeneroLivro.excluirGenerosPorLivro(idLivro);
    response.status(result.status_code).json(result);
});

module.exports = router;