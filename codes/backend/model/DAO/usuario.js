/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de usuários no Banco de Dados MySQL
 * Projeto: ConectaBook
 * Data: 06/05/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.1 
 *******************************************************************************************/

//CONEXÃO COM O BANCO DE DADOS
const db = require('../../database/connection');
const { setInsertGenresUsers } = require('./genero_usuario');

//RETORNA TODOS OS USUARIOS DO BANCO
const getSelectAllUsers = async function () {
    try {
        let sql = `select * from tbl_usuario;`
        let result = await db.raw(sql)

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    }catch(error){
        return false
    }
}

//RETORNA USUARIO PELO ID DO BANCO
const getSelectByIdUser = async function (id) {
    try {
        let sql = `select * from tbl_usuario where id_usuario = ${id}`
        let result = await db.raw(sql)

        // Retorna o índice 0 (dados)
        if(result && result[0].length > 0)
            return result[0]
        else
            return false
    }catch(error){
        return false
    }
}
const setInsertUser = async function (usuario) {
    try {
        // CORREÇÃO: Usando data_nascimento (com underline) para bater com a Controller/Postman
        const foto = usuario.foto_perfil ? `'${usuario.foto_perfil}'` : "NULL";
        const nascimento = usuario.data_nascimento ? `'${usuario.data_nascimento}'` : "NULL";

        let sql = `insert into tbl_usuario (
                        nome,
                        nome_usuario,
                        email,
                        senha,
                        data_nascimento,
                        foto_perfil
                    ) values (
                        '${usuario.nome}',
                        '${usuario.nome_usuario}',
                        '${usuario.email}',
                        '${usuario.senha}',
                        ${nascimento},
                        ${foto}
                    )`
        
        let result = await db.raw(sql);

        if(result && result[0].affectedRows > 0)
            return result[0].insertId;
        else
            return false;

    } catch(error) {
        console.log("ERRO AO INSERIR:", error.sqlMessage);
        return false;
    }
}

//ATUALIZA UM USUARIO DENTRO DO BANCO
const setUpdateUser = async function (usuario) {
    try {
        let sql = `update tbl_usuario set 
                        nome = '${usuario.nome}',
                        nome_usuario = '${usuario.nome_usuario}',
                        email = '${usuario.email}',
                        senha = '${usuario.senha}',
                        data_nascimento = '${usuario.data_nascimento}',
                        foto_perfil = '${usuario.foto_perfil}'
                    where id_usuario = ${usuario.id}`
        
        let result = await db.raw(sql)

        if(result && result[0].affectedRows > 0)
            return true
        else
            return false

    }catch(error){
        return false
    }
}

//Pega o usuario com base no email dele
const getSelectUserByEmail = async function(email) {
    try {
        let sql = `select * from tbl_usuario where email = '${email}'`;
        let result = await db.raw(sql);

        if (result && result[0].length > 0)
            return result[0];
        else
            return false;
    } catch (error) {
        return false;
    }
}

// DELETA UM USUÁRIO LIMPANDO TODAS AS SUAS CONEXÕES EM CASCATA (INCLUINDO AVALIAÇÕES)
const setDeleteUser = async function (idUsuario) {
    const transaction = await db.transaction();

    try {
        // =========================================================================
        // 1º PASSO: LIMPAR CURTIDAS DO USUÁRIO
        // =========================================================================
        await transaction.raw(`delete from tbl_curtida where id_usuario = ?`, [idUsuario]);

        await transaction.raw(`
            delete from tbl_curtida 
            where id_mensagem in (
                select id_mensagem from tbl_mensagem 
                where id_mensagem_pai in (select id_mensagem from tbl_mensagem where id_usuario = ?)
            )
        `, [idUsuario]);

        await transaction.raw(`
            delete from tbl_curtida 
            where id_mensagem in (select id_mensagem from tbl_mensagem where id_usuario = ?)
        `, [idUsuario]);

        // =========================================================================
        // 2º PASSO: LIMPAR COMENTÁRIOS E RESPOSTAS NOS POSTS DELE
        // =========================================================================
        await transaction.raw(`
            delete from tbl_mensagem 
            where id_mensagem_pai in (
                select id_mensagem from (select id_mensagem from tbl_mensagem where id_usuario = ?) as tm
            )
        `, [idUsuario]);

        await transaction.raw(`delete from tbl_mensagem where id_usuario = ?`, [idUsuario]);

        // =========================================================================
        // 3º PASSO: LIMPAR RELACIONAMENTOS INTERMEDIÁRIOS (NOTIFICAÇÕES, AVALIAÇÕES, ESTANTE, ETC.)
        // =========================================================================
        
        // 1. 🔥 NOVO: Remove todas as notificações vinculadas a este usuário
        // (Garante que limpa tanto as que ele recebeu quanto as que ele gerou, dependendo de como modelaram a FK)
        // Se a sua tabela tiver apenas a coluna 'id_usuario', use a linha abaixo:
        await transaction.raw(`delete from tbl_notificacao where id_usuario = ?`, [idUsuario]);
        
        // Se na sua tabela de notificação tiver quem recebeu E quem enviou (ex: id_usuario_remetente / id_usuario_destino), descomente e use:
        // await transaction.raw(`delete from tbl_notificacao where id_usuario_remetente = ? or id_usuario_destino = ?`, [idUsuario, idUsuario]);

        // 2. Apaga primeiro da tbl_avaliacao_livro onde a avaliação pertence ao usuário
        await transaction.raw(`
            delete from tbl_avaliacao_livro 
            where id_avaliacao in (
                select id_avaliacao from (
                    select id_avaliacao from tbl_avaliacao where id_usuario = ?
                ) as temp_livro
            )
        `, [idUsuario]);

        // 3. Apaga da tbl_avaliacao_cafeteria onde a avaliação pertence ao usuário
        await transaction.raw(`
            delete from tbl_avaliacao_cafeteria 
            where id_avaliacao in (
                select id_avaliacao from (
                    select id_avaliacao from tbl_avaliacao where id_usuario = ?
                ) as temp_cafeteria
            )
        `, [idUsuario]);

        // 4. Agora que as duas tabelas intermediárias liberaram as chaves, apaga da tbl_avaliacao de fato
        await transaction.raw(`delete from tbl_avaliacao where id_usuario = ?`, [idUsuario]);

        // 5. Remove o histórico de acessos aos livros desse usuário
        await transaction.raw(`delete from tbl_acesso_livro where id_usuario = ?`, [idUsuario]);

        // 6. Remove os livros salvos na estante desse usuário
        await transaction.raw(`delete from tbl_estante where id_usuario = ?`, [idUsuario]);

        // 7. Remove o vínculo do usuário com seus gêneros literários favoritos
        await transaction.raw(`delete from tbl_genero_usuario where id_usuario = ?`, [idUsuario]);

        // 8. Remove o usuário de todos os clubes onde ele faz parte
        await transaction.raw(`delete from tbl_membros where id_usuario = ?`, [idUsuario]);

        // =========================================================================
        // 4º PASSO: EXCLUSÃO DO PERFIL DO USUÁRIO
        // =========================================================================
        let result = await transaction.raw(`delete from tbl_usuario where id_usuario = ?`, [idUsuario]);

        // Confirma e aplica todas as deleções juntas de forma segura
        await transaction.commit();

        if (result && result[0].affectedRows > 0) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        // Se qualquer uma das tabelas falhar ou não for encontrada, desfaz o lote inteiro
        await transaction.rollback();
        console.error("🚨 ERRO CRÍTICO AO DELETAR USUÁRIO EM CASCATA:", error.message);
        return false;
    }
}

module.exports = {
    getSelectAllUsers,
    getSelectByIdUser,
    setInsertUser,
    getSelectUserByEmail,
    setUpdateUser,
    setDeleteUser
}