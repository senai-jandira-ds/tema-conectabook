/*******************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação das regras de negócio de acessos a livros
 * Projeto: ConectaBook
 * Data: 01/06/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.1
 *******************************************************************************************/

const acessoLivroDAO = require('../../model/DAO/acesso_livro.js');
const messages = require('../modulo/config_messages.js'); 

// GET - Listar todos os acessos
const listarAcessos = async function () {
    try {
        let result = await acessoLivroDAO.getSelectAllBookAccess();

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

// GET - Buscar um acesso específico pelo ID único dele (Numérico)
const buscarAcessoPorId = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let result = await acessoLivroDAO.getSelectByIdBookAccess(id);

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

// GET - Buscar todo o histórico de um usuário (Numérico)
const listarHistoricoDoUsuario = async function (idUsuario) {
    if (idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let result = await acessoLivroDAO.getSelectAccessByUserId(idUsuario);

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

// POST - Registrar que o usuário clicou/acessou um livro
const registrarAcesso = async function (dadosAcesso, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        // AJUSTADO: Removido 'isNaN(dadosAcesso.id_livro)' do validador de campos obrigatórios
        if (dadosAcesso.id_livro == '' || dadosAcesso.id_livro == undefined ||
            dadosAcesso.id_usuario == '' || dadosAcesso.id_usuario == undefined || isNaN(dadosAcesso.id_usuario)) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        let result = await acessoLivroDAO.setInsertBookAccess(dadosAcesso);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_CREATED_ITEM.status;
            responseData.status_code = messages.SUCCESS_CREATED_ITEM.status_code;
            return responseData;
        } else {
            return messages.ERROR_INTERNAL_SERVER_MODEL;
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// DELETE - Remover um item do histórico (Numérico)
const excluirAcesso = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let buscarId = await acessoLivroDAO.getSelectByIdBookAccess(id);

        if (buscarId) {
            let result = await acessoLivroDAO.setDeleteBookAccess(id);

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
    listarAcessos,
    buscarAcessoPorId,
    listarHistoricoDoUsuario,
    registrarAcesso,
    excluirAcesso
}