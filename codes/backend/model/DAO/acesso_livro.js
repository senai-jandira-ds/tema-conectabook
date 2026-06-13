/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de acessos de livros no Banco de Dados (Histórico)
 * Projeto: ConectaBook
 * Data: 01/06/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.1
 *******************************************************************************************/

const db = require('../../database/connection');

// RETORNA TODOS OS ACESSOS (HISTÓRICO GERAL)
const getSelectAllBookAccess = async function () {
    try {
        let sql = `select * from tbl_acesso_livro order by data_acesso desc`
        let result = await db.raw(sql)

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

// RETORNA UM ACESSO ESPECÍFICO PELO ID DA INTERMEDIÁRIA
const getSelectByIdBookAccess = async function (id) {
    try {
        let sql = `select * from tbl_acesso_livro where id_acesso_livro = ?`
        let result = await db.raw(sql, [id])

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

// RETORNA TODO O HISTÓRICO DE ACESSOS DE UM USUÁRIO ESPECÍFICO
const getSelectAccessByUserId = async function (idUsuario) {
    try {
        let sql = `select 
                    tbl_acesso_livro.id_acesso_livro,
                    tbl_acesso_livro.data_acesso,
                    tbl_livro.id_livro,
                    tbl_livro.titulo,
                    tbl_livro.capa
                   from tbl_acesso_livro
                        inner join tbl_livro on tbl_acesso_livro.id_livro = tbl_livro.id_livro
                   where tbl_acesso_livro.id_usuario = ?
                   order by tbl_acesso_livro.data_acesso desc`
        
        let result = await db.raw(sql, [idUsuario])

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

// REGISTRA UM NOVO ACESSO (QUANDO O USUÁRIO ABRE UM LIVRO)
const setInsertBookAccess = async function (dadosAcesso) {
    try {
        let sql = `insert into tbl_acesso_livro (
                        id_livro,
                        id_usuario,
                        data_acesso
                    ) values (
                        ?, 
                        ?, 
                        NOW()
                    )`

        // O driver lida nativamente com o tipo String inserido no array de parâmetros para o id_livro
        let result = await db.raw(sql, [dadosAcesso.id_livro, dadosAcesso.id_usuario])

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

// DELETA UM REGISTRO DO HISTÓRICO DE ACESSOS
const setDeleteBookAccess = async function (id) {
    try {
        let sql = `delete from tbl_acesso_livro where id_acesso_livro = ?`
        let result = await db.raw(sql, [id])

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllBookAccess,
    getSelectByIdBookAccess,
    getSelectAccessByUserId,
    setInsertBookAccess,
    setDeleteBookAccess
}