/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de mensagem no Banco de Dados MySQL
 * Mudança: Remoção completa de tbl_conversa. Relacionamento direto através de id_clube.
 * Projeto: ConectaBook
 * Data: 01/06/2026
 * Autor: Geovanna Silva / Alex Gomes
 * Versão: 2.0
 *******************************************************************************************/

const db = require('../../database/connection')

// RETORNA TODAS AS MENSAGENS
const getSelectAllMessages = async function () {
    try {
        let sql = `select * from tbl_mensagem order by id_mensagem asc`
        let result = await db.raw(sql)

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

// RETORNA UMA MENSAGEM PELO ID
const getSelectByIdMessage = async function (id) {
    try {
        let sql = `select * from tbl_mensagem where id_mensagem = ?`
        let result = await db.raw(sql, [id])

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

// RETORNA TODAS AS MENSAGENS DE UM CLUBE ESPECÍFICO (CRONOLÓGICO)
const getSelectMessagesByIdClub = async function (idClube) {
    try {
        let sql = `select 
                    tbl_mensagem.id_mensagem,
                    tbl_mensagem.comentario,
                    tbl_mensagem.arquivo,
                    tbl_mensagem.data_postagem,
                    tbl_mensagem.id_mensagem_pai,
                    tbl_mensagem.id_clube,
                    tbl_usuario.id_usuario,
                    tbl_usuario.nome_usuario,
                    tbl_usuario.foto_perfil
                   from tbl_mensagem
                        inner join tbl_usuario on tbl_mensagem.id_usuario = tbl_usuario.id_usuario
                   where tbl_mensagem.id_clube = ?
                   order by tbl_mensagem.data_postagem asc`

        let result = await db.raw(sql, [idClube])

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        console.error("Erro na DAO ao buscar mensagens do clube:", error)
        return false
    }
}

// RETORNA TODAS AS RESPOSTAS (THREADS) DE UMA MENSAGEM/POST ESPECÍFICO
const getRepliesByMessageId = async function (idMensagemPai) {
    try {
        let sql = `select 
                    tbl_mensagem.id_mensagem,
                    tbl_mensagem.comentario,
                    tbl_mensagem.arquivo,
                    tbl_mensagem.data_postagem,
                    tbl_mensagem.id_mensagem_pai,
                    tbl_usuario.id_usuario,
                    tbl_usuario.nome_usuario,
                    tbl_usuario.foto_perfil
                   from tbl_mensagem
                        inner join tbl_usuario on tbl_mensagem.id_usuario = tbl_usuario.id_usuario
                   where tbl_mensagem.id_mensagem_pai = ?
                   order by tbl_mensagem.data_postagem asc`

        let result = await db.raw(sql, [idMensagemPai])

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        console.error("Erro na DAO ao buscar respostas da mensagem:", error)
        return false
    }
}

// RETORNA APENAS AS MENSAGENS PRINCIPAIS (POSTS INICIAIS) DE UM CLUBE ESPECÍFICO
const getMainMessagesByClubId = async function (idClube) {
    try {
        let sql = `select 
                    tbl_mensagem.id_mensagem,
                    tbl_mensagem.comentario,
                    tbl_mensagem.arquivo,
                    tbl_mensagem.data_postagem,
                    tbl_mensagem.id_mensagem_pai,
                    tbl_mensagem.id_clube,
                    tbl_usuario.id_usuario,
                    tbl_usuario.nome_usuario,
                    tbl_usuario.foto_perfil
                   from tbl_mensagem
                        inner join tbl_usuario on tbl_mensagem.id_usuario = tbl_usuario.id_usuario
                   where tbl_mensagem.id_clube = ? 
                     and tbl_mensagem.id_mensagem_pai is null
                   order by tbl_mensagem.data_postagem desc`

        let result = await db.raw(sql, [idClube])

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        console.error("Erro na DAO ao buscar mensagens principais do clube:", error)
        return false
    }
}

// RETORNA AS MENSAGENS PRINCIPAIS DO FEED GERAL (SEM CLUBE VINCULADO)
const getAllMainMessagesFeed = async function () {
    try {
        let sql = `select 
                    tbl_mensagem.id_mensagem,
                    tbl_mensagem.comentario,
                    tbl_mensagem.arquivo,
                    tbl_mensagem.data_postagem,
                    tbl_usuario.id_usuario,
                    tbl_usuario.nome_usuario,
                    tbl_usuario.foto_perfil
                   from tbl_mensagem
                        inner join tbl_usuario on tbl_mensagem.id_usuario = tbl_usuario.id_usuario
                   where tbl_mensagem.id_mensagem_pai is null 
                     and tbl_mensagem.id_clube is null -- Filtra posts sem clube
                   order by tbl_mensagem.data_postagem desc`

        let result = await db.raw(sql)

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch (error) {
        console.error("Erro na DAO ao buscar feed principal geral:", error)
        return false
    }
}

// INSERE UMA MENSAGEM
const setInsertMessage = async function (mensagem) {
    try {
        const arquivo = mensagem.arquivo && mensagem.arquivo !== '' ? mensagem.arquivo : null;
        const idMensagemPai = mensagem.id_mensagem_pai && mensagem.id_mensagem_pai !== '' ? mensagem.id_mensagem_pai : null;
        const idClube = mensagem.id_clube && mensagem.id_clube !== '' ? mensagem.id_clube : null; // Substitui id_conversa

        let sql = `
         insert into tbl_mensagem (
                comentario,
                arquivo,
                id_usuario,
                id_mensagem_pai,
                id_clube
         ) values (?, ?, ?, ?, ?)`

        let result = await db.raw(sql, [
            mensagem.comentario,
            arquivo,
            mensagem.id_usuario,
            idMensagemPai,
            idClube
        ])

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        console.error("🚨 ERRO NO BANCO AO INSERIR MENSAGEM:", error.message);
        return false
    }
}

// ATUALIZA UMA MENSAGEM
const setUpdateMessages = async function (mensagem) {
    try {
        const arquivo = mensagem.arquivo && mensagem.arquivo !== '' ? mensagem.arquivo : null;

        let sql = `update tbl_mensagem set
                        comentario = ?,
                        arquivo = ?
                   where id_mensagem = ?`

        let result = await db.raw(sql, [
            mensagem.comentario,
            arquivo,
            mensagem.id_mensagem
        ])

        if (result && result[0] && (result[0].affectedRows > 0 || result[0].warningStatus === 0)) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error("🚨 ERRO NO BANCO AO ATUALIZAR MENSAGEM:", error.message);
        return false
    }
}

// DELETA UMA MENSAGEM E SUAS RESPOSTAS
const setDeleteMessageWithReplies = async function (idMensagem) {
    const transaction = await db.transaction();
    try {
        let sqlCurtidasFilhas = `delete from tbl_curtida 
                                where id_mensagem in (select id_mensagem from tbl_mensagem where id_mensagem_pai = ?)`
        await transaction.raw(sqlCurtidasFilhas, [idMensagem])

        let sqlCurtidasPrincipal = `delete from tbl_curtida where id_mensagem = ?`
        await transaction.raw(sqlCurtidasPrincipal, [idMensagem])

        let sqlFilhas = `delete from tbl_mensagem where id_mensagem_pai = ?`
        await transaction.raw(sqlFilhas, [idMensagem])

        let sqlPrincipal = `delete from tbl_mensagem where id_mensagem = ?`
        let resultPrincipal = await transaction.raw(sqlPrincipal, [idMensagem])

        await transaction.commit();

        if (resultPrincipal && resultPrincipal[0].affectedRows > 0) {
            return true
        }
        return false
    } catch (error) {
        await transaction.rollback();
        return false
    }
}

// DELETA TODAS AS MENSAGENS DE UM CLUBE ESPECÍFICO
const setDeleteAllMessagesByClubId = async function (idClube) {
    const transaction = await db.transaction();
    try {
        let sqlCurtidas = `delete from tbl_curtida where id_mensagem in (select id_mensagem from tbl_mensagem where id_clube = ?)`
        await transaction.raw(sqlCurtidas, [idClube])

        let sqlRespostas = `delete from tbl_mensagem where id_mensagem_pai is not null and id_clube = ?`
        await transaction.raw(sqlRespostas, [idClube])

        let sqlPrincipais = `delete from tbl_mensagem where id_clube = ?`
        await transaction.raw(sqlPrincipais, [idClube])

        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        console.error("🚨 ERRO CRÍTICO AO LIMPAR MENSAGENS DO CLUBE:", error.message)
        return false
    }
}

// DELETA TODAS AS MENSAGENS DE UM USUÁRIO
const setDeleteAllMessagesByUserId = async function (idUsuario) {
    const transaction = await db.transaction();
    try {
        let sqlCurtidasRespostas = `
            delete from tbl_curtida 
            where id_mensagem in (
                select id_mensagem from tbl_mensagem 
                where id_mensagem_pai in (select id_mensagem from tbl_mensagem where id_usuario = ?)
            )`
        await transaction.raw(sqlCurtidasRespostas, [idUsuario])

        let sqlCurtidasPrincipais = `
            delete from tbl_curtida 
            where id_mensagem in (select id_mensagem from tbl_mensagem where id_usuario = ?)`
        await transaction.raw(sqlCurtidasPrincipais, [idUsuario])

        let sqlRespostasDeTerceiros = `
            delete from tbl_mensagem 
            where id_mensagem_pai in (
                select id_mensagem from (select id_mensagem from tbl_mensagem where id_usuario = ?) as tm
            )`
        await transaction.raw(sqlRespostasDeTerceiros, [idUsuario])

        let sqlMensagensDoUsuario = `delete from tbl_mensagem where id_usuario = ?`
        await transaction.raw(sqlMensagensDoUsuario, [idUsuario])

        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        return false
    }
}

module.exports = {
    getSelectAllMessages,
    getSelectByIdMessage,
    getSelectMessagesByIdClub,
    getRepliesByMessageId,
    getMainMessagesByClubId,
    getAllMainMessagesFeed,
    setInsertMessage,
    setUpdateMessages,
    setDeleteAllMessagesByClubId,
    setDeleteAllMessagesByUserId,
    setDeleteMessageWithReplies
}