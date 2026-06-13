/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de livros e gêneros (tabela de relação)
 * Projeto: ConectaBook
 * Data: 01/06/2026
 * Autor: Geovanna Silva / Alex Henrique
 * Versão: 1.3
 *******************************************************************************************/

// CONEXÃO COM O BANCO DE DADOS
const db = require('../../database/connection');

// RETORNA TODOS OS REGISTROS DA TABELA RELACIONAMENTO DE LIVROS E GÊNEROS
const getSelectAllGenresBooks = async function () {
    try {
        let sql = `select * from tbl_genero_livro order by id_genero_livro asc`
        let result = await db.raw(sql)

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch(error) {
        return false
    }
}

// RETORNA O RELACIONAMENTO PELO ID DA TABELA INTERMEDIÁRIA
const getSelectByIdGenresBooks = async function (id) {
    try {
        let sql = `select * from tbl_genero_livro where id_genero_livro = ?`
        let result = await db.raw(sql, [id])

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch(error) {
        return false
    }
}

// RETORNA OS GÊNEROS DE UM LIVRO ESPECÍFICO (idLivro agora é String)
const getSelectGenresByIdBooks = async function (idLivro) {
    try {
        let sql = `select
                    tbl_genero.id_genero,
                    tbl_genero.nome
                   from tbl_livro
                        join tbl_genero_livro on tbl_livro.id_livro = tbl_genero_livro.id_livro
                        join tbl_genero on tbl_genero.id_genero = tbl_genero_livro.id_genero
                   where tbl_livro.id_livro = ?;`

        let result = await db.raw(sql, [idLivro])

        if (result && result[0].length > 0)
            return result[0]
        else  
            return false
    } catch(error) {
        return false
    }
}

// RETORNA OS LIVROS QUE POSSUEM UM GÊNERO ESPECÍFICO
const getSelectBooksByIdGenres = async function (idGenero) {
    try {
        let sql = `select
                    tbl_livro.id_livro,
                    tbl_livro.capa,
                    tbl_livro.titulo
                   from tbl_genero
                        join tbl_genero_livro on tbl_genero.id_genero = tbl_genero_livro.id_genero
                        join tbl_livro on tbl_livro.id_livro = tbl_genero_livro.id_livro
                   where tbl_genero.id_genero = ?;`
        
        let result = await db.raw(sql, [idGenero])

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch(error) {
        return false
    }
}

// INSERE UM NOVO RELACIONAMENTO (CORRIGIDO: Agora usa placeholders '?' protegendo a String)
const setInsertGenresBooks = async function (generoLivro) {
    try {
        let sql = `insert into tbl_genero_livro(id_genero, id_livro) values (?, ?)`

        let result = await db.raw(sql, [generoLivro.id_genero, generoLivro.id_livro])

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false
    } catch(error) {
        return false
    }
}

// INSERE VÁRIOS RELACIONAMENTOS DE UMA VEZ (Modificado para parametrizar de forma segura as Strings)
const setInsertMultiplesGenresBooks = async function (dados) {
    try {
        // Cria um array de placeholders: [ (?, ?), (?, ?) ]
        const placeholders = dados.generos.map(() => '(?, ?)').join(',')
        let sql = `insert into tbl_genero_livro (id_genero, id_livro) values ${placeholders}`

        // Achata os valores em uma lista única estruturada: [id_g1, id_livro, id_g2, id_livro...]
        const valoresParametrizados = []
        dados.generos.forEach(id_genero => {
            valoresParametrizados.push(id_genero, dados.id_livro)
        })

        let result = await db.raw(sql, valoresParametrizados)
        return !!(result && result[0].affectedRows > 0)
    } catch (error) {
        return false
    }
}

// ATUALIZA UM RELACIONAMENTO (CORRIGIDO: Agora usa placeholders '?' protegendo a String)
const setUpdateGenresBooks = async function (generoLivro) {
    try {
        let sql = `update tbl_genero_livro set
                        id_genero = ?,
                        id_livro = ?
                    where id_genero_livro = ?`

        let result = await db.raw(sql, [generoLivro.id_genero, generoLivro.id_livro, generoLivro.id_genero_livro])

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false
    } catch(error) {
        return false
    }
}

// DELETA UM RELACIONAMENTO PELO ID DA INTERMEDIÁRIA
const setDeleteGenresBooks = async function (id) {
    try {
        let sql = `delete from tbl_genero_livro where id_genero_livro = ?`
        let result = await db.raw(sql, [id])

        if (result && result[0]) {
            const header = result[0];
            if (header.affectedRows > 0) {
                return true;
            }
        }
        return false;
    } catch(error) {
        return false;
    }
}

// DELETA OS RELACIONAMENTOS DE UM LIVRO (id recebido agora é uma String)
const setDeleteGenresByIdBook = async function (id) {
    try {
        let sql = `delete from tbl_genero_livro where id_livro = ?`
        let result = await db.raw(sql, [id])

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false
    } catch(error) {
        return false
    }
}

module.exports = {
    getSelectAllGenresBooks,
    getSelectGenresByIdBooks,
    getSelectBooksByIdGenres,
    getSelectByIdGenresBooks,
    setInsertGenresBooks,
    setInsertMultiplesGenresBooks,
    setUpdateGenresBooks,
    setDeleteGenresBooks,
    setDeleteGenresByIdBook
}