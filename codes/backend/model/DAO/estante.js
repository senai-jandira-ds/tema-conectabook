/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de estante no Banco de Dados MySQL
 * Projeto: ConectaBook
 * Data: 12/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.1
 *******************************************************************************************/

// CONEXÃO COM O BANCO DE DADOS
const db = require('../../database/connection')


// RETORNA TODAS AS ESTANTES DO BANCO
const getSelectAllBookcase = async function () {
    try {
        let sql = `select * from tbl_estante order by id_estante`

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

// RETORNA ESTANTES PELO ID ESTANTE
const getSelectByIdBookcase = async function (id) {
    try {
        let sql = `select * from tbl_estante where id_estante = ${id}`
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

// RETORNA ESTANTES PELO ID DO USUÁRIO
const getSelectBookcaseByIdUser = async function (idUsuario) {
    try {
        let sql = `
            select
    tbl_estante.id_estante,
    tbl_estante.id_usuario,
    tbl_estante.data_adicao,
    tbl_livro.id_livro,
    tbl_livro.isbn,
    tbl_livro.titulo,
    tbl_livro.capa,
    tbl_livro.autor,
    tbl_livro.descricao,
    tbl_status_livro.nome_status as status_leitura 
from tbl_estante
    inner join tbl_livro
        on tbl_livro.id_livro = tbl_estante.id_livro
    inner join tbl_status_livro
        on tbl_status_livro.id_status_livro = tbl_estante.id_status_livro
where tbl_estante.id_usuario = ?
        `


        let result = await db.raw(sql, [idUsuario])

        if (result && result[0].length > 0) {
            return result[0]
        } else {
            return false
        }

    } catch (error) {
        console.error("Erro ao buscar estante do usuário:", error)
        return false
    }
}

// RETORNA OS LIVROS DA ESTANTE DE UM USUÁRIO FILTRADO POR UM STATUS ESPECÍFICO
const getSelectBookcaseByStatus = async function (idUsuario, nomeStatus) {
    try {
        let sql = `
            select
                tbl_estante.id_estante,
                tbl_estante.id_usuario,
                tbl_estante.data_adicao,
                tbl_livro.id_livro,
                tbl_livro.isbn,
                tbl_livro.titulo,
                tbl_livro.capa,
                tbl_livro.autor,
                tbl_livro.descricao,
                tbl_status_livro.nome_status as status_leitura
            from tbl_estante
                inner join tbl_livro
                    on tbl_livro.id_livro = tbl_estante.id_livro
                inner join tbl_status_livro
                    on tbl_status_livro.id_status_livro = tbl_estante.id_status_livro
            where tbl_estante.id_usuario = ? 
              and tbl_status_livro.nome_status = ?
        `

        let result = await db.raw(sql, [idUsuario, nomeStatus])

        if (result && result[0].length > 0) {
            return result[0]
        } else {
            return false
        }
    } catch (error) {
        console.error(`Erro ao buscar livros com status ${nomeStatus}:`, error)
        return false
    }
}

// INSERE UMA NOVA ESTANTE
// INSERE UMA NOVA ESTANTE (Versão Corrigida, Parametrizada e com Log de Erro)
const setInsertBookcase = async function (estante) {
    try {
        let sql = `insert into tbl_estante (
                        id_usuario,
                        id_status_livro,
                        id_livro,
                        data_adicao
                    ) values (?, ?, ?, ?)`
        const dataAdicao = estante.data_adicao && estante.data_adicao !== ''
            ? estante.data_adicao
            : new Date().toISOString().slice(0, 10);

        let result = await db.raw(sql, [
            estante.id_usuario,
            estante.id_status_livro,
            estante.id_livro,
            dataAdicao
        ])

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        console.error("🚨 ERRO CRÍTICO NO BANCO (DAO ESTANTE):", error.message);
        return false
    }
}

// ATUALIZA UMA ESTANTE (Versão Corrigida e Segura)
const setUpdateBookcase = async function (estante) {
    try {
        let sql = `update tbl_estante set
                        id_usuario = ?,
                        id_status_livro = ?,
                        id_livro = ?,
                        data_adicao = ?
                    where id_estante = ?`

        const dataAdicao = estante.data_adicao && estante.data_adicao !== ''
            ? estante.data_adicao
            : new Date().toISOString().slice(0, 10);

        let result = await db.raw(sql, [
            estante.id_usuario,
            estante.id_status_livro,
            estante.id_livro,
            dataAdicao,
            estante.id_estante // ID do WHERE
        ])
        if (result && result[0] && (result[0].affectedRows > 0 || result[0].warningStatus === 0))
            return true
        else
            return false

    } catch (error) {
        // Se o banco reclamar de algo, você verá o motivo real aqui no terminal
        console.error("🚨 ERRO NO BANCO AO ATUALIZAR ESTANTE:", error.message);
        return false
    }
}

// DELETA UMA ESTANTE
const setDeleteBookcase = async function (id) {
    try {
        let sql = `delete from tbl_estante where id_estante = ${id}`
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
    getSelectAllBookcase,
    getSelectByIdBookcase,
    getSelectBookcaseByIdUser,
    getSelectBookcaseByStatus,
    setInsertBookcase,
    setUpdateBookcase,
    setDeleteBookcase

}