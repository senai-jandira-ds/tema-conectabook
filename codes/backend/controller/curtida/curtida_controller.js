/*******************************************************************************************
 * Objetivo: Controller responsável pelas regras de negócio e manipulação de Curtidas
 * Projeto: ConectaBook
 * Data: 26/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.0
 *******************************************************************************************/

const curtidaDAO = require('../../model/DAO/curtida.js')
const messages = require('../modulo/config_messages')


// GET - Listar todas as curtidas existentes
const listarTodasCurtidas = async function () {
    try {
        let result = await curtidaDAO.getSelectAllLikes()

        if (result) {
            let responseData = Object.assign({}, messages.HEADER)
            responseData.status = messages.SUCCESS_REQUEST.status
            responseData.status_code = messages.SUCCESS_REQUEST.status_code
            responseData.response = result
            return responseData
        } else {
            return messages.ERROR_NOT_FOUND
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER
    }

}


// GET - Buscar uma curtida específica pelo ID
const buscarCurtidaPorId = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        // Garante que o erro de campos obrigatórios tenha um status_code
        let erroCampos = Object.assign({}, messages.ERROR_REQUIRED_FIELDS);
        if (!erroCampos.status_code) erroCampos.status_code = 400;
        return erroCampos;
    }

    try {
        let result = await curtidaDAO.getSelectByIdLike(id)

        if (result && result.length > 0) { // Adicionada validação se o array possui itens
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            responseData.response = result[0];
            return responseData;
        } else {
            // Se não encontrar a curtida, criamos o objeto de resposta baseado no seu padrão
            // mas garantindo categoricamente a existência do status_code: 404
            let erro404 = Object.assign({}, messages.ERROR_NOT_FOUND);
            erro404.status_code = 404; // <--- FORÇA O INTEIRO AQUI PARA NÃO QUEBRAR A ROTA
            return erro404;
        }
    } catch (error) {
        console.log("Erro na Controller de Curtidas:", error);

        // Garante que o erro interno também possua o status_code: 500
        let erro500 = Object.assign({}, messages.ERROR_INTERNAL_SERVER_CONTROLLER);
        erro500.status_code = 500;
        return erro500;
    }
}

// GET - Buscar curtida pelo id do usuário
const buscarCurtidaPorIdUsuario = async function (idUsuario) {

    if (idUsuario == '' || idUsuario == undefined || isNaN(idUsuario)) {
        return messages.ERROR_REQUIRED_FIELDS
    }

    try {
        let result = await curtidaDAO.getSelectLikeByIdUser(idUsuario)

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

// Importa o teu arquivo DAO onde guardaste a função do banco de dados
const mensagemDAO = require('../../model/DAO/curtida.js'); // Ajusta o caminho se necessário

// Função para listar as curtidas de um post específico
const listarCurtidasPorMensagem = async function (idMensagem) {
    // 1. Validação do ID recebido por parâmetro
    if (idMensagem == undefined || idMensagem == '' || isNaN(idMensagem)) {
        return {
            status_code: 400,
            message: "O ID da mensagem enviado é inválido ou não foi fornecido."
        };
    }

    try {
        // CORRIGIDO: Agora chamando o nome exato da função definida no seu DAO
        let dadosCurtidas = await mensagemDAO.getSelectLikeByIdMessage(idMensagem);

        // 3. Validação segura do retorno do Banco de Dados
        if (dadosCurtidas && Array.isArray(dadosCurtidas) && dadosCurtidas.length > 0) {
            return {
                status_code: 200,
                quantidade: dadosCurtidas.length,
                curtidas: dadosCurtidas
            };
        } else {
            // Se o banco retornar false ou vazio, devolve um array vazio [] com status 200
            return {
                status_code: 200,
                quantidade: 0,
                curtidas: []
            };
        }

    } catch (error) {
        // Exibe o log do erro detalhado no terminal do VS Code
        console.error("🚨 Erro na Controller ao listar curtidas:", error.message);

        return {
            status_code: 500,
            message: "Erro interno no servidor ao processar as curtidas do post."
        };
    }
};

// POST - criar curtida (Retorna o ID gerado no corpo da resposta de sucesso)
const inserirCurtida = async function (curtida, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE
        }

        // Validação dos campos obrigatórios
        if (
            curtida.id_usuario === undefined || curtida.id_usuario === null || curtida.id_usuario === '' ||
            curtida.id_mensagem === undefined || curtida.id_mensagem === null || curtida.id_mensagem === ''
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        // MODIFICADO: Agora espera receber o ID gerado vindo da DAO (ou false caso falhe)
        let idGerado = await curtidaDAO.setInsertLike(curtida)

        if (idGerado) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_CREATED_ITEM.status;
            responseData.status_code = messages.SUCCESS_CREATED_ITEM.status_code;

            // CORRIGIDO: Garante que o ID vai estruturado no corpo do JSON de resposta
            responseData.curtida_criada = {
                id: idGerado,
                message: "Curtida registrada com sucesso!"
            };

            return responseData;
        } else {
            return messages.ERROR_INTERNAL_SERVER_MODEL;
        }
    } catch (error) {
        console.error("🚨 Erro na Controller de Curtida:", error);
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}



// DELETE  - Apagar uma curtida 
const excluirCurtida = async function (idCurtida) {
    if (idCurtida == '' || idCurtida == undefined || isNaN(idCurtida)) {
        return messages.ERROR_REQUIRED_FIELDS
    }

    try {
        let buscarCurtida = await curtidaDAO.getSelectByIdLike(idCurtida)

        if (buscarCurtida) {
            let result = await curtidaDAO.setDeleteLike(idCurtida)

            if (result) {
                let responseData = Object.assign({}, messages.HEADER)
                responseData.status = messages.SUCCESS_DELETE_ITEM.status
                responseData.status_code = messages.SUCCESS_DELETE_ITEM.status_code
                responseData.response = messages.SUCCESS_DELETE_ITEM.message
                return responseData
            } else {
                return messages.ERROR_INTERNAL_SERVER_MODEL
            }
        } else {
            return messages.ERROR_NOT_FOUND
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    listarTodasCurtidas,
    buscarCurtidaPorId,
    buscarCurtidaPorIdUsuario,
    listarCurtidasPorMensagem,
    inserirCurtida,
    excluirCurtida
}