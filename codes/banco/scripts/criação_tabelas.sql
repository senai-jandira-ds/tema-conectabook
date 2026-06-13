-- DROP database db_conecta_book;
-- CREATE database db_conecta_book;

-- 1. TABELAS INDEPENDENTES (BASE)
CREATE TABLE tbl_status_livro (
    id_status_livro INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome_status VARCHAR(20) NOT NULL
);

CREATE TABLE tbl_genero (
    id_genero INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(30) NOT NULL,
    descricao VARCHAR(100) NULL
);

CREATE TABLE tbl_usuario (
    id_usuario INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    nome_usuario VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    data_nascimento VARCHAR(10) NOT NULL,
    foto_perfil TEXT NULL
);

CREATE TABLE tbl_evento (
    id_evento INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    data_evento VARCHAR(50) NOT NULL,
    local_evento VARCHAR(100) NOT NULL,
    endereco VARCHAR(200) NOT NULL,
    funcionamento VARCHAR(100) NOT NULL
);

CREATE TABLE tbl_livro (
    id_livro VARCHAR(500) PRIMARY KEY NOT NULL,
    titulo VARCHAR(50) NOT NULL,
    isbn VARCHAR(20) NOT NULL,
    autor VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    capa TEXT NOT NULL
);



CREATE TABLE tbl_cafeteria (
    id_cafeteria INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    endereco TEXT NOT NULL,
    horario_funcionamento VARCHAR(100) NOT NULL,
    rede_social TEXT NULL,
    foto TEXT NOT NULL
);

-- 2. TABELAS COM DEPENDÊNCIAS DIRETAS (NÍVEL 1)
CREATE TABLE tbl_notificacao (
    id_notificacao INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    mensagem VARCHAR(100) NOT NULL,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_recebimento TIMESTAMP NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario (id_usuario)
);

CREATE TABLE tbl_acesso_livro (
    id_acesso_livro INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_livro VARCHAR(500) NOT NULL,
    id_usuario INT NOT NULL,
    data_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_livro) REFERENCES tbl_livro (id_livro),
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario (id_usuario)
);

CREATE TABLE tbl_avaliacao (
    id_avaliacao INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    estrelas INT NOT NULL,
    mensagem TEXT NULL,
    id_usuario INT NOT NULL,
    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario (id_usuario)
);

CREATE TABLE tbl_clube (
    id_clube INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    sobre TEXT NOT NULL,
    regras TEXT NOT NULL,
    foto TEXT NULL,
    id_genero INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL,
    FOREIGN KEY (id_genero) REFERENCES tbl_genero (id_genero)
);

-- 3. TABELAS DEPENDENTES DE CLUBES E HISTÓRICO (NÍVEL 2)
CREATE TABLE tbl_membros (
    id_membros INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    administrador BOOLEAN DEFAULT FALSE,
    id_usuario INT NULL,    
    id_clube INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario (id_usuario),
    FOREIGN KEY (id_clube) REFERENCES tbl_clube (id_clube)
);

CREATE TABLE tbl_estante (
    id_estante INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_status_livro INT NOT NULL,
    id_livro VARCHAR(500) NOT NULL,
    data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario (id_usuario),
    FOREIGN KEY (id_status_livro) REFERENCES tbl_status_livro (id_status_livro),
    FOREIGN KEY (id_livro) REFERENCES tbl_livro (id_livro)
);

-- AJUSTADO: tbl_mensagem com relacionamento direto com tbl_clube (sem tbl_conversa)
CREATE TABLE tbl_mensagem (
    id_mensagem INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    comentario TEXT NOT NULL,                  
    arquivo TEXT NULL,                         
    data_postagem TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    id_clube INT NULL,                         
    id_mensagem_pai INT NULL,                  

    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario (id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_clube) REFERENCES tbl_clube (id_clube) ON DELETE CASCADE,
    FOREIGN KEY (id_mensagem_pai) REFERENCES tbl_mensagem (id_mensagem) ON DELETE CASCADE
);

-- AJUSTADO: tbl_curtida agora aponta para mensagens, não para conversas
CREATE TABLE tbl_curtida (
    id_curtida INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_usuario INT NULL,
    id_mensagem INT NULL,
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario (id_usuario),
    FOREIGN KEY (id_mensagem) REFERENCES tbl_mensagem (id_mensagem)
);

-- 4. TABELAS DE RELACIONAMENTO MUITOS-PARA-MUITOS (NÍVEL 3)
CREATE TABLE tbl_avaliacao_livro (
    id_avaliacao_livro INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_avaliacao INT NOT NULL,
    id_livro VARCHAR(500) NOT NULL,
    FOREIGN KEY (id_avaliacao) REFERENCES tbl_avaliacao (id_avaliacao),
    FOREIGN KEY (id_livro) REFERENCES tbl_livro (id_livro)
);

CREATE TABLE tbl_avaliacao_cafeteria (
    id_avaliacao_cafeteria INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_avaliacao INT NOT NULL,
    id_cafeteria INT NOT NULL,
    FOREIGN KEY (id_avaliacao) REFERENCES tbl_avaliacao (id_avaliacao),
    FOREIGN KEY (id_cafeteria) REFERENCES tbl_cafeteria (id_cafeteria)
);

CREATE TABLE tbl_genero_usuario (
    id_genero_usuario INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_genero INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_genero) REFERENCES tbl_genero (id_genero),
    FOREIGN KEY (id_usuario) REFERENCES tbl_usuario (id_usuario)
);

CREATE TABLE tbl_genero_livro (
    id_genero_livro INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    id_genero INT NOT NULL,
    id_livro VARCHAR(500) NOT NULL,
    FOREIGN KEY (id_genero) REFERENCES tbl_genero (id_genero),
    FOREIGN KEY (id_livro) REFERENCES tbl_livro (id_livro)
);


