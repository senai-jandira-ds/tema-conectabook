/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de gêneros no Banco de Dados MySQL
 * Projeto: ConectaBook
 * Data: 06/05/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.1 (Ajustado para retornar apenas o índice [0])
 *******************************************************************************************/

// CONEXÃO COM O BANCO DE DADOS
const db = require('../../database/connection');

// RETORNA TODOS OS GÊNEROS DO BANCO
const getSelectAllGenres = async function () {
    try {
        let sql = `select * from tbl_genero order by id_genero asc`
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

// RETORNA GÊNERO PELO ID
const getSelectByIdGenre = async function (id) {
    try {
        let sql = `select * from tbl_genero where id_genero = ${id}`
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

// INSERE UM GÊNERO
const setInsertGenre = async function (genero) {
    try {
        let sql = `insert into tbl_genero (
                        nome,
                        descricao
                    ) values (
                        '${genero.nome}',
                        '${genero.descricao}'
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

//INSERE VARIOS GENEROS


// ATUALIZA UM GÊNERO
const setUpdateGenre = async function (genero) {
    try {
        let sql = `update tbl_genero set 
                        nome = '${genero.nome}',
                        descricao = '${genero.descricao}'
                    where id_genero = ${genero.id}`
        
        let result = await db.raw(sql)

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

// DELETA UM GÊNERO NO BANCO
const setDeleteGenre = async function (id) {
    try {
        let sql = `delete from tbl_genero where id_genero = ${id}`
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
    getSelectAllGenres,
    getSelectByIdGenre,
    setInsertGenre,
    setUpdateGenre,
    setDeleteGenre
}