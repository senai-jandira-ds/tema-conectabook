/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de membros do clube no Banco de Dados MySQL
 * Projeto: ConectaBook
 * Data: 06/05/2026
 * Autor: Alex Henrique Da Cruz Gomes
 * Versão: 1.0
 *******************************************************************************************/
const db = require('../../database/connection')

//RETORNA TODOS OS MEMBROS DE TODOS OS GRUPOS DO BANCO
const getSelectAllMembersClubs = async function () {
    try {
        let sql = `select * from tbl_membros order by id_membros`

        let result = await db.raw(sql)

        if(result && result[0].length > 0){
            return result[0]
        }else{
            return false   
        }

    }catch(error){
        return false
    }
}

//RETORNA MEMBROS PELO ID
const getSelectByIdMember = async function (id) {
    try {
        let sql = `select * from tbl_membros where id_membros = ${id}`

        let result = await db.raw(sql)

        if(result && result[0].length > 0){
            return result[0]
        }else{
            return false
        }

    }catch(error){
        return false
    }
}

// RETORNA SE O USUARIO JA PARTICIPA DO CLUBE
const getSelectMemberByUserAndClub = async function (idUsuario, idClube) {
    try {
        let sql = `
            select * from tbl_membros
            where id_usuario = ${idUsuario}
            and id_clube = ${idClube}
        `

        let result = await db.raw(sql)

        if (result && result[0].length > 0) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// RETORNAR USUÁRIOS QUE PARTICIPAM DE UM CLUBE ESPECÍFICO
const getSelectUsersByIdClub = async function (idClube) {
    try {
        let sql = `
            select 
                tbl_membros.id_membros,
                tbl_usuario.id_usuario as id_usuario,
                tbl_usuario.nome_usuario,
                tbl_usuario.foto_perfil,
                tbl_membros.administrador, 
                tbl_clube.nome as nome_clube
            from tbl_membros
                inner join tbl_usuario
                    on tbl_usuario.id_usuario = tbl_membros.id_usuario
                inner join tbl_clube
                    on tbl_clube.id_clube = tbl_membros.id_clube
            where tbl_membros.id_clube = ${idClube}
            order by tbl_membros.administrador desc, tbl_usuario.nome asc`; 

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

//RETORNA OS CLUBES QUE O USUARIO PARTICIPA
const getSelectClubsThatUserParticipateByIdUser = async function (idUsuario) {
    try {
        let sql = `
            
select 
    tbl_clube.id_clube, 
    tbl_clube.nome, 
    tbl_clube.foto,
    tbl_clube.sobre,
    tbl_genero.nome as genero,
    (
        select count(*) 
        from tbl_membros 
        where tbl_membros.id_clube = tbl_clube.id_clube
    ) as membros
from tbl_clube

    inner join tbl_genero
    on tbl_clube.id_genero = tbl_genero.id_genero

    inner join tbl_membros
        on tbl_clube.id_clube = tbl_membros.id_clube
	where tbl_membros.id_usuario = ${idUsuario}
	and tbl_membros.administrador = 0
            `; 

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

//RETORNA OS CLUBES QUE O USUARIO ADMINISTRA
const getSelectClubsAdminByUser = async function (idUsuario) {
    try {
        let sql = `
            select 
                tbl_clube.id_clube, 
                tbl_clube.nome, 
                tbl_clube.foto,
                tbl_clube.sobre,
                tbl_genero.nome as genero,
                tbl_membros.administrador,

                (
        select count(*) 
        from tbl_membros 
        where tbl_membros.id_clube = tbl_clube.id_clube
    ) as membros 

            from tbl_clube

                inner join tbl_genero
                    on tbl_clube.id_genero = tbl_genero.id_genero

                inner join tbl_membros
                    on tbl_clube.id_clube = tbl_membros.id_clube
            where tbl_membros.id_usuario = ${idUsuario} 
              and tbl_membros.administrador = 1`; 

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

//INSERE UM NOVO RELACIONAMENTO
const setInsertMembers = async function (membros) {
    try {
        let sql = `insert into tbl_membros (
                        administrador,
                        id_usuario,
                        id_clube
                    ) values (
                        '${membros.administrador}',
                        '${membros.id_usuario}',
                        '${membros.id_clube}'
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

//ATUALIZA UM RELACIONAMENTO
const setUpdateMembers = async function (membros) {
    try {
        let sql = `update tbl_membros set 
                        administrador = ${membros.administrador},
                        id_usuario = ${membros.id_usuario},
                        id_clube = ${membros.id_clube}
                    where id_membros = ${membros.id_membros}`
        
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
const setDeleteMembers = async function (id) {
    try {
        let sql = `delete from tbl_membros where id_membros = ${id}`
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
const setDeleteMembersByClubeId = async function (id) {
    try {
        let sql = `delete from tbl_membros where id_clube = ${id}`
        let result = await db.raw(sql)

        if(result && result[0].affectedRows > 0)
            return true
        else
            return false

    } catch(error) {
        return false
    }
}


module.exports = {
    getSelectAllMembersClubs,
    getSelectByIdMember,
    getSelectMemberByUserAndClub,
    getSelectClubsAdminByUser,
    getSelectClubsThatUserParticipateByIdUser,
    getSelectUsersByIdClub,
    setInsertMembers,
    setUpdateMembers,
    setDeleteMembers,
    setDeleteMembersByClubeId
}