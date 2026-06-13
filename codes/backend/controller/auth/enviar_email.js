/*******************************************************************************************
 * Objetivo: Arquivo responsável por integrar o serviço de e-mails da Azure Communication Services
 * Projeto: ConectaBook
 * Data: 27/05/2026
 * Autor: Alex Gomes
 * Versão: 1.0
 *******************************************************************************************/

const { EmailClient } = require("@azure/communication-email");
require('dotenv').config()

// A sua Connection String deve ser guardada no arquivo .env
const connectionString = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
const client = new EmailClient(connectionString);

const enviarEmailRecuperacao = async function (emailUsuario, codigoRecuperacao) {
    try {
        const emailMessage = {
            senderAddress: process.env.AZURE_EMAIL_REMETENTE,
            content: {
                subject: "ConectaBook - Código de Recuperação",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; text-align: center;">
                        <h2 style="color: #333;">Recuperação de Senha - ConectaBook</h2>
                        <p style="text-align: left;">Olá,</p>
                        <p style="text-align: left;">Recebemos uma solicitação para redefinir a senha da sua conta no ConectaBook. Utilize o código de verificação abaixo para prosseguir no aplicativo. Este código é válido por 15 minutos:</p>
                        
                        <div style="margin: 30px auto; background-color: #F3F4F6; border: 2px dashed #4F46E5; width: 200px; padding: 15px; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; border-radius: 8px;">
                            ${codigoRecuperacao}
                        </div>
                        
                        <p style="font-size: 12px; color: #666; text-align: left;">Se você não solicitou a alteração de senha, ignore este e-mail com segurança.</p>
                    </div>
                `,
            },
            recipients: {
                to: [{ address: emailUsuario }],
            },
        };

        const poller = await client.beginSend(emailMessage);
        const result = await poller.pollUntilDone();
        
        return result.status === "Succeeded";
    } catch (error) {
        console.error("Erro ao enviar e-mail via Azure:", error);
        return false;
    }
};

module.exports = {
    enviarEmailRecuperacao
};