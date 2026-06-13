/*******************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model de notificacoes (Controller)
 * Projeto: ConectaBook
 * Data: 27/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.1
 *******************************************************************************************/

const notificacaoDAO = require("../../model/DAO/notificacao.js")
const messages = require("../modulo/config_messages.js")


// GET - listar todas as notificacoes
const listarNotificacoes = async function () {
    try {
        let result = await notificacaoDAO.getSelectAllNotifications()

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

// GET id - Listar notificacao pelo id
const listarNotificacaoId = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let result = await notificacaoDAO.getSelectByIdNotification(id)

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

const listarNotificacoesIdUsuario = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let result = await notificacaoDAO.getSelectNotificationsByIdUser(id)

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



// POST - Criar notificacao
const criarNotificacao = async function (notificacao, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (notificacao.titulo == '' || notificacao.titulo == undefined ||
            notificacao.id_usuario == '' || notificacao.id_usuario == undefined
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            let result = await notificacaoDAO.setInsertNotification(notificacao)

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
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}


// PUT - Atualizar notificacao
const atualizarNotificacao = async function (notificacao, contentType, id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (notificacao.titulo == '' || notificacao.titulo == undefined ||
            notificacao.id_usuario == '' || notificacao.id_usuario == undefined
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            // CORRIGIDO: Verificamos se o registro realmente existe antes de atualizar
            let validacaoId = await notificacaoDAO.getSelectByIdNotification(id)

            if (validacaoId) {
                notificacao.id = id
                let result = await notificacaoDAO.setUpdateNotification(notificacao)

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
                return messages.ERROR_NOT_FOUND; // 404 se a notificação não existir
            }
        }
    } catch (error) {
        console.error("🚨 Erro na Controller de Notificação:", error);
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}


// DELETAR - Excluir notificacao
const excluirNotificacao = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let buscarId = await notificacaoDAO.getSelectByIdNotification(id);

        if (buscarId) {

            let result = await notificacaoDAO.setDeleteNotification(id);

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
    listarNotificacoes,
    listarNotificacaoId,
    listarNotificacoesIdUsuario,
    criarNotificacao,
    atualizarNotificacao,
    excluirNotificacao
}