/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de clubes no Banco de Dados MySQL
 * Projeto: ConectaBook
 * Data: 06/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.1 (Ajustado para retornar apenas o índice [0])
 *******************************************************************************************/

// CONEXÃO COM O BANCO DE DADOS
const db = require('../../database/connection')

// RETORNA TODOS OS CLUBES
const getSelectAllClubs = async function () {
    try {
        // Usamos LEFT JOIN para garantir que clubes com 0 membros também apareçam
        // O GROUP BY é essencial para que o COUNT funcione por clube
        let sql = `
            select 
                tbl_clube.id_clube, 
                tbl_clube.nome, 
                tbl_clube.foto, 
                tbl_clube.sobre, 
                tbl_genero.nome as genero,
                count(tbl_membros.id_usuario) as total_membros
            from tbl_clube
                left join tbl_genero 
                    on tbl_genero.id_genero = tbl_clube.id_genero
                left join tbl_membros 
                    on tbl_clube.id_clube = tbl_membros.id_clube
            group by tbl_clube.id_clube
            order by tbl_clube.id_clube asc`;

        let result = await db.raw(sql);

        if (result && result[0].length > 0)
            return result[0];
        else
            return false;

    } catch (error) {
        console.log(error);
        return false;
    }
}

// RETORNA CLUBE PELO ID
const getSelectByIdClub = async function (id) {
    try {
        let sql = `select * from tbl_clube where id_clube = ${id}`
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

// RETORNA CLUBE PELO ID DO GENERO
const getSelectClubsByGeneroID = async function (idGenero) {
    try {
        let sql = `
            select 
                tbl_clube.id_clube, 
                tbl_clube.nome, 
                tbl_clube.foto, 
                tbl_clube.sobre, 
                tbl_genero.nome as genero,
                count(tbl_membros.id_usuario) as total_membros
            from tbl_clube
                inner join tbl_genero 
                    on tbl_genero.id_genero = tbl_clube.id_genero
                left join tbl_membros 
                    on tbl_clube.id_clube = tbl_membros.id_clube
            where tbl_clube.id_genero = ?
            group by tbl_clube.id_clube
            order by tbl_clube.nome asc`;

        let result = await db.raw(sql, [idGenero]);

        if (result && result[0].length > 0)
            return result[0];
        else
            return false;

    } catch (error) {
        console.log(error);
        return false;
    }
}

// INSERE UM CLUBE NO BANCO
const setInsertClub = async function (clube) {
    try {
        const foto = clube.foto && clube.foto !== '' ? clube.foto : null;

        let sql = `insert into tbl_clube (
                        nome,
                        sobre,
                        regras,
                        foto,
                        id_genero
                        ) values (
                        '${clube.nome}',
                        '${clube.sobre}',
                        '${clube.regras}',
                        '${foto}',
                        ${clube.id_genero}
                        )`

        console.log(sql)

        let result = await db.raw(sql)

        // Verifica se a linha foi afetada no índice 0
        if (result && result[0].affectedRows > 0) {
            return result[0].insertId
        } else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

// ATUALIZA UM CLUBE NO BANCO
// ATUALIZA UM CLUBE NO BANCO
const setUpdateClub = async function (clube) {
    try {
        // CORRIGIDO: Se tiver foto, colocamos as aspas aqui. Se não, deixamos NULL sem aspas.
        const fotoValida = clube.foto ? `'${clube.foto}'` : "NULL";

        // CORRIGIDO: Removemos as aspas simples de '${foto}' na query abaixo,
        // deixando apenas ${fotoValida}, pois ela já vem com as aspas certas do ternário.
        let sql = `update tbl_clube set 
                    nome = '${clube.nome}',
                    sobre = '${clube.sobre}',
                    regras = '${clube.regras}',
                    foto = ${fotoValida},
                    id_genero = '${clube.id_genero}'
                Where id_clube = ${clube.id} `

        let result = await db.raw(sql)

        // Se você estiver usando o MySQL puro via Knex (db.raw)
        // o affectedRows costuma vir direto no primeiro objeto do resultado
        if (result && (result[0].affectedRows > 0 || result.affectedRows > 0))
            return true
        else
            return false
    } catch (error) {
        console.error("🚨 Erro SQL na Model do Clube:", error); // Adicionado para te ajudar a debugar se der outro erro
        return false
    }
}

// DELETA UM CLUBE NO BANCO
const setDeleteClub = async function (id) {
    try {
        // 1. Remove as curtidas das mensagens do clube
        await db.raw(`
            delete from tbl_curtida 
            where id_mensagem in (
                select id_mensagem from tbl_mensagem where id_clube = ${id}
            )
        `)

        // 2. Remove as mensagens do clube
        await db.raw(`delete from tbl_mensagem where id_clube = ${id}`)

        // 3. Remove os membros do clube
        await db.raw(`delete from tbl_membros where id_clube = ${id}`)

        // 4. Deleta o clube
        let result = await db.raw(`delete from tbl_clube where id_clube = ${id}`)

        if (result && result[0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        console.error("🚨 Erro ao deletar clube:", error.message);
        return false;
    }
}

module.exports = {
    getSelectAllClubs,
    getSelectByIdClub,
    getSelectClubsByGeneroID,
    setInsertClub,
    setUpdateClub,
    setDeleteClub
}