/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de notificações no Banco de Dados MySQL
 * Projeto: ConectaBook
 * Data: 06/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.1 
 *******************************************************************************************/


// CONEXÃO COM O BANCO DE DADOS
const db = require('../../database/connection')

//retorna todas as notificações 
const getSelectAllNotifications = async function () {
    try {
        let sql = `select * from tbl_notificacao order by id_notificacao asc`
        let result = await db.raw(sql)

        // Retorna apenas a lista de dados (índice 0)
        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}


//RETORNA NOTIFICAÇÃO PELO ID
const getSelectByIdNotification = async function (id) {
    try {
        let sql = `select * from tbl_notificacao where id_notificacao = ${id}`
        let result = await db.raw(sql)

        if (result && result[0].length > 0)
            return result
        else
            return false
    } catch (error) {
        return false
    }

}


//RETORNA NOTIFICAÇÃO PELO ID DO USUÁRIO
const getSelectNotificationsByIdUser = async function (idUsuario) {
    try {
        let sql = `select * from tbl_notificacao where id_usuario = ${idUsuario}`
        let result = await db.raw(sql)

        // Retorna o primeiro registro do índice 0
        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}


// INSERE UMA NOTIFICAÇÃO NO BD
const setInsertNotification = async function (notificacao) {
    try {
        let sql = `insert into tbl_notificacao (
                        titulo,
                        mensagem,
                        data_envio,
                        id_usuario
        ) values (
            '${notificacao.titulo}',
            '${notificacao.mensagem}',
            '${notificacao.data_envio}',
            '${notificacao.id_usuario}'
        )`
        let result = await db.raw(sql);

        if (result && result[0].affectedRows > 0)
            return true;
        else
            return false;

    } catch (error) {
        return false;
    }
}



// Atualiza uma notificacao no bd 
const setUpdateNotification = async function (notificacao) {
    try {
        let sql = `update tbl_notificacao set
                         titulo = ?,
                         mensagem = ?,
                         data_envio = ?,
                         id_usuario = ?
                   where id_notificacao = ?`

        let result = await db.raw(sql, [
            notificacao.titulo,
            notificacao.mensagem,
            notificacao.data_envio,
            notificacao.id_usuario,
            notificacao.id // ID usado no WHERE
        ])

        if (result && result[0] && (result[0].affectedRows > 0 || result[0].warningStatus === 0))
            return true
        else
            return false

    } catch (error) {
        console.error("🚨 ERRO NO BANCO AO ATUALIZAR NOTIFICAÇÃO:", error.message);
        return false
    }
}

// DELETA UMA NOTIFICACAO NO BANCO
const setDeleteNotification = async function (id) {
    try {
        let sql = `delete from tbl_notificacao where id_notificacao = ${id}`
        let result = await db.raw(sql)

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}


module.exports = {
    getSelectAllNotifications,
    getSelectByIdNotification,
    getSelectNotificationsByIdUser,
    setInsertNotification,
    setUpdateNotification,
    setDeleteNotification
}