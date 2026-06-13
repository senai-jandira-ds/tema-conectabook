/*******************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model de genero usuarios (Controller)
 * Projeto: ConectaBook
 * Data: 06/05/2026
 * Autor: Isabelle Abreu
 * Versão: 1.1
 *******************************************************************************************/
const generoUsuarioDAO = require("../../model/DAO/genero_usuario.js");
const messages = require("../modulo/config_messages.js");

// GET - Listar todos
const listarGenerosUsuario = async function() {
    try {
        let result = await generoUsuarioDAO.getSelectAllGenresUsers();

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

// GET id - Listar relacionamento pelo ID da tabela intermediária
const listarGeneroUsuarioID = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let result = await generoUsuarioDAO.getSelectByIdGenresUsers(id);

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

// GET - Listar gêneros de um usuário específico
const listarGenerosPorUsuario = async function (idUsuario) {

    if (idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let result = await generoUsuarioDAO.getSelectGenresByIdUsers(idUsuario);

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
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// GET - Listar usuários que gostam de um gênero específico
const listarUsuariosPorGenero = async function (idGenero) {

    if (idGenero == '' || idGenero == undefined || isNaN(idGenero)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let result = await generoUsuarioDAO.getSelectUsersByIdGenres(idGenero);

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
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// POST - Criar novo relacionamento
const criarGeneroUsuario = async function (dadosGeneroUsuario, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (dadosGeneroUsuario.id_genero == '' || dadosGeneroUsuario.id_genero == undefined ||
            dadosGeneroUsuario.id_usuario == '' || dadosGeneroUsuario.id_usuario == undefined
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            
            let result = await generoUsuarioDAO.setInsertGenresUsers(dadosGeneroUsuario);

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

// POST - Criar múltiplos relacionamentos de uma vez
const criarMultiplosGenerosUsuario = async function (dados, contentType) {
    try {

        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (
            dados.id_usuario == '' || dados.id_usuario == undefined || isNaN(dados.id_usuario) ||
            !Array.isArray(dados.generos) || dados.generos.length === 0
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            
            let result = await generoUsuarioDAO.setInsertMultiplesGenres(dados);

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

// PUT - Atualizar relacionamento
const atualizarGeneroUsuario = async function (genero_usuario, contentType, id) {
    try {
        if (id == '' || id == undefined || isNaN(id)){
            return messages.ERROR_REQUIRED_FIELDS;
        }

        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (genero_usuario.id_genero == '' || genero_usuario.id_genero == undefined ||
            genero_usuario.id_usuario == '' || genero_usuario.id_usuario == undefined
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            let buscarId = await generoUsuarioDAO.getSelectByIdGenresUsers(id);

            if (buscarId) {
                // AJUSTADO: Nome da variável consistente com o parâmetro
                genero_usuario.id_genero_usuario = id;
                let result = await generoUsuarioDAO.setUpdateGenresUsers(genero_usuario);

                if (result) {
                    let responseData = Object.assign({}, messages.HEADER);
                    responseData.status = messages.SUCCESS_UPDATED_ITEM.status; // CORRIGIDO: responseData
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

// DELETE - Excluir
const excluirGeneroUsuario = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let buscarId = await generoUsuarioDAO.getSelectByIdGenresUsers(id);

        if (buscarId) {
            let result = await generoUsuarioDAO.setDeleteGenresUsers(id);
        
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

const excluirGenerosPorUsuario = async function (idUsuario) {
    // Validação do ID do usuário
    if (idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)) {
        return messages.ERROR_INVALID_ID; 
    }

    try {
        // Chamada para o DAO (usando a função setDeleteGenresByIdUser que você criou)
        let result = await generoUsuarioDAO.setDeleteGenresByIdUser(idUsuario);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_DELETE_ITEM.status;
            responseData.status_code = messages.SUCCESS_DELETE_ITEM.status_code;
            responseData.response = messages.SUCCESS_DELETE_ITEM.message;
            return responseData;
        } else {
            // Se retornar false, pode ser que o usuário não tivesse gêneros ou o ID não existe
            return messages.ERROR_NOT_FOUND; 
        }
    } catch (error) {
        console.log(error);
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

module.exports = {
    listarGeneroUsuarioID,
    listarGenerosUsuario,
    listarGenerosPorUsuario,
    listarUsuariosPorGenero,
    excluirGeneroUsuario,
    excluirGenerosPorUsuario,
    atualizarGeneroUsuario,
    criarGeneroUsuario,
    criarMultiplosGenerosUsuario
};
