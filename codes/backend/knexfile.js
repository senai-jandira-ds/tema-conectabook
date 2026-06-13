/*******************************************************************************************
 * Objetivo: Arquivo de configuração do DB do projeto
 * Data: 05/05/2026
 * Autor: Alex Gomes
 * Versão: 1.0
 ******************************************************************************************/

// module.exports = {
//     development: {
//         client: 'mysql2',
//         connection: {
//             host: "127.0.0.1",
//             user: "root",
//             password: "12345678",
//             database: "db_conecta_book",
//             port: 3306, // CORRIGIDO: Porta do MySQL é 3306
//             charset: 'utf8mb4'
//         }
//     }
// };


module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: "conectabook-server.mysql.database.azure.com",
            user: "admindb",
            password: "1234Abc#",
            database: "db_conecta_book",
            port: 3306, // CORRIGIDO: Porta do MySQL é 3306
            ssl: {
                rejectUnauthorized: false
            },
            charset: 'utf8mb4'
        }
    }
};
