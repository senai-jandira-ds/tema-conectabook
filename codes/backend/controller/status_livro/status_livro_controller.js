/*******************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model de STATUS LIVRO
 * Projeto: ConectaBook
 * Data: 26/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.1
 *******************************************************************************************/
const statusLivroDAO = require("../../model/DAO/status_livro.js");
const messages = require("../modulo/config_messages.js");

// GET - Listar todos os status
const listarStatusLivro = async function () {
    try {
        let result = await statusLivroDAO.getSelectAllStatusBook()

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

// GET id - Listar status pelo ID
const listarStatusLivroID = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let result = await statusLivroDAO.getSelectByIdStatusBook(id);

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

// POST - Criar novo status livro
const criarStatusLivro = async function (statusLivro, contentType) {
    try {
        // 1. Validação do Content-Type
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        // 2. VALIDAÇÃO CORRIGIDA: Mudado de genero.nome_status para statusLivro.nome_status
        if (statusLivro.nome_status == '' || statusLivro.nome_status == undefined) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            // 3. Envia os dados para a DAO
            let result = await statusLivroDAO.setInsertStatusBook(statusLivro)

            if (result) {
                let responseData = Object.assign({}, messages.HEADER);
                responseData.status = messages.SUCCESS_CREATED_ITEM.status;
                responseData.status_code = messages.SUCCESS_CREATED_ITEM.status_code;
                responseData.response = messages.SUCCESS_CREATED_ITEM.message;
                return responseData;
            } else {
                return messages.ERROR_INTERNAL_SERVER_MODEL;
            }
        }
    } catch (error) {
        // Exibe o erro real no terminal para te ajudar a debugar
        console.error("🚨 Erro na Controller de Status do Livro:", error.message);
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// PUT - Atualizar status de um livro
const atualizarStatusLivro = async function (statusLivro, contentType, id) {
    try {
        // 1. Validação do ID da URL
        if (id == '' || id == undefined || isNaN(id)) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        // 2. Validação do Content-Type
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        // 3. VALIDAÇÃO CORRIGIDA: Mudado de genero.nome_status para statusLivro.nome_status
        if (statusLivro.nome_status == '' || statusLivro.nome_status == undefined) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {

            // 4. Verifica se o registro realmente existe no banco antes de tentar atualizar
            let buscarId = await statusLivroDAO.getSelectByIdStatusBook(id)

            if (buscarId) {
                // Injeta o ID vindo da URL para dentro do objeto que vai para a DAO
                statusLivro.id_status_livro = id;

                let result = await statusLivroDAO.setUpdateStatusBook(statusLivro)

                if (result) {
                    let responseData = Object.assign({}, messages.HEADER);
                    responseData.status = messages.SUCCESS_UPDATED_ITEM.status;
                    responseData.status_code = messages.SUCCESS_UPDATED_ITEM.status_code;
                    responseData.response = messages.SUCCESS_UPDATED_ITEM.message;
                    return responseData;
                } else {
                    return messages.ERROR_INTERNAL_SERVER_MODEL; // 500 se falhar no banco
                }
            } else {
                return messages.ERROR_NOT_FOUND; // 404 se o ID não existir
            }
        }
    } catch (error) {
        // Exibe o erro real no terminal do VS Code para monitorar falhas de desenvolvimento
        console.error("🚨 Erro na Controller ao atualizar status do livro:", error.message);
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// DELETE - Excluir status Livro
const excluirStatusLivro = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let buscarId = await statusLivroDAO.getSelectByIdStatusBook(id)

        if (buscarId) {

            let result = await statusLivroDAO.setDeleteStatusBook(id)

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
    listarStatusLivro,
    listarStatusLivroID,
    criarStatusLivro,
    atualizarStatusLivro,
    excluirStatusLivro
}