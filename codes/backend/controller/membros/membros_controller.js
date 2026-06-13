/*******************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model de membros (Controller)
 * Projeto: ConectaBook
 * Data: 13/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.1
 *******************************************************************************************/

const { response } = require("express")
const membrosDAO = require("../../model/DAO/membros.js")
const messages = require("../modulo/config_messages.js")


// GET - Listar todos os membros
const listarMembros = async function () {
    try {
        const result = await membrosDAO.getSelectAllMembersClubs()

        return {
            ...messages.HEADER,
            status: messages.SUCCESS_REQUEST.status,
            status_code: messages.SUCCESS_REQUEST.status_code,
            quantidade: result?.length || 0,
            response: result || []
        }

    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// GET ID = LISTAR MEMBROS PELO ID
const listarMembroID = async function (id) {
    if (!id || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS
    }

    try {
        const result = await membrosDAO.getSelectByIdMember(id)

        if (result && result.length > 0) {
            return {
                ...messages.HEADER,
                status: messages.SUCCESS_REQUEST.status,
                status_code: messages.SUCCESS_REQUEST.status_code,
                response: result[0]
            }
        }

        return {
            ...messages.HEADER,
            status: messages.ERROR_NOT_FOUND.status,
            status_code: messages.ERROR_NOT_FOUND.status_code,
            response: "Membro não encontrado"
        }

    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// GET -  RETORNA OS USUÁRIOS QUE PARTICIPAM DE UM CLUBE ESPECIFICO
const listarMembrosPorClubeID = async function (idClube) {
    if (idClube == '' || idClube == undefined || isNaN(idClube)) {
        return messages.ERROR_REQUIRED_FIELDS
    }

    try {
        let result = await membrosDAO.getSelectUsersByIdClub(idClube)

        if (result.length >= 0) {
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


// GET - RETORNA OS CLUBES QUE O USUÁRIO PARTICIPA
const listarClubesPorUsuarioID = async function (idUsuario) {
    if (!idUsuario || isNaN(idUsuario)) {
        return messages.ERROR_REQUIRED_FIELDS
    }

    try {
        const result = await membrosDAO.getSelectClubsThatUserParticipateByIdUser(idUsuario)

        // 🔥 REGRA MAIS IMPORTANTE DO PROJETO
        return {
            ...messages.HEADER,
            status: messages.SUCCESS_REQUEST.status,
            status_code: messages.SUCCESS_REQUEST.status_code,
            quantidade: result?.length || 0,
            response: result || []
        }

    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// GET - RETORNA OS CLUBES QUE O USUARIO ADMINISTRA
const listarClubesAdminPorUsuarioID = async function (idUsuario) {
    if (!idUsuario || isNaN(idUsuario)) {
        return messages.ERROR_REQUIRED_FIELDS
    }

    try {
        const result = await membrosDAO.getSelectClubsAdminByUser(idUsuario)

        return {
            ...messages.HEADER,
            status: messages.SUCCESS_REQUEST.status,
            status_code: messages.SUCCESS_REQUEST.status_code,
            quantidade: result?.length || 0,
            response: result || []
        }

    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// POST - CRIAR NOVO MEMBRO
const criarMembro = async function (membro, contentType) {
    try {
        if (String(contentType).toLowerCase() !== "application/json") {
            return messages.ERROR_CONTENT_TYPE
        }

        if (
            membro.administrador === undefined ||
            membro.id_usuario === undefined ||
            membro.id_clube === undefined
        ) {
            return messages.ERROR_REQUIRED_FIELDS
        }

        const verificarMembro = await membrosDAO.getSelectMemberByUserAndClub(
            membro.id_usuario,
            membro.id_clube
        )

        if (verificarMembro) {
            return {
                ...messages.HEADER,
                status: false,
                status_code: 409,
                response: "Usuario já participa deste clube."
            }
        }

        const result = await membrosDAO.setInsertMembers(membro)

        return {
            ...messages.HEADER,
            status: messages.SUCCESS_CREATED_ITEM.status,
            status_code: messages.SUCCESS_CREATED_ITEM.status_code,
            response: "Membro criado com sucesso"
        }

    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// PUT - ATUALIZA UM MEMBRO
// controller/membros/membros_controller.js
const atualizarMembro = async function (membro, contentType, id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        // Simplificando a validação dos campos obrigatórios
        if (membro.administrador === undefined || membro.id_usuario == '' ||
            membro.id_usuario == undefined || membro.id_clube == '' ||
            membro.id_clube == undefined) {
            return messages.ERROR_REQUIRED_FIELDS
        } else {
            let buscarId = await membrosDAO.getSelectByIdMember(id)

            if (buscarId) {
                // AQUI: use o nome que sua DAO espera (id_membros)
                membro.id_membros = id

                let result = await membrosDAO.setUpdateMembers(membro)

                if (result.length >= 0) {
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

// DELETE - EXCLUIR UM MEMBRO
const excluirMembro = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
        return messages.ERROR_REQUIRED_FIELDS
    }

    try {
        let buscarId = await membrosDAO.getSelectByIdMember(id)

        if (buscarId) {

            let result = await membrosDAO.setDeleteMembers(id)

            if (result.length >= 0) {
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


// DELETA OS RELACIONAMENTOS DE UM USUÁRIO
const excluirMembrosPorIdClube = async function (idClube) {
    if (idClube == '' || idClube == undefined || isNaN(idClube)) {
        return messages.ERROR_REQUIRED_FIELDS
    }

    try {
        let buscarId = await membrosDAO.getSelectUsersByIdClub(idClube)


        if (buscarId) {
            let result = await membrosDAO.setDeleteMembersByClubeId(idClube)

            if (result.length >= 0) {
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
    listarMembros,
    listarMembroID,
    listarClubesPorUsuarioID,
    listarClubesPorUsuarioID,
    listarMembrosPorClubeID,
    listarClubesAdminPorUsuarioID,
    criarMembro,
    atualizarMembro,
    excluirMembro,
    excluirMembrosPorIdClube

}