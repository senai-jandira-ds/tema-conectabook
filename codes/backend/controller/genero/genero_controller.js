/*******************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model de Gêneros 
 * Projeto: ConectaBook
 * Data: 06/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.1
 *******************************************************************************************/
const generoDAO = require("../../model/DAO/genero.js"); // CORRIGIDO: Removido o ponto extra
const messages = require("../modulo/config_messages.js");

// GET - Listar todos os gêneros
const listarGeneros = async function () {
    try {
        let result = await generoDAO.getSelectAllGenres();

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

// GET id - Listar gênero pelo ID
const listarGeneroID = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }
    
    try {
        let result = await generoDAO.getSelectByIdGenre(id);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            // CORRIGIDO: Atribuindo o resultado para aparecer no JSON
            responseData.response = result[0]; 
            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch(error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// POST - Criar novo gênero
const criarGenero = async function (genero, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        // Validação: Apenas o NOME é obrigatório, a descrição pode ser opcional
        if(genero.nome == '' || genero.nome == undefined) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            let result = await generoDAO.setInsertGenre(genero);

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
// PUT - Atualizar gênero
const atualizarGenero = async function (genero, contentType, id) {
    try {

        if (id == '' || id == undefined || isNaN(id)) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (genero.nome == '' || genero.nome == undefined || genero.nome.length > 100) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            
            let buscarId = await generoDAO.getSelectByIdGenre(id);

            if (buscarId) {
                genero.id = id;
                let result = await generoDAO.setUpdateGenre(genero);

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

// DELETE - Excluir gênero
const excluirGenero = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let buscarId = await generoDAO.getSelectByIdGenre(id);

        if(buscarId) {
           
            let result = await generoDAO.setDeleteGenre(id);

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
    listarGeneroID,
    listarGeneros,
    excluirGenero,
    atualizarGenero,
    criarGenero
}