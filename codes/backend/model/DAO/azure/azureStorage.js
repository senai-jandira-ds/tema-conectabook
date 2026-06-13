const azureBlob = require('@azure/storage-blob');
const path = require('path');

const CONTAINER_NAME = "arquivos-mensagens";

/**
 * Função responsável por enviar um arquivo para a nuvem da Azure
 * @param {Object} file - O arquivo vindo do req.file (Multer)
 * @param {String} pastaVirtual - Nome da "pasta" dentro da Azure (ex: 'arquivos_mensagens')
 */
const uploadFileToAzure = async (file, pastaVirtual) => {
    try {
        // CORREÇÃO: Puxa e inicializa a conexão da Azure apenas no momento do upload
        // Isso garante que o .env já foi lido e carregado pelo Node.js
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

        if (!connectionString) {
            throw new Error("A variável de ambiente AZURE_STORAGE_CONNECTION_STRING não foi carregada corretamente.");
        }

        const blobServiceClient = azureBlob.BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

        // Cria um nome único usando timestamp para evitar arquivos duplicados
        const nomeUnico = `${pastaVirtual}/${Date.now()}${path.extname(file.originalname)}`;

        // Cria a referência do local do arquivo no servidor da Azure
        const blockBlobClient = containerClient.getBlockBlobClient(nomeUnico);

        // Faz o upload dos dados brutos que estão na memória RAM
        await blockBlobClient.upload(file.buffer, file.buffer.length, {
            blobHTTPHeaders: { blobContentType: file.mimetype } // Define se é imagem, pdf, etc.
        });

        // Retorna o link web definitivo (URL Pública)
        return blockBlobClient.url;
    } catch (error) {
        console.error("🚨 Falha no upload para a Azure Blob:", error.message);
        throw error;
    }
};

module.exports = { uploadFileToAzure };