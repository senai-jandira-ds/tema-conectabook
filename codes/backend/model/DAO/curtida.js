/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de curtidas no Banco de Dados
 * Projeto: ConectaBook
 * Data: 21/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.0
 *******************************************************************************************/

// CONEXÃO COM O BD
const db = require('../../database/connection')

//RETORNA TODAS AS CURTIDAS DO BANCO
const getSelectAllLikes = async function () {
    try {
        let sql = `select * from tbl_curtida order by id_curtida asc`

        let result = await db.raw(sql)

        if (result && result[0].length > 0) {
            return result[0]
        } else {
            return false
        }
    } catch (error) {
        return false
    }

}


//RETORNA UMA CURTIDA PELO ID
const getSelectByIdLike = async function (id) {
    try {
        let sql = `select * from tbl_curtida where id_curtida = ${id}`
        let result = await db.raw(sql)

        if (result && result[0].length > 0) {
            return result[0]
        } else {
            return false
        }
    } catch (error) {
        return false
    }

}

//RETORNA CURTIDA PELO ID DA MENSAGEM

//RETORNA CURTIDAS PELO ID DO USUÁRIO
const getSelectLikeByIdUser = async function (idUsuario) {
    try {
        let sql = `
        select
                tbl_curtida.id_curtida,
                tbl_curtida.id_usuario,
                tbl_curtida.id_mensagem,
                tbl_usuario as nome_usuario,
            from tbl_curtida
                  inner join tbl_usuario
                      on tbl_usuario.id_usuario = tbl_curtida.id_usuario
            where tbl_curtida.id_usuario = ? 
         `
        let result = await db.raw(sql, [idUsuario]);

        if (result && result[0].length > 0)
            return result[0];
        else
            return false;

    } catch (error) {
        console.log("Erro ao buscar curtidas", error);
        return false;
    }
}

// RETORNA CURTIDAS PELO ID DA MENSAGEM (POST)
const getSelectLikeByIdMessage = async function (idMensagem) {
    try {
        let sql = `
            select
                tbl_curtida.id_curtida,
                tbl_curtida.id_usuario,
                tbl_curtida.id_mensagem,
                tbl_usuario.nome as nome_usuario
            from tbl_curtida
                inner join tbl_usuario
                    on tbl_usuario.id_usuario = tbl_curtida.id_usuario
            where tbl_curtida.id_mensagem = ?
        `
        let result = await db.raw(sql, [idMensagem]);

        // Dependendo de como o Knex/banco está configurado no seu projeto, 
        // o resultado pode vir direto em 'result' ou em 'result[0]'. 
        // Mantive o padrão do seu código anterior:
        if (result && result[0].length > 0)
            return result[0];
        else
            return false;

    } catch (error) {
        console.log("Erro ao buscar curtidas do post", error);
        return false;
    }
}

//INSERE UMA CURTIDA
const setInsertLike = async function (curtida) {
    try {
        let sql = `insert into tbl_curtida (id_usuario, id_mensagem) values (${curtida.id_usuario}, ${curtida.id_mensagem});`;

        let result = await db.raw(sql);

        // No MySQL via Knex, o "insertId" do elemento inserido fica no result[0].insertId
        if (result && result[0].insertId) {
            return result[0].insertId; // Retorna o ID numérico gerado
        } else if (result && result.insertId) {
            return result.insertId;
        } else {
            return false;
        }
    } catch (error) {
        console.error("🚨 Erro SQL ao inserir curtida:", error);
        return false;
    }
}

//ATUALIZA UMA CURTIDA
const setUpdateLike = async function (curtida) {
    try {
        let sql = `update tbl_curtida set
                     id_usuario = '${curtida.id_usuario}',
                     id_mensagem = '${curtida.id_mensagem}'
                    where id_curtida = ${curtida.id} `

        let result = await db.raw(sql)

        if (result && result[0].affectedRows > 0)
            return true;
        else
            return false;

    } catch (error) {
        return false;
    }
}

//DELETA UMA CURTIDA
const setDeleteLike = async function (id) {
    try {
        let sql = `delete from tbl_curtida where id_curtida = ${id}`
        let result = await db.raw(sql)

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

//DELETA UMA CURTIDA POR USUÁRIO
const setDeleteLikeByIdUser = async function (id) {
    try {
        let sql = `delete from tbl_curtida where id_usuario = ${id}`
        let result = await db.raw(sql)

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {

    }

}



module.exports = {
    getSelectAllLikes,
    getSelectByIdLike,
    getSelectLikeByIdUser,
    getSelectLikeByIdMessage,
    setInsertLike,
    setUpdateLike,
    setDeleteLike,
    setDeleteLikeByIdUser
}
