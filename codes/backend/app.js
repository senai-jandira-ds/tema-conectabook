/*******************************************************************************************
 * Objetivo: Arquivo responsável pelas requisições da API
 * Projeto: ConectaBook
 * Data: 06/05/2026
 * Autor: Alex Henrique Da Cruz Gomes / Geovanna Silva
 * Versão: 1.2
 *******************************************************************************************/





const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);  

console.log("Versão do Socket.IO:", require("socket.io/package.json").version);

// =========================================================================
// 1. MIDDLEWARES GLOBAIS DO EXPRESS (Devem vir ANTES de tudo para proteger/filtrar)
// =========================================================================
app.use(cors()); // 💡 CORS do Express DEVE ser o primeiro para não barrar requisições HTTP locais
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// 💡 SEU LOG DE DIAGNÓSTICO: Agora ele captura TUDO, pois está no topo!
app.use((req, res, next) => {
    if (req.url.includes('socket.io')) {
        console.log(`📥 Uma requisição do Socket chegou no Express! URL: ${req.url}`);
    }
    next();
});

// =========================================================================
// 2. CONFIGURAÇÃO DO SOCKET.IO (Acoplado ao servidor HTTP)
// =========================================================================
const io = new Server(server, {
    // 💡 IMPORTANTE: Se sua API inteira usa o prefixo /v1/conectaBook,
    // o Socket.io precisa escutar neste mesmo caminho, senão dá 404.
    path: '/v1/conectaBook/mensagem/socket.io',
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    },
    allowEIO3: true, 
    transports: ['polling', 'websocket'] 
});

// Inicializa os seus módulos de socket externos
require('./socket/socketServer.js')(io);

// Teste rápido nativo
io.on('connection', (socket) => {
    console.log(`✅ Postman ou usuário conectou via Socket! ID: ${socket.id}`);
});



const usuarioRoutes = require('./routes/usuarioRoutes.js')
app.use('/v1/conectaBook/usuarios', usuarioRoutes)

const generoRoutes = require('./routes/generoRoutes.js')
app.use('/v1/conectaBook/generos', generoRoutes)

const generoUsuarioRoutes = require('./routes/genero_usuarioRoutes.js')
app.use('/v1/conectaBook/genero-usuario', generoUsuarioRoutes)

const generoLivroRoutes = require('./routes/genero_livroRoutes.js')
app.use('/v1/conectaBook/genero-livro', generoLivroRoutes)

const authRoutes = require('./routes/auth_routes.js')
app.use('/v1/conectaBook/auth', authRoutes)

const estanteRoutes = require('./routes/estanteRoutes.js')
app.use('/v1/conectaBook/estante', estanteRoutes)
const clubeRoutes = require('./routes/clubeRoutes.js')
app.use('/v1/conectaBook/clubes', clubeRoutes)

const cafeteriaRoutes = require('./routes/cafeteriaRoutes.js')
app.use('/v1/conectaBook/cafeterias', cafeteriaRoutes)

const membrosRoutes = require('./routes/membrosRoutes.js')
app.use('/v1/conectaBook/membros', membrosRoutes)

const livrosRoutes = require('./routes/livroRoutes.js')
app.use('/v1/conectaBook/livros', livrosRoutes)

const acessoLivroRoutes = require('./routes/acessoRoutes.js')
app.use('/v1/conectaBook/livro-acesso', acessoLivroRoutes)

const mensagemRoutes = require('./routes/mensagemRoutes.js')(io)
app.use('/v1/conectaBook/mensagem', mensagemRoutes)

const curtidasRoutes = require('./routes/curtidaRoutes.js')
app.use('/v1/conectaBook/curtida', curtidasRoutes)

const avaliacaoRoutes = require('./routes/avaliacaoRoutes.js')
app.use('/v1/conectaBook/avaliacao', avaliacaoRoutes);

const avaliacaoLivroRoutes = require('./routes/avaliacao_livroRoutes.js')
app.use('/v1/conectaBook/avaliacao-livro', avaliacaoLivroRoutes);

const avaliacaoCafeteriaRoutes = require('./routes/avaliacao_cafeteriaRoutes.js')
app.use('/v1/conectaBook/avaliacao-cafeteria', avaliacaoCafeteriaRoutes);

const notificacaoRoutes = require('./routes/notificacaoRoutes.js')
app.use('/v1/conectaBook/notificacao', notificacaoRoutes)

const statusLivroRoutes = require('./routes/status_livroRoutes.js')
app.use('/v1/conectaBook/statusLivro', statusLivroRoutes)

const PORT = process.env.PORT || 8080

server.listen(PORT, function () {
    console.log(`Servidor HTTP e Socket.io rodando na porta ${PORT}...`)
})
