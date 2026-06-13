/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de livros no Banco de Dados MySQL
 * Projeto: ConectaBook
 * Data: 01/06/2026
 * Autor: Geovanna Silva / Alex Henrique
 * Versão: 1.2 
 *******************************************************************************************/

// CONEXÃO COM O BANCO DE DADOS
const db = require('../../database/connection');

// RETORNA TODOS OS LIVROS DO BANCO
const getSelectAllBooks = async function () {
    try {
        let sql = `select * from tbl_livro order by id_livro asc`
        let result = await db.raw(sql)

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

// RETORNA LIVRO PELO ID (CORRIGIDO: Agora usa placeholder '?' protegendo a String)
const getSelectByIdBook = async function (id) {
    try {
        let sql = `select * from tbl_livro where id_livro = ?`
        let result = await db.raw(sql, [id])

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

// INSERE UM LIVRO NO BANCO (CORRIGIDO: Agora usa placeholders '?' no lugar de interpolação direta)
const setInsertBook = async function (livro) {
    try {
        let sql = `insert into tbl_livro (
                        id_livro,
                        isbn,
                        titulo, 
                        autor, 
                        descricao,
                        capa
                    ) values (?, ?, ?, ?, ?, ?)`

        let result = await db.raw(sql, [
            livro.id_livro || livro.id, // Garante o recebimento do ID textual vindo do client/API externa
            livro.isbn,
            livro.titulo,
            livro.autor, 
            livro.descricao,
            livro.capa
        ])

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

// ATUALIZA UM LIVRO NO BANCO (CORRIGIDO: Agora usa placeholders '?' protegendo a String do ID)
const setUpdateBook = async function (livro) {
    try {
        let sql = `update tbl_livro set 
                        isbn = ?,
                        titulo = ?,
                        autor = ?, 
                        descricao = ?,
                        capa = ?
                    where id_livro = ?`

        let result = await db.raw(sql, [
            livro.isbn,
            livro.titulo,
            livro.autor, 
            livro.descricao,
            livro.capa,
            livro.id
        ])
        
        if (result && result[0]) {
            const header = result[0];
            if (header.affectedRows > 0) {
                return true;
            }
        }
        return false;

    } catch (error) {
        console.log("Erro ao atualizar livro no banco:", error);
        return false;
    }
}

// DELETA UM LIVRO (CORRIGIDO: Agora usa placeholder '?' protegendo a String)
const setDeleteBook = async function (id) {
    try {
        let sql = `delete from tbl_livro where id_livro = ?`
        let result = await db.raw(sql, [id])

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports =  {
    getSelectAllBooks,
    getSelectByIdBook,
    setInsertBook,
    setUpdateBook,
    setDeleteBook
}