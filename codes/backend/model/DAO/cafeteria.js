/*******************************************************************************************
 * Objetivo: Arquivo responsável pela realização do CRUD de cafeteria no Banco de Dados MySQL
 * Projeto: ConectaBook
 * Data: 07/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.1 
 *******************************************************************************************/

//CONEXÃO COM O BANCO DE DADOS
const db = require('../../database/connection')


//RETORNA TODAS AS CAFETERIAS DO BANCO
const getSelectAllCoffeeShops = async function () {
    try {
        let sql = `select * from tbl_cafeteria`
        let result = await db.raw(sql)

        if (result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch(error){
        return false
    }
    
}


//RETORNA CAFETERIA PELO ID DO BANCO
const getSelectByIdCoffeeShop = async function (id) {
    try {
        let sql = `select * from tbl_cafeteria where id_cafeteria = ${id}`
        let result = await db.raw(sql)

        // Retorna o índice 0
        if(result && result[0].length > 0)
            return result[0]
        else
            return false
    } catch(error) {
        return false
    }
    
}

// INSERE UMA CAFETERIA NO BANCO
const setInsertCoffeeShop = async function (cafeteria) {
    try{
        let sql =  `insert into tbl_cafeteria(
                            nome,
                            endereco,
                            horario_funcionamento,
                            rede_social,
                            foto
                        ) values (
                         '${cafeteria.nome}',
                         '${cafeteria.endereco}',
                         '${cafeteria.horario_funcionamento}',
                         '${cafeteria.rede_social}',
                         '${cafeteria.foto}'
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


// ATUALIZA UMA CAFETERIA DENTRO DO BANCO
const setUpdateCoffeeShop = async function (cafeteria) {
    try {
        let sql = `update tbl_cafeteria set
                        nome = '${cafeteria.nome}',
                        endereco = '${cafeteria.endereco}',
                        horario_funcionamento = '${cafeteria.horario_funcionamento}',
                        rede_social = '${cafeteria.rede_social}',
                        foto = '${cafeteria.foto}'
                    where id_cafeteria = ${cafeteria.id}`
  
        let result = await db.raw(sql)

        if(result && result[0].affectedRows > 0)
            return true
        else
            return false

    }catch(error){
        return false
    }
    
}

// DELETA UMA CAFETERIA DENTRO DO BANCO
const setDeleteCoffeeShop = async function (id) {
    try {
        let sql = `delete from tbl_cafeteria where id_cafeteria = ${id}`
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
    getSelectAllCoffeeShops,
    getSelectByIdCoffeeShop,
    setInsertCoffeeShop,
    setUpdateCoffeeShop,
    setDeleteCoffeeShop
}