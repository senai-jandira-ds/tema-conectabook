/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD da relação Avaliação-Livro no Banco
 * Projeto: ConectaBook
 * Data: 01/06/2026
 * Autor: Alex Gomes
 * Versão: 1.1 
 *******************************************************************************************/

const db = require('../../database/connection')

// RETORNA TODAS AS RELAÇÕES AVALIAÇÃO-LIVRO
const getSelectAllAvaliacaoLivro = async function () {
    try {
        let sql = `select * from tbl_avaliacao_livro order by id_avaliacao_livro asc`
        let result = await db.raw(sql)

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

// RETORNA A RELAÇÃO PELO ID
const getSelectByIdAvaliacaoLivro = async function (id) {
    try {
        let sql = `select * from tbl_avaliacao_livro where id_avaliacao_livro = ${id}`
        let result = await db.raw(sql)

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

// RETORNA AS AVALIAÇÕES FILTRADAS PELO ID DO LIVRO (COM DADOS DO USUÁRIO)
const getSelectAvaliacoesByLivro = async function (idLivro) {
    try {
        // AJUSTADO: '${idLivro}' adicionado aspas simples por ser String/VARCHAR
        let sql = `select 
                        al.id_avaliacao_livro,
                        al.id_livro,
                        a.id_avaliacao,
                        a.estrelas,
                        a.mensagem,
                        a.data_avaliacao,
                        u.id_usuario,
                        u.nome as nome_usuario,
                        u.foto_perfil 
                    from tbl_avaliacao_livro as al
                        inner join tbl_avaliacao as a
                            on al.id_avaliacao = a.id_avaliacao
                        inner join tbl_usuario as u
                            on a.id_usuario = u.id_usuario
                    where al.id_livro = '${idLivro}'
                    order by a.data_avaliacao desc`;

        let result = await db.raw(sql);

        if (result && result[0].length > 0)
            return result[0];
        else
            return false;
    } catch (error) {
        console.error("Erro no getSelectAvaliacoesByLivro:", error);
        return false;
    }
}

// RETORNA AS AVALIAÇÕES DE LIVROS FEITAS POR UM USUÁRIO ESPECÍFICO (COM DADOS DO USUÁRIO)
const getSelectAvaliacoesByUsuario = async function (idUsuario) {
    try {
        let sql = `select 
                        al.id_avaliacao_livro,
                        al.id_livro,
                        a.id_avaliacao,
                        a.estrelas,
                        a.mensagem,
                        a.data_avaliacao,
                        u.id_usuario,
                        u.nome as nome_usuario,
                        u.foto_perfil
                    from tbl_avaliacao_livro as al
                        inner join tbl_avaliacao as a
                            on al.id_avaliacao = a.id_avaliacao
                        inner join tbl_usuario as u
                            on a.id_usuario = u.id_usuario
                    where a.id_usuario = ${idUsuario}
                    order by a.data_avaliacao desc`;

        let result = await db.raw(sql);

        if (result && result[0].length > 0)
            return result[0];
        else
            return false;
    } catch (error) {
        console.error("Erro no getSelectAvaliacoesByUsuario:", error);
        return false;
    }
}

// RETORNA O TOTAL DE AVALIAÇÕES E A MÉDIA DE ESTRELAS DE UM LIVRO
const getEstatisticasAvaliacaoByLivro = async function (idLivro) {
    try {
        // AJUSTADO: '${idLivro}' adicionado aspas simples por ser String/VARCHAR
        let sql = `select 
                        al.id_livro,
                        COUNT(a.id_avaliacao) as total_avaliacoes,
                        ROUND(AVG(a.estrelas), 1) as media_estrelas
                    from tbl_avaliacao_livro as al
                        inner join tbl_avaliacao as a
                        on al.id_avaliacao = a.id_avaliacao
                    where al.id_livro = '${idLivro}'
                    group by al.id_livro`;

        let result = await db.raw(sql);

        if (result && result[0].length > 0)
            return result[0];
        else
            return false;
    } catch (error) {
        console.error("Erro no getEstatisticasAvaliacaoByLivro:", error);
        return false;
    }
}

// INSERE UMA NOVA RELAÇÃO AVALIAÇÃO-LIVRO
const setInsertAvaliacaoLivro = async function (avaliacaoLivro) {
    try {
        // AJUSTADO: '${avaliacaoLivro.id_livro}' adicionado aspas simples por ser String/VARCHAR
        let sql = `insert into tbl_avaliacao_livro (
                    id_avaliacao,
                    id_livro
                    ) values (
                     ${avaliacaoLivro.id_avaliacao},
                     '${avaliacaoLivro.id_livro}'       
                    )`

        let result = await db.raw(sql);

        if (result && result[0].affectedRows > 0)
            return true;
        else
            return false;

    } catch (error) {
        console.error("Erro no setInsertAvaliacaoLivro:", error);
        return false;
    }
}

// ATUALIZA UMA RELAÇÃO AVALIAÇÃO-LIVRO
const setUpdateAvaliacaoLivro = async function (avaliacaoLivro) {
    try {
        // AJUSTADO: '${avaliacaoLivro.id_livro}' adicionado aspas simples por ser String/VARCHAR
        let sql = `update tbl_avaliacao_livro set
                       id_avaliacao = ${avaliacaoLivro.id_avaliacao},
                       id_livro = '${avaliacaoLivro.id_livro}'
                   where id_avaliacao_livro = ${avaliacaoLivro.id}`

        let result = await db.raw(sql)

        if (result && result[0].warningStatus >= 0)
            return true
        else
            return false

    } catch (error) {
        console.error("Erro no setUpdateAvaliacaoLivro:", error);
        return false
    }
}

// DELETA UMA RELAÇÃO AVALIAÇÃO-LIVRO 
const setDeleteAvaliacaoLivro = async function (id) {
    try {
        let sql = `delete from tbl_avaliacao_livro where id_avaliacao_livro = ${id}`
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
    getSelectAllAvaliacaoLivro,
    getSelectByIdAvaliacaoLivro,
    getSelectAvaliacoesByLivro,
    getSelectAvaliacoesByUsuario,
    getEstatisticasAvaliacaoByLivro,
    setInsertAvaliacaoLivro,
    setUpdateAvaliacaoLivro,
    setDeleteAvaliacaoLivro
}