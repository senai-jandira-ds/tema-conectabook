/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de usuários e gêneros (tabela de relação)
 * Projeto: ConectaBook
 * Data: 06/05/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.1 (Ajustado para retornar apenas o índice [0])
 *******************************************************************************************/

//CONEXÃO COM O BANCO DE DADOS
const db = require('../../database/connection');

//RETORNA TODOS OS REGISTROS DA TABELA DE RELAÇÃO
const getSelectAllGenresUsers = async function () {
    try {
        let sql = `select * from tbl_genero_usuario order by id_genero_usuario asc`
        let result = await db.raw(sql)

        // Retorna a lista de dados
        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    }catch(error){
        return false
    }
}

//RETORNA O RELACIONAMENTO PELO ID DA TABELA INTERMEDIÁRIA
const getSelectByIdGenresUsers = async function (id) {
    try {
        let sql = `select * from tbl_genero_usuario where id_genero_usuario = ${id}`
        let result = await db.raw(sql)

        if(result && result[0].length > 0)
            return result[0]
        else
            return false

    }catch(error){
        return false
    }
}

//RETORNA OS GÊNEROS DE UM USUÁRIO ESPECÍFICO
const getSelectGenresByIdUsers = async function (idUsuario) {
    try {
        let sql = `select
                    tbl_genero.id_genero, 
                    tbl_genero.nome
                    from tbl_usuario
                        join tbl_genero_usuario on tbl_usuario.id_usuario = tbl_genero_usuario.id_usuario 
                        join tbl_genero on tbl_genero.id_genero = tbl_genero_usuario.id_genero
                    where tbl_usuario.id_usuario = ${idUsuario};`
        let result = await db.raw(sql)

        if(result && result[0].length > 0)
            return result[0]
        else
            return false

    }catch(error){
        return false
    }
}

//RETORNA OS USUÁRIOS QUE GOSTAM DE UM GÊNERO ESPECÍFICO
const getSelectUsersByIdGenres = async function (idGenero) {
    try {
        let sql = `select
                    tbl_usuario.id_usuario, 
                    tbl_usuario.nome
                    from tbl_genero
                        join tbl_genero_usuario on tbl_genero.id_genero = tbl_genero_usuario.id_genero
                        join tbl_usuario on tbl_usuario.id_usuario = tbl_genero_usuario.id_usuario
                    where tbl_genero.id_genero = ${idGenero};`
        let result = await db.raw(sql)

        if(result && result[0].length > 0)
            return result[0]
        else
            return false

    }catch(error){
        return false
    }
}

//INSERE UM NOVO RELACIONAMENTO
const setInsertGenresUsers = async function (generoUsuario) {
    try {
        let sql = `insert into tbl_genero_usuario (
                        id_genero,
                        id_usuario
                    ) values (
                        ${generoUsuario.id_genero},
                        ${generoUsuario.id_usuario}
                    )`
        
        let result = await db.raw(sql)

        // Verifica se a linha foi afetada no índice 0
        if(result && result[0].affectedRows > 0)
            return true
        else
            return false

    }catch(error){
        return false
    }
}

// INSERE VARIOS RELACIONAMENTOS DE UMA VEZ
const setInsertMultiplesGenres = async function (dados) {
    try {
        // Cria os blocos de valores: (id_genero, id_usuario), (id_genero, id_usuario)
        const valores = dados.generos.map(id_genero => 
            `(${id_genero}, ${dados.id_usuario})`
        ).join(',');

        let sql = `insert into tbl_genero_usuario (id_genero, id_usuario) values ${valores}`;
        
        let result = await db.raw(sql);
        return !!(result && result[0].affectedRows > 0);
    } catch (error) {
        return false;
    }
}

//ATUALIZA UM RELACIONAMENTO
const setUpdateGenresUsers = async function (generoUsuario) {
    try {
        let sql = `update tbl_genero_usuario set 
                        id_genero = ${generoUsuario.id_genero},
                        id_usuario = ${generoUsuario.id_usuario}
                    where id_genero_usuario = ${generoUsuario.id_genero_usuario}`
        
        let result = await db.raw(sql)

        if(result && result[0].affectedRows > 0)
            return true
        else
            return false

    }catch(error){
        return false
    }
}

//DELETA UM RELACIONAMENTO
const setDeleteGenresUsers = async function (id) {
    try {
        let sql = `delete from tbl_genero_usuario where id_genero_usuario = ${id}`
        let result = await db.raw(sql)

        if(result && result[0].affectedRows > 0)
            return true
        else
            return false

    }catch(error){
        return false
    }
}

//DELETA OS RELACIONAMENTOS DE UM USUARIO
const setDeleteGenresByIdUser = async function (id) {
    try {
        let sql = `delete from tbl_genero_usuario where id_usuario = ?`
        let result = await db.raw(sql, [id])

        if(result && result[0].affectedRows > 0)
            return true
        else
            return false

    } catch(error) {
        return false
    }
}

module.exports = {
    getSelectAllGenresUsers,
    getSelectByIdGenresUsers,
    getSelectGenresByIdUsers,
    getSelectUsersByIdGenres,
    setInsertGenresUsers,
    setInsertMultiplesGenres,
    setUpdateGenresUsers,
    setDeleteGenresUsers,
    setDeleteGenresByIdUser
}