/*******************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model de usuários (Controller)
 * Projeto: ConectaBook
 * Data: 06/05/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.1
 *******************************************************************************************/

const usuarioDAO = require("../../model/DAO/usuario.js");
const messages = require("../modulo/config_messages.js");

const bcrypt = require('bcrypt');

// GET - Listar todos os usuários
const listarUsuarios = async function () {
    try {
        // No seu Controller (listarUsuarios)
        let result = await usuarioDAO.getSelectAllUsers();

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            // IMPORTANTE: result já é o array limpo vindo do DAO agora
            responseData.response = result;
            return responseData;
        } else {
            // Se o banco estiver vazio ou o DAO retornar false, cai aqui
            return messages.ERROR_NOT_FOUND;
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// GET id - Listar usuário pelo ID
const listarUsuarioID = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let result = await usuarioDAO.getSelectByIdUser(id);

        if (result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            // O DAO já retorna o array de dados filtrado, pegamos a primeira posição
            responseData.response = result[0];
            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// POST - Criar usuário
const criarUsuario = async function (usuario, contentType) {
    try {
        // CORRIGIDO: Agora aceita tanto JSON tradicional quanto Multipart/Form-Data para envio de fotos
        if (
            !String(contentType).toLowerCase().includes('application/json') &&
            !String(contentType).toLowerCase().includes('multipart/form-data')
        ) {
            return messages.ERROR_CONTENT_TYPE;
        }

        // Validação dos campos obrigatórios
        if (usuario.nome == '' || usuario.nome == undefined ||
            usuario.nome_usuario == '' || usuario.nome_usuario == undefined ||
            usuario.email == '' || usuario.email == undefined ||
            usuario.senha == '' || usuario.senha == undefined ||
            (usuario.data_nascimento == '' || usuario.data_nascimento == undefined)
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {

            let senhaCriptografada = await bcrypt.hash(usuario.senha, 10);
            usuario.senha = senhaCriptografada;

            // Aqui, 'result' receberá o ID que o DAO retornar
            let result = await usuarioDAO.setInsertUser(usuario);

            if (result) {
                let responseData = Object.assign({}, messages.HEADER);
                responseData.status = messages.SUCCESS_CREATED_ITEM.status;
                responseData.status_code = messages.SUCCESS_CREATED_ITEM.status_code;
                responseData.message = messages.SUCCESS_CREATED_ITEM.message;

                // Retornamos o ID que veio do banco
                responseData.usuario_criado = {
                    id: result
                };

                return responseData;
            } else {
                return messages.ERROR_INTERNAL_SERVER_MODEL;
            }
        }
    } catch (error) {
        console.log(error);
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// PUT - Atualizar usuário
const atualizarUsuario = async function (usuario, contentType, id, arquivoUrl) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        // CORRIGIDO: Validação do Content-Type usando .includes de forma segura
        if (
            !String(contentType).toLowerCase().includes('application/json') &&
            !String(contentType).toLowerCase().includes('multipart/form-data')
        ) {
            return messages.ERROR_CONTENT_TYPE;
        }

        let buscarId = await usuarioDAO.getSelectByIdUser(id);

        if (buscarId) {
            // Tratamento da senha criptografada
            if (usuario.senha && usuario.senha !== '') {
                let senhaCriptografada = await bcrypt.hash(usuario.senha, 10);
                usuario.senha = senhaCriptografada;
            } else {
                usuario.senha = buscarId[0].senha;
            }

            // CORRIGIDO: Se veio a URL da Azure do arquivo de rotas, usa ela!
            // Nota: Mudei para "usuario.foto" porque geralmente é o campo mapeado na model. 
            // Se o seu banco/model usar "foto_perfil", basta alterar o nome abaixo.
            if (arquivoUrl) {
                usuario.foto = arquivoUrl;
            } else {
                usuario.foto = buscarId[0].foto || buscarId[0].foto_perfil;
            }

            usuario.id = id;

            let result = await usuarioDAO.setUpdateUser(usuario);

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
        console.log(error);
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// DELETE - Excluir usuário
const excluirUsuario = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let buscarId = await usuarioDAO.getSelectByIdUser(id);

        if (buscarId) {
            let result = await usuarioDAO.setDeleteUser(id);

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
    listarUsuarioID,
    listarUsuarios,
    excluirUsuario,
    atualizarUsuario,
    criarUsuario,
};