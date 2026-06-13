/*******************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model de Livros (Controller)
 * Projeto: ConectaBook
 * Data: 01/06/2026
 * Autor: Geovanna Silva / Alex Henrique
 * Versão: 1.2
 *******************************************************************************************/

const livroDAO = require("../../model/DAO/livro.js");
const messages = require("../modulo/config_messages.js");

// GET - Listar todos os livros
const listarLivros = async function () {
    try {
        let result = await livroDAO.getSelectAllBooks();

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

// GET ID - Listar livros pelo ID (AJUSTADO: Removido isNaN para aceitar String)
const listarLivrosID = async function (id) {
    if (id == '' || id == undefined) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let result = await livroDAO.getSelectByIdBook(id);

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

// POST - Criar novo livro 
const criarLivro = async function (livro, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        // AJUSTADO: Adicionada validação opcional/obrigatória para o livro.id ou id_livro caso venha do client textual
        if (
            livro.isbn == '' || livro.isbn == undefined ||
            livro.titulo == '' || livro.titulo == undefined ||
            livro.autor == '' || livro.autor == undefined ||
            livro.descricao == '' || livro.descricao == undefined
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            let result = await livroDAO.setInsertBook(livro);

            if (result) {
                let responseData = Object.assign({}, messages.HEADER);
                responseData.status = messages.SUCCESS_CREATED_ITEM.status;
                responseData.status_code = messages.SUCCESS_CREATED_ITEM.status_code;
                return responseData;
            } else {
                console.log(result)
                return messages.ERROR_INTERNAL_SERVER_MODEL;
            }
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// PUT - Atualizar livros (AJUSTADO: Removido isNaN para aceitar ID String)
const atualizarLivro = async function (livro, contentType, id) {
    try {
        if (id == '' || id == undefined) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        if (String(contentType).toLowerCase() != 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (
            livro.isbn == '' || livro.isbn == undefined ||
            livro.titulo == '' || livro.titulo == undefined ||
            livro.autor == '' || livro.autor == undefined ||
            livro.descricao == '' || livro.descricao == undefined
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            let buscarId = await livroDAO.getSelectByIdBook(id);

            if (buscarId) {
                livro.id = id;
                let result = await livroDAO.setUpdateBook(livro);

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
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// DELETE - Excluir livro (AJUSTADO: Removido isNaN para aceitar ID String)
const excluirLivro = async function (id) {
    if (id == '' || id == undefined) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let buscarId = await livroDAO.getSelectByIdBook(id);

        if (buscarId) {
            let result = await livroDAO.setDeleteBook(id);

            if (result) {
                let responseData = Object.assign({}, messages.HEADER);
                responseData.status = messages.SUCCESS_DELETE_ITEM.status;
                responseData.status_code = messages.SUCCESS_DELETE_ITEM.status_code;
                responseData.response = messages.SUCCESS_DELETE_ITEM.message;
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

module.exports = {
    listarLivrosID,
    listarLivros,
    excluirLivro,
    atualizarLivro,
    criarLivro
}