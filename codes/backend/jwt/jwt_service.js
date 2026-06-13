/********************************************************************************
 * Objetivo: Arquivo responsável pela criação e uso de json web token  
 * Projeto: Conectabook
 * Data: 18/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.1
 ********************************************************************************/

const jwt = require('jsonwebtoken')
require('dotenv').config()

// Gera o token 
const getToken = (usuario) => {
    return jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '24h' })
}

const getRecoveryToken = (usuario) => {
    return jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '15m'})
}

// decodifica o conteúdo 
const getDecodedToken = (token) => {
    return jwt.decode(token)
}

const verificarToken = function(request, response, next) {
    const authHeader = request.headers['authorization']
    
    if (!authHeader) {
        return response.status(401).json({
            message: 'Acesso negado: autorização ausente'
        })
    }

    const token = authHeader.split(' ')[1]

    try {
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                return response.status(403).json({
                    message: 'Token inválido ou expirado'
                })
            }

            // Se o token for válido, anexa os dados no objeto request
            request.user = decoded
            next()
        })
    } catch (error) {
        
        return response.status(500).json({
            message: 'Erro interno no servidor ao validar o token'
        })
    }
}

module.exports = {
    getToken,
    getDecodedToken,
    getRecoveryToken,
    verificarToken
}