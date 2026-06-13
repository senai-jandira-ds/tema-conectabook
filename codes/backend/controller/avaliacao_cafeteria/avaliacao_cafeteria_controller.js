/*******************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model da relação Avaliação-Cafeteria
 * Projeto: ConectaBook
 * Data: 26/05/2026
 * Autor: Alex Gomes
 * Versão: 1.0
 *******************************************************************************************/

const avaliacaoCafeteriaDAO = require("../../model/DAO/avaliacao_cafeteria.js"); 
const messages = require("../modulo/config_messages.js");

// GET - Listar todas as relações de avaliação-cafeteria
const listarAvaliacoesCafeterias = async function () {
    try {
        let result = await avaliacaoCafeteriaDAO.getSelectAllAvaliacaoCafeteria();

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

// GET id - Listar relação pelo ID
const listarAvaliacaoCafeteriaID = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }
    
    try {
        let result = await avaliacaoCafeteriaDAO.getSelectByIdAvaliacaoCafeteria(id);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            responseData.response = result[0]; 
            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch(error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// GET - Listar avaliações filtradas pelo ID da Cafeteria
const listarAvaliacoesPorCafeteria = async function (idCafeteria) {
    if (idCafeteria == '' || idCafeteria == undefined || isNaN(idCafeteria)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }
    
    try {
        let result = await avaliacaoCafeteriaDAO.getSelectAvaliacoesByCafeteria(idCafeteria);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            responseData.quantidade = result.length;
            responseData.response = result; 
            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch(error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// GET - Listar avaliações de cafeterias feitas por um Usuário
const listarAvaliacoesPorUsuario = async function (idUsuario) {
    if (idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }
    
    try {
        let result = await avaliacaoCafeteriaDAO.getSelectAvaliacoesByUsuario(idUsuario);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            responseData.quantidade = result.length;
            responseData.response = result; 
            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch(error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// GET - Listar estatísticas (total e média) de avaliações de uma Cafeteria
const listarEstatisticasPorCafeteria = async function (idCafeteria) {
    if (idCafeteria == '' || idCafeteria == undefined || isNaN(idCafeteria)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }
    
    try {
        let result = await avaliacaoCafeteriaDAO.getEstatisticasAvaliacaoByCafeteria(idCafeteria);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            responseData.response = result[0]; // Retorna o índice 0 por conta do group by
            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch(error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// POST - Criar nova relação Avaliação-Cafeteria
const criarAvaliacaoCafeteria = async function (avaliacaoCafeteria, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        // Validação: id_avaliacao e id_cafeteria são obrigatórios na relação
        if (
            avaliacaoCafeteria.id_avaliacao == '' || avaliacaoCafeteria.id_avaliacao == undefined || isNaN(avaliacaoCafeteria.id_avaliacao) ||
            avaliacaoCafeteria.id_cafeteria == '' || avaliacaoCafeteria.id_cafeteria == undefined || isNaN(avaliacaoCafeteria.id_cafeteria)
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            let result = await avaliacaoCafeteriaDAO.setInsertAvaliacaoCafeteria(avaliacaoCafeteria);

            if(result) {
                let responseData = Object.assign({}, messages.HEADER);
                responseData.status = messages.SUCCESS_CREATED_ITEM.status;
                responseData.status_code = messages.SUCCESS_CREATED_ITEM.status_code;
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

// PUT - Atualizar relação Avaliação-Cafeteria
const atualizarAvaliacaoCafeteria = async function (avaliacaoCafeteria, contentType, id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (
            avaliacaoCafeteria.id_avaliacao == '' || avaliacaoCafeteria.id_avaliacao == undefined || isNaN(avaliacaoCafeteria.id_avaliacao) ||
            avaliacaoCafeteria.id_cafeteria == '' || avaliacaoCafeteria.id_cafeteria == undefined || isNaN(avaliacaoCafeteria.id_cafeteria)
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            
            let buscarId = await avaliacaoCafeteriaDAO.getSelectByIdAvaliacaoCafeteria(id);

            if (buscarId) {
                avaliacaoCafeteria.id = id; 
                let result = await avaliacaoCafeteriaDAO.setUpdateAvaliacaoCafeteria(avaliacaoCafeteria);

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

// DELETE - Excluir relação Avaliação-Cafeteria
const excluirAvaliacaoCafeteria = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let buscarId = await avaliacaoCafeteriaDAO.getSelectByIdAvaliacaoCafeteria(id);

        if(buscarId) {
            let result = await avaliacaoCafeteriaDAO.setDeleteAvaliacaoCafeteria(id);

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
    listarAvaliacoesCafeterias,
    listarAvaliacaoCafeteriaID,
    listarAvaliacoesPorCafeteria,
    listarAvaliacoesPorUsuario,
    listarEstatisticasPorCafeteria,
    criarAvaliacaoCafeteria,
    atualizarAvaliacaoCafeteria,
    excluirAvaliacaoCafeteria
}