/*******************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação da camada de usuários no Banco de Dados MySQL
 * Projeto: ConectaBook
 * Data: 07/05/2026
 * Autor: Geovanna Silva
 * Autor: Alex Henrique Da Cruz Gomes 
 * Versão: 1.3
 *******************************************************************************************/

const usuarioDAO = require('../../model/DAO/usuario.js')
const bcrypt = require('bcrypt')
const jwtService = require('../../jwt/jwt_service.js') 
const messages = require('../modulo/config_messages.js')
const emailService = require('../auth/enviar_email.js') 

// ETAPA 1: Envia o código de 6 dígitos no e-mail e retorna o token de validação para o Front-end
const solicitarRecuperacaoSenha = async function(dados, contentType) {
    try {
        if (!String(contentType).toLowerCase().includes('application/json')) {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (!dados.email) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        // Verifica se o e-mail existe no banco
        let dadosUsuario = await usuarioDAO.getSelectUserByEmail(dados.email);

        if (dadosUsuario && dadosUsuario.length > 0) {
            const usuarioBanco = dadosUsuario[0];

            //  GERAÇÃO DO CÓDIGO: Cria um número aleatório de 6 dígitos (ex: 482915)
            const codigoRecuperacao = Math.floor(100000 + Math.random() * 900000).toString();

            //  SEGURANÇA: Colocamos o ID do usuário E o código gerado guardados dentro do JWT de 15 minutos
            const tokenRecuperacao = jwtService.getRecoveryToken({ 
                id: usuarioBanco.id_usuario,
                codigo: codigoRecuperacao 
            });

            //  DISPARO: Altera o texto enviado para a Azure focar no código numérico puro, como pede a sua tela
            let emailEnviado = await emailService.enviarEmailRecuperacao(usuarioBanco.email, codigoRecuperacao);

            if (emailEnviado) {
                let responseData = Object.assign({}, messages.HEADER);
                responseData.status = messages.SUCCESS_REQUEST.status;
                responseData.status_code = messages.SUCCESS_REQUEST.status_code;
                responseData.message = "E-mail com o código de recuperação enviado com sucesso!";
                
                // 🔥 IMPORTANTE: Retornamos o token para o Front-end. 
                // O seu Front-end deve guardar esse token na memória para usar nos próximos passos de validação e redefinição.
                responseData.token_validacao = tokenRecuperacao; 
                
                return responseData;
            } else {
                return messages.ERROR_INTERNAL_SERVER_MODEL; // Falha no disparo do email (Azure)
            }
        } else {
            return messages.ERROR_NOT_FOUND; // E-mail não cadastrado
        }
    } catch (error) {
        console.error("Erro na controller solicitarRecuperacaoSenha:", error);
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// ETAPA 2: Valida se o código numérico digitado pelo usuário bate com o código gerado no JWT
const validarCodigoRecuperacao = async function(dados, contentType) {
    try {
        if (!String(contentType).toLowerCase().includes('application/json')) {
            return messages.ERROR_CONTENT_TYPE;
        }

        // Valida campos obrigatórios: o código digitado e o token guardado pelo Front
        if (!dados.token || !dados.codigo) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        const jwt = require('jsonwebtoken');

        try {
            // Abre o token enviado pelo Front-end e lê o payload criptografado
            const decoded = jwt.verify(dados.token, process.env.JWT_SECRET);

            // Compara o código que o usuário digitou na tela com o código do token
            if (String(decoded.codigo) === String(dados.codigo)) {
                let responseData = Object.assign({}, messages.HEADER);
                responseData.status = messages.SUCCESS_REQUEST.status;
                responseData.status_code = messages.SUCCESS_REQUEST.status_code;
                responseData.message = "Código validado com sucesso! Prossiga para a nova senha.";
                return responseData;
            } else {
                return { 
                    status_code: 400, 
                    message: "Código de verificação incorreto! Verifique o e-mail." 
                };
            }

        } catch (err) {
            // Cai aqui se o token passou de 15 minutos ou se foi adulterado
            return { 
                status_code: 401, 
                message: "O código de recuperação expirou ou é inválido! Solicite um novo." 
            };
        }
    } catch (error) {
        console.error("Erro na controller validarCodigoRecuperacao:", error);
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

// ETAPA 3: Salva a nova senha no banco de dados (Ação do botão "Entrar" da segunda tela)
const redefinirSenha = async function(dados, contentType) {
    try {
        if (!String(contentType).toLowerCase().includes('application/json')) {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (!dados.token || !dados.nova_senha) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        const jwt = require('jsonwebtoken');
        let idUsuario = null;

        // Abre novamente o token para capturar o ID do usuário com segurança
        try {
            const decoded = jwt.verify(dados.token, process.env.JWT_SECRET);
            idUsuario = decoded.id;
        } catch (err) {
            return { status_code: 401, message: "Sua sessão de redefinição expirou. Recomece o processo." };
        }

        // Busca o usuário no banco pelo ID extraído do token
        let dadosUsuario = await usuarioDAO.getSelectByIdUser(idUsuario);

        if (dadosUsuario && dadosUsuario.length > 0) {
            const usuarioBanco = dadosUsuario[0];

            // Criptografa a nova senha com bcrypt antes de salvar
            const novaSenhaCriptografada = await bcrypt.hash(dados.nova_senha, 10);

            // Monta o objeto mantendo os dados antigos e inserindo a nova senha criptografada
            const usuarioAtualizado = {
                id: usuarioBanco.id_usuario,
                nome: usuarioBanco.nome,
                nome_usuario: usuarioBanco.nome_usuario,
                email: usuarioBanco.email,
                senha: novaSenhaCriptografada,
                data_nascimento: usuarioBanco.data_nascimento,
                foto_perfil: usuarioBanco.foto_perfil
            };

            // Executa o UPDATE no Banco de Dados
            let atualizou = await usuarioDAO.setUpdateUser(usuarioAtualizado);

            if (atualizou) {
                let responseData = Object.assign({}, messages.HEADER);
                responseData.status = messages.SUCCESS_UPDATED_ITEM.status;
                responseData.status_code = messages.SUCCESS_UPDATED_ITEM.status_code;
                responseData.message = "Senha redefinida com sucesso! Pode fazer o login.";
                return responseData;
            } else {
                return messages.ERROR_INTERNAL_SERVER_MODEL;
            }
        } else {
            return messages.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.error("Erro na controller redefinirSenha:", error);
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

const validarLogin = async function(dadosLogin, contentType) {
    try {
       
        if (String(contentType).toLowerCase() !== 'application/json') {
            return messages.ERROR_CONTENT_TYPE;
        }

        if (!dadosLogin.email || !dadosLogin.senha) {
            return messages.ERROR_REQUIRED_FIELDS;
        }

        // Busca o usuário no banco pelo e-mail
        let dadosUsuario = await usuarioDAO.getSelectUserByEmail(dadosLogin.email);

        if (dadosUsuario && dadosUsuario.length > 0) {
            
            const usuarioBanco = dadosUsuario[0];

            // Compara a senha digitada com a criptografada
            let senhaMatch = await bcrypt.compare(dadosLogin.senha, usuarioBanco.senha);

            if (senhaMatch) {
                // Gera o token usando o serviço externo
                // Passa apenas os dados essenciais para o payload
                const token = jwtService.getToken({ 
                    id: usuarioBanco.id_usuario, 
                    email: usuarioBanco.email 
                });

                //  Monta o objeto de sucesso
                let responseData = Object.assign({}, messages.HEADER);
                responseData.status = messages.SUCCESS_REQUEST.status;
                responseData.status_code = messages.SUCCESS_REQUEST.status_code;
                
                responseData.user = {
                    id: usuarioBanco.id_usuario,
                    nome: usuarioBanco.nome,
                    nome_usuario: usuarioBanco.nome_usuario,
                    email: usuarioBanco.email,
                    foto_perfil: usuarioBanco.foto_perfil,
                    token: token // Token gerado pelo serviço
                };

                return responseData;
            } else {
                return messages.ERROR_INVALID_USER; // Senha incorreta
            }
        } else {
            return messages.ERROR_NOT_FOUND; // E-mail não encontrado
        }

    } catch (error) {
        console.error(error);
        return messages.ERROR_INTERNAL_SERVER_CONTROLLER;
    }
}

module.exports = { 
    validarLogin,
    solicitarRecuperacaoSenha,
    validarCodigoRecuperacao,
    redefinirSenha
}