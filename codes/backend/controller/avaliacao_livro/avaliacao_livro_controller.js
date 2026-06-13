/*******************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model da relação Avaliação-Livro
 * Projeto: ConectaBook
 * Data: 01/06/2026
 * Autor: Alex Gomes
 * Versão: 1.1
 *******************************************************************************************/

const avaliacaoLivroDAO = require("../../model/DAO/avaliacao_livro.js"); 
const messages = require("../modulo/config_messages.js");

// GET - Listar todas as relações de avaliação-livro
const listarAvaliacoesLivros = async function () {
    try {
        let result = await avaliacaoLivroDAO.getSelectAllAvaliacaoLivro();

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
const listarAvaliacaoLivroID = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }
    
    try {
        let result = await avaliacaoLivroDAO.getSelectByIdAvaliacaoLivro(id);

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

// GET - Listar avaliações filtradas pelo ID do Livro
const listarAvaliacoesPorLivro = async function (idLivro) {
    // AJUSTADO: Removido 'isNaN(idLivro)' já que o ID agora é uma String da API
    if (idLivro == '' || idLivro == undefined) {
        return messages.ERROR_REQUIRED_FIELDS;
    }
    
    try {
        let result = await avaliacaoLivroDAO.getSelectAvaliacoesByLivro(idLivro);

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

// GET - Listar avaliações feitas por um Usuário
const listarAvaliacoesPorUsuario = async function (idUsuario) {
    if (idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }
    
    try {
        let result = await avaliacaoLivroDAO.getSelectAvaliacoesByUsuario(idUsuario);

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

// GET - Listar estatísticas (total e média) de avaliações de um Livro
const listarEstatisticasPorLivro = async function (idLivro) {
    // AJUSTADO: Removido 'isNaN(idLivro)' já que o ID agora é uma String da API
    if (idLivro == '' || idLivro == undefined) {
        return messages.ERROR_REQUIRED_FIELDS;
    }
    
    try {
        let result = await avaliacaoLivroDAO.getEstatisticasAvaliacaoByLivro(idLivro);

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

// POST - Criar nova relação Avaliação-Livro
const criarAvaliacaoLivro = async function (avaliacaoLivro, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        // AJUSTADO: Removido 'isNaN(avaliacaoLivro.id_livro)' do validador do livro
        if (
            avaliacaoLivro.id_avaliacao == '' || avaliacaoLivro.id_avaliacao == undefined || isNaN(avaliacaoLivro.id_avaliacao) ||
            avaliacaoLivro.id_livro == '' || avaliacaoLivro.id_livro == undefined
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            let result = await avaliacaoLivroDAO.setInsertAvaliacaoLivro(avaliacaoLivro);

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

// PUT - Atualizar relação Avaliação-Livro
const atualizarAvaliacaoLivro = async function (avaliacaoLivro, contentType, id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        // AJUSTADO: Removido 'isNaN(avaliacaoLivro.id_livro)' do validador do livro
        if (
            avaliacaoLivro.id_avaliacao == '' || avaliacaoLivro.id_avaliacao == undefined || isNaN(avaliacaoLivro.id_avaliacao) ||
            avaliacaoLivro.id_livro == '' || avaliacaoLivro.id_livro == undefined
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {
            
            let buscarId = await avaliacaoLivroDAO.getSelectByIdAvaliacaoLivro(id);

            if (buscarId) {
                avaliacaoLivro.id = id; 
                let result = await avaliacaoLivroDAO.setUpdateAvaliacaoLivro(avaliacaoLivro);

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

// DELETE - Excluir relação Avaliação-Livro
const excluirAvaliacaoLivro = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let buscarId = await avaliacaoLivroDAO.getSelectByIdAvaliacaoLivro(id);

        if(buscarId) {
            let result = await avaliacaoLivroDAO.setDeleteAvaliacaoLivro(id);

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
    listarAvaliacoesLivros,
    listarAvaliacaoLivroID,
    listarAvaliacoesPorLivro,
    listarAvaliacoesPorUsuario,
    listarEstatisticasPorLivro,
    criarAvaliacaoLivro,
    atualizarAvaliacaoLivro,
    excluirAvaliacaoLivro
}