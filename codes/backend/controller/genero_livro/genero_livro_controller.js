/*******************************************************************************************
 * Objetivo: Controller responsável pela regra de negócio do relacionamento entre Livros e Gêneros
 * Projeto: ConectaBook
 * Data: 01/06/2026
 * Autor: Alex Henrique / Geovanna Silva
 * Versão: 1.1
 *******************************************************************************************/

const generoLivroDAO = require('../../model/DAO/genero_livro.js'); 
const messages = require('../modulo/config_messages.js'); 

// GET - Listar todos os relacionamentos
const listarTodosGenerosLivros = async function () {
    try {
        let result = await generoLivroDAO.getSelectAllGenresBooks();

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            responseData.response = result;
            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// GET - Buscar pelo ID da tabela intermediária (Numérico)
const buscarGeneroLivroPorId = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let result = await generoLivroDAO.getSelectByIdGenresBooks(id);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            responseData.response = result[0]; 
            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// GET - Listar gêneros de um livro específico (AJUSTADO: Removido isNaN para idLivro String)
const listarGenerosDeUmLivro = async function (idLivro) {
    if (idLivro == '' || idLivro == undefined) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let result = await generoLivroDAO.getSelectGenresByIdBooks(idLivro);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            responseData.response = result;
            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// GET - Listar livros de um gênero específico (Numérico)
const listarLivrosDeUmGenero = async function (idGenero) {
    if (idGenero == '' || idGenero == undefined || isNaN(idGenero)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let result = await generoLivroDAO.getSelectBooksByIdGenres(idGenero);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            responseData.response = result;
            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// POST - Inserir um único relacionamento (AJUSTADO: Removido isNaN para dados.id_livro)
const inserirGeneroLivro = async function (dados, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (dados.id_genero == '' || dados.id_genero == undefined || isNaN(dados.id_genero) ||
            dados.id_livro == '' || dados.id_livro == undefined) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        let result = await generoLivroDAO.setInsertGenresBooks(dados);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_CREATED_ITEM.status;
            responseData.status_code = messages.SUCCESS_CREATED_ITEM.status_code;
            responseData.response = messages.SUCCESS_CREATED_ITEM.message;
            return responseData;
        } else {
            return messages.ERROR_INTERNAL_SERVER_MODEL;
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// POST - Inserir múltiplos gêneros para um livro (AJUSTADO: Removido isNaN para dados.id_livro)
const inserirMultiplosGenerosLivro = async function (dados, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (dados.id_livro == '' || dados.id_livro == undefined ||
            !dados.generos || !Array.isArray(dados.generos) || dados.generos.length === 0) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        let result = await generoLivroDAO.setInsertMultiplesGenresBooks(dados);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_CREATED_ITEM.status;
            responseData.status_code = messages.SUCCESS_CREATED_ITEM.status_code;
            responseData.response = messages.SUCCESS_CREATED_ITEM.message;
            return responseData;
        } else {
            return messages.ERROR_INTERNAL_SERVER_MODEL;
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// PUT - Atualizar relacionamento existente (AJUSTADO: Removido isNaN para dados.id_livro)
const atualizarGeneroLivro = async function (dados, contentType, id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (dados.id_genero == '' || dados.id_genero == undefined || isNaN(dados.id_genero) ||
            dados.id_livro == '' || dados.id_livro == undefined) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        let buscarId = await generoLivroDAO.getSelectByIdGenresBooks(id);

        if (buscarId) {
            dados.id_genero_livro = id; 
            let result = await generoLivroDAO.setUpdateGenresBooks(dados);

            if (result) {
                let responseData = Object.assign({}, messages.HEADER);
                responseData.status = messages.SUCCESS_UPDATED_ITEM.status;
                responseData.status_code = messages.SUCCESS_UPDATED_ITEM.status_code;
                responseData.response = messages.SUCCESS_UPDATED_ITEM.message;
                return responseData;
            } else {
                return messages.ERROR_INTERNAL_SERVER_MODEL;
            }
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// DELETE - Excluir um relacionamento único pelo ID numérico da tabela intermediária
const excluirGeneroLivro = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let buscarId = await generoLivroDAO.getSelectByIdGenresBooks(id);

        if (buscarId) {
            let result = await generoLivroDAO.setDeleteGenresBooks(id); 

            if (result) {
                let responseData = Object.assign({}, messages.HEADER);
                responseData.status = messages.SUCCESS_DELETED_ITEM.status;
                responseData.status_code = messages.SUCCESS_DELETED_ITEM.status_code;
                responseData.response = messages.SUCCESS_DELETED_ITEM.message;
                return responseData;
            } else {
                return messages.ERROR_INTERNAL_SERVER_MODEL;
            }
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// DELETE - Excluir gêneros vinculados a um livro específico (AJUSTADO: Corrigida a validação tirando o isNaN e consertado o comentário de "usuário" para "livro")
const excluirGenerosPorLivro = async function (idLivro) {
    // Validação do ID do Livro (String)
    if (idLivro == '' || idLivro == undefined) {
        return messages.ERROR_INVALID_ID; 
    }

    try {
        let result = await generoLivroDAO.setDeleteGenresByIdBook(idLivro);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_DELETE_ITEM.status;
            responseData.status_code = messages.SUCCESS_DELETE_ITEM.status_code;
            responseData.response = messages.SUCCESS_DELETE_ITEM.message;
            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND; 
        }
    } catch (error) {
        console.log(error);
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

module.exports = {
    listarTodosGenerosLivros,
    buscarGeneroLivroPorId,
    listarGenerosDeUmLivro,
    listarLivrosDeUmGenero,
    inserirGeneroLivro,
    inserirMultiplosGenerosLivro,
    atualizarGeneroLivro,
    excluirGeneroLivro,
    excluirGenerosPorLivro
};