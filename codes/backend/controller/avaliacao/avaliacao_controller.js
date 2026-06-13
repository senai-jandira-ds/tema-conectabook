/*******************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model de Avaliações
 * Projeto: ConectaBook
 * Data: 21/05/2026
 * Autor: Alex Gomes
 * Versão: 1.0
 *******************************************************************************************/

const avaliacaoDAO = require("../../model/DAO/avaliacao.js"); // Altere o caminho se necessário
const messages = require("../modulo/config_messages.js");

// GET - Listar todas as avaliações
const listarAvaliacoes = async function () {
    try {
        let result = await avaliacaoDAO.getSelectAllRatings();

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

// GET id - Listar avaliação pelo ID
const listarAvaliacaoID = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }
    
    try {
        let result = await avaliacaoDAO.getSelectByIdRating(id);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            responseData.response = result[0]; // Retorna a primeira ocorrência encontrada
            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch(error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// POST - Criar nova avaliação
const criarAvaliacao = async function (avaliacao, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        // Validação dos campos obrigatórios que a sua DAO exige no INSERT
        if (
            avaliacao.estrelas == '' || avaliacao.estrelas == undefined || isNaN(avaliacao.estrelas) ||
            avaliacao.id_usuario == '' || avaliacao.id_usuario == undefined || isNaN(avaliacao.id_usuario)
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            let result = await avaliacaoDAO.setInsertRating(avaliacao);

            if(result) {
                let responseData = Object.assign({}, messages.HEADER);
                responseData.status = messages.SUCCESS_CREATED_ITEM.status;
                responseData.id = result.insertId;
                responseData.status_code = messages.SUCCESS_CREATED_ITEM.status_code;
                responseData.id = result.insertId;
                responseData.response = messages.SUCCESS_CREATED_ITEM.message;
                return responseData;
            } else {
                return messages.ERROR_INTERNAL_SERVER_MODEL;
            }
        }
    } catch(error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// PUT - Atualizar avaliação
const atualizarAvaliacao = async function (avaliacao, contentType, id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        // Validação dos campos obrigatórios para o UPDATE
        if (
            avaliacao.estrelas == '' || avaliacao.estrelas == undefined || isNaN(avaliacao.estrelas) ||
            avaliacao.id_usuario == '' || avaliacao.id_usuario == undefined || isNaN(avaliacao.id_usuario)
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            
            // Verifica se o ID passado realmente existe no banco antes de atualizar
            let buscarId = await avaliacaoDAO.getSelectByIdRating(id);

            if (buscarId) {
                avaliacao.id = id; // Injeta o ID vindo da URL no objeto de dados
                let result = await avaliacaoDAO.setUpdateRating(avaliacao);

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

// DELETE - Excluir avaliação
const excluirAvaliacao = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let buscarId = await avaliacaoDAO.getSelectByIdRating(id);

        if(buscarId) {
            let result = await avaliacaoDAO.setDeleteRating(id);

            if(result) {
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
    listarAvaliacoes,
    listarAvaliacaoID,
    criarAvaliacao,
    atualizarAvaliacao,
    excluirAvaliacao
}