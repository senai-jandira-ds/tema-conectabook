/*******************************************************************************************
 * Objetivo: Arquivo responsável pela maipulação do socket.io (Interação em tempo real)
 * Projeto: ConectaBook
 * Data: 26/05/2026
 * Autor: Geovanna Silva
 * Versão: 1.0
 *******************************************************************************************/


 module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`Usuário conectado ao Socket: ${socket.id}`);

        // O usuário avisa qual tela/contexto ele está acessando
        socket.on('entrar_contexto', (dados) => {
            // dados = { tipoContexto: 'feed' | 'resenha' | 'clube', idClube: 12 }
            
            if (dados.tipoContexto === 'feed') {
                socket.join('sala_feed_geral');
            } 
            else if (dados.tipoContexto === 'clube' && dados.idClube) {
                socket.join(`sala_clube_${dados.idClube}`);
            } 
            else if (dados.tipoContexto === 'resenha' && dados.idMensagemPai) {
                socket.join(`sala_resenha_${dados.idMensagemPai}`);
            }
        });

        // Evento opcional para quando o usuário sai de uma tela específica
        socket.on('sair_contexto', (dados) => {
            if (dados.tipoContexto === 'feed') socket.leave('sala_feed_geral');
            if (dados.idClube) socket.leave(`sala_clube_${dados.idClube}`);
            if (dados.idMensagemPai) socket.leave(`sala_resenha_${dados.idMensagemPai}`);
        });

        socket.on('disconnect', () => {
            console.log(`Usuário desconectou: ${socket.id}`);
        })
    })
}