/*******************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação da camada model de Cafeterias (Controller)
 * Projeto: ConectaBook
 * Data: 08/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.1
 *******************************************************************************************/

const cafeteriaDAO = require('../../model/DAO/cafeteria.js');
const messages = require('../modulo/config_messages.js');

// GET - Listar todas as cafeterias
const listarCafeteria = async function () {
    try {
        let result = await cafeteriaDAO.getSelectAllCoffeeShops();

        if(result){
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            responseData.response = result;
            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    }  catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
    
}


// GET - Listar cafeteria pelo ID
const listarCafeteriaID = async function (id) {

    if (id == '' || id == undefined || isNaN(id) ) {
        return messages.ERROR_REQUIRED_FIELDS
    }


    try {
        let result = await cafeteriaDAO.getSelectByIdCoffeeShop(id);

        if(result) {
            let responseData = Object.assign({}, messages.HEADER);
            responseData.status = messages.SUCCESS_REQUEST.status;
            responseData.status_code = messages.SUCCESS_REQUEST.status_code;
            responseData.response = result[0];

            return responseData;
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
    
}



// POST - Criar cafeteria
const criarCafeteria = async function (cafeteria, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }


        if(cafeteria.nome == '' || cafeteria.nome == undefined ||
           cafeteria.endereco == '' || cafeteria.endereco == undefined ||
           cafeteria.horario_funcionamento == '' || cafeteria.horario_funcionamento == undefined ||
           cafeteria.rede_social == '' || cafeteria.rede_social == undefined ||
           cafeteria.foto == '' || cafeteria.foto == undefined
        ) {
            return messages.ERROR_REQUIRED_FIELDS;
        } else {

            let result = await cafeteriaDAO.setInsertCoffeeShop(cafeteria);

            if(result) {
                let responseData = Object.assign({}, messages.HEADER);
                responseData.status = messages.SUCCESS_CREATED_ITEM.status;
                responseData.status_code = messages.SUCCESS_CREATED_ITEM.status_code;
                responseData.message = messages.SUCCESS_CREATED_ITEM.message;

                responseData.cafeteria_criada = {
                    id: result
                };

                return responseData;
            } else {
                return messages.ERROR_INTERNAL_SERVER_MODEL;
            }
        }
    } catch (error) {
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
    
}

// PUT - Atualizar cafeteria 
const atualizarCafeteria =  async function (cafeteria, contentType, id) {
    try {
        if (id == '' || id == undefined || isNaN(id)) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        if(String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

       if (
           cafeteria.nome == '' || cafeteria.nome == undefined ||
           cafeteria.endereco == '' || cafeteria.endereco == undefined ||
           cafeteria.horario_funcionamento == '' || cafeteria.horario_funcionamento == undefined ||
           cafeteria.rede_social == '' || cafeteria.rede_social == undefined ||
           cafeteria.foto == '' || cafeteria.foto == undefined
       ) {
             return messages.ERROR_REQUIRED_FIELDS;
        } else {

        let buscarId = await cafeteriaDAO.getSelectByIdCoffeeShop(id);

        if(buscarId) {

            cafeteria.id = id;
            let result = await cafeteriaDAO.setUpdateCoffeeShop(cafeteria);
        
             if (result) {
                    let responseData = Object.assign({}, messages.HEADER);
                    responseData.status = messages.SUCCESS_UPDATED_ITEM.status;
                    responseData.status_code = messages.SUCCESS_UPDATED_ITEM.status_code;
                    responseData.response = messages.SUCCESS_UPDATED_ITEM.message;
                    return responseData;           
                } else {
                    return messages.ERROR_INTERNAL_SERVER_MODEL;
                }
            } else {
                return messages.ERROR_NOT_FOUND;
            }
         }
      } catch (error) {
            return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
      }

}


// DELETE - Excluir a cafeteria
const excluirCafeteria = async function (id) {
    if (id == '' || id == undefined || isNaN(id)) {
            return messages.ERROR_REQUIRED_FIELDS;
    }

    try {
        let buscarId = await cafeteriaDAO.getSelectByIdCoffeeShop(id)

        if(buscarId) {
            
            let result = await cafeteriaDAO.setDeleteCoffeeShop(id)

            if(result) {
              let responseData = Object.assign({}, messages.HEADER);
               responseData.status = messages.SUCCESS_DELETE_ITEM.status;
               responseData.status_code = messages.SUCCESS_DELETE_ITEM.status_code;
               responseData.response = messages.SUCCESS_DELETE_ITEM.message;
                return responseData;
            } else {
                    return messages.ERROR_INTERNAL_SERVER_MODEL;
             }
        } else {
                    return messages.ERROR_NOT_FOUND;
             }
     } catch (error) {
                return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
 }


 module.exports = {
    listarCafeteria,
    listarCafeteriaID,
    criarCafeteria,
    atualizarCafeteria,
    excluirCafeteria
 }