/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de avaliação no Banco de Dados MySQL
 * Projeto: ConectaBook
 * Data: 14/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.1 
 *******************************************************************************************/

const db = require('../../database/connection')

//RETORNA TODOS AS AVALIAÇÕES DO BANCO
const getSelectAllRatings = async function () {
    try {
        let sql = `select * from tbl_avaliacao order by id_avaliacao asc`
        let result = await db.raw(sql)

        if(result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
    
}


// RETORNA AVALIAÇÃO PELO ID
const getSelectByIdRating =  async function  (id) {
    try {
        let sql = `select * from tbl_avaliacao where id_avaliacao = ${id}`
        let result = await db.raw(sql)

        if(result && result[0].length > 0 )
            return result[0]
        else
            return false
    } catch (error){
        return false
    }
    
}

// RETORNA AVALIAÇÃO PELO ID DO USUARIO
const getSelectRatingByIdUser = async function (idUsuario) {
    try {
        let sql = `
           select
               tbl_avaliacao.id_avaliacao,
               tbl_avaliacao.estrelas,
               tbl_avaliacao.mensagem,
               tbl_avaliacao.data_avaliacao,
               tbl_usuario.nome as usuario
            from tbl_avaliacao
                inner join tbl_usuario
                    on tbl_usuario.id_usuario = tbl_avaliacao.id_usuario
            where tbl_avaliacao.id_usuario = ?
            order by tbl_avaliacao.data_avaliacao asc`

    
        let result = await db.raw(sql, [idUsuario]);

        if (result && result[0] && result[0].length > 0) 
            return result[0];
        else
            return false  
    } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
        return false; 
    }
}


//INSERE UMA AVALIAÇÃO 
const setInsertRating = async function (avaliacao) {
    try {
        // Se houver valor, envolve em aspas simples. Se for nulo/vazio, passa a palavra NULL pura (sem aspas)
        const mensagemSql = avaliacao.mensagem && avaliacao.mensagem !== '' 
            ? `'${avaliacao.mensagem}'` 
            : 'NULL';

        // 🔥 Removemos as aspas simples de volta de ${mensagemSql} e ${dataSql} na query:
        let sql = `insert into tbl_avaliacao (
                    estrelas,
                    mensagem,
                    id_usuario,
                    data_avaliacao
                    ) values (
                     ${avaliacao.estrelas},
                     ${mensagemSql},
                     ${avaliacao.id_usuario},
                     NOW()
                    )`;

        let result = await db.raw(sql);

        if (result && result[0].affectedRows > 0)
            return result[0];
        else
            return false;

    } catch (error) {
        console.log(error); // Dica: coloque esse console.log temporário se precisar ver erros do banco
        return false;
    }
}


// ATUALIZA UMA AVALIAÇÃO
const setUpdateRating = async function (avaliacao) {
    try {
        // Trata a mensagem (se for string vazia ou null, vira NULL sem aspas)
        const mensagemSql = avaliacao.mensagem && avaliacao.mensagem !== '' 
            ? `'${avaliacao.mensagem}'` 
            : 'NULL';

        let sql = `update tbl_avaliacao set
                       estrelas = ${avaliacao.estrelas},
                       mensagem = ${mensagemSql},
                       id_usuario = ${avaliacao.id_usuario},
                       data_avaliacao = NOW()
                  where id_avaliacao = ${avaliacao.id}`;

        let result = await db.raw(sql);

        // Se o registro já tiver esses mesmos dados no banco, o affectedRows pode ser 0.
        // Mudamos para >= 0 ou checamos se o result ocorreu com sucesso para não dar falso erro.
        if (result && result[0].warningStatus >= 0)
            return true;
        else
            return false;

    } catch (error) {
        console.error("Erro no setUpdateRating:", error);
        return false;
    }
}

// DELETA UMA AVALIAÇÃO 
const setDeleteRating = async function (id) {
    // Iniciamos a transação isolada no Knex
    const trx = await db.transaction();

    try {
        // 1. Deleta os relacionamentos na tabela tbl_avaliacao_livro
        let sqlLivro = `delete from tbl_avaliacao_livro where id_avaliacao = ${id}`;
        await trx.raw(sqlLivro);

        // 2. Deleta os relacionamentos na tabela tbl_avaliacao_cafeteria
        let sqlCafeteria = `delete from tbl_avaliacao_cafeteria where id_avaliacao = ${id}`;
        await trx.raw(sqlCafeteria);

        // 3. Deleta a avaliação principal na tbl_avaliacao
        let sqlAvaliacao = `delete from tbl_avaliacao where id_avaliacao = ${id}`;
        let result = await trx.raw(sqlAvaliacao);

        // Se chegou até aqui sem erros, grava de vez as alterações no banco
        await trx.commit();

        // Verifica se a avaliação principal foi realmente afetada/removida
        if (result && result[0].affectedRows > 0)
            return true;
        else
            return false;

    } catch (error) {
        // ❌ Se qualquer uma das queries falhar, desfaz TUDO o que foi feito acima
        await trx.rollback();
        return false;
    }
}

// DELETA OS RELACIONAMENTOS DE UM USUÁRIO

module.exports = {
    getSelectAllRatings,
    getSelectByIdRating,
    setInsertRating,
    setUpdateRating,
    setDeleteRating
}