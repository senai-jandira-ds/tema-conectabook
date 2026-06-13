/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD da relação Avaliação-Cafeteria no Banco
 * Projeto: ConectaBook
 * Data: 26/05/2026
 * Autor: Alex Gomes
 * Versão: 1.0 
 *******************************************************************************************/

const db = require('../../database/connection')

// RETORNA TODAS AS RELAÇÕES AVALIAÇÃO-CAFETERIA
const getSelectAllAvaliacaoCafeteria = async function () {
    try {
        let sql = `select * from tbl_avaliacao_cafeteria order by id_avaliacao_cafeteria asc`
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
const getSelectByIdAvaliacaoCafeteria = async function (id) {
    try {
        let sql = `select * from tbl_avaliacao_cafeteria where id_avaliacao_cafeteria = ${id}`
        let result = await db.raw(sql)

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

// RETORNA AS AVALIAÇÕES FILTRADAS PELO ID DA CAFETERIA (COM DADOS DO USUÁRIO)
const getSelectAvaliacoesByCafeteria = async function (idCafeteria) {
    try {
        let sql = `select 
                        ac.id_avaliacao_cafeteria,
                        ac.id_cafeteria,
                        a.id_avaliacao,
                        a.estrelas,
                        a.mensagem,
                        a.data_avaliacao,
                        u.id_usuario,
                        u.nome as nome_usuario,
                        u.foto_perfil
                    from tbl_avaliacao_cafeteria as ac
                        inner join tbl_avaliacao as a
                            on ac.id_avaliacao = a.id_avaliacao
                        inner join tbl_usuario as u
                            on a.id_usuario = u.id_usuario
                    where ac.id_cafeteria = ${idCafeteria}
                    order by a.data_avaliacao desc`;

        let result = await db.raw(sql);

        if (result && result[0].length > 0)
            return result[0];
        else
            return false;
    } catch (error) {
        console.error("Erro no getSelectAvaliacoesByCafeteria:", error);
        return false;
    }
}

// RETORNA AS AVALIAÇÕES DE CAFETERIAS FEITAS POR UM USUÁRIO ESPECÍFICO (COM DADOS DO USUÁRIO)
const getSelectAvaliacoesByUsuario = async function (idUsuario) {
    try {
        let sql = `select 
                        ac.id_avaliacao_cafeteria,
                        ac.id_cafeteria,
                        a.id_avaliacao,
                        a.estrelas,
                        a.mensagem,
                        a.data_avaliacao,
                        u.id_usuario,
                        u.nome as nome_usuario,
                        u.foto_perfil
                    from tbl_avaliacao_cafeteria as ac
                        inner join tbl_avaliacao as a
                            on ac.id_avaliacao = a.id_avaliacao
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

// RETORNA O TOTAL DE AVALIAÇÕES E A MÉDIA DE ESTRELAS DE UMA CAFETERIA
const getEstatisticasAvaliacaoByCafeteria = async function (idCafeteria) {
    try {
        let sql = `select 
                        ac.id_cafeteria,
                        COUNT(a.id_avaliacao) as total_avaliacoes,
                        ROUND(AVG(a.estrelas), 1) as media_estrelas
                    from tbl_avaliacao_cafeteria as ac
                        inner join tbl_avaliacao as a
                            on ac.id_avaliacao = a.id_avaliacao
                    where ac.id_cafeteria = ${idCafeteria}
                    group by ac.id_cafeteria`;

        let result = await db.raw(sql);

        if (result && result[0].length > 0)
            return result[0];
        else
            return false;
    } catch (error) {
        console.error("Erro no getEstatisticasAvaliacaoByCafeteria:", error);
        return false;
    }
}

// INSERE UMA NOVA RELAÇÃO AVALIAÇÃO-CAFETERIA
const setInsertAvaliacaoCafeteria = async function (avaliacaoCafeteria) {
    try {
        let sql = `insert into tbl_avaliacao_cafeteria (
                    id_avaliacao,
                    id_cafeteria
                    ) values (
                     ${avaliacaoCafeteria.id_avaliacao},
                     ${avaliacaoCafeteria.id_cafeteria}        
                    )`

        let result = await db.raw(sql);

        if (result && result[0].affectedRows > 0)
            return true;
        else
            return false;

    } catch (error) {
        console.error("Erro no setInsertAvaliacaoCafeteria:", error);
        return false;
    }
}

// ATUALIZA UMA RELAÇÃO AVALIAÇÃO-CAFETERIA
const setUpdateAvaliacaoCafeteria = async function (avaliacaoCafeteria) {
    try {
        let sql = `update tbl_avaliacao_cafeteria set
                       id_avaliacao = ${avaliacaoCafeteria.id_avaliacao},
                       id_cafeteria = ${avaliacaoCafeteria.id_cafeteria}
                  where id_avaliacao_cafeteria = ${avaliacaoCafeteria.id}`

        let result = await db.raw(sql)

        if (result && result[0].warningStatus >= 0)
            return true
        else
            return false

    } catch (error) {
        console.error("Erro no setUpdateAvaliacaoCafeteria:", error);
        return false
    }
}

// DELETA UMA RELAÇÃO AVALIAÇÃO-CAFETERIA 
const setDeleteAvaliacaoCafeteria = async function (id) {
    try {
        let sql = `delete from tbl_avaliacao_cafeteria where id_avaliacao_cafeteria = ${id}`
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
    getSelectAllAvaliacaoCafeteria,
    getSelectByIdAvaliacaoCafeteria,
    getSelectAvaliacoesByCafeteria,
    getSelectAvaliacoesByUsuario,
    getEstatisticasAvaliacaoByCafeteria,
    setInsertAvaliacaoCafeteria,
    setUpdateAvaliacaoCafeteria,
    setDeleteAvaliacaoCafeteria
}