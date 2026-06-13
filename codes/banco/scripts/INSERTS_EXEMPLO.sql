-- =========================================================================
-- 1. INSERTS NAS TABELAS INDEPENDENTES (BASE)
-- =========================================================================

INSERT INTO tbl_status_livro (nome_status) VALUES
('Quero Ler'),   
('Lendo'),       
('Lido');
	
INSERT INTO tbl_genero (nome) VALUES
('Romance'), ('Fantasia'), ('Ficção Científica'), ('Terror'), ('Suspense'),
('Mistério'), ('Aventura'), ('Drama'), ('Comédia'), ('Ação'),
('Biografia'), ('História'), ('Poesia'), ('Infantil'), ('Juvenil'),
('Distopia'), ('HQ'), ('Manga'), ('Autoajuda'), ('Religioso'),
('Técnico'), ('Educação'), ('Filosofia'), ('Psicologia'), ('Policial');

-- CORRIGIDO: Datas alteradas para o formato aceito pelo MySQL (AAAA-MM-DD)
INSERT INTO tbl_usuario (nome, nome_usuario, email, senha, data_nascimento, foto_perfil) VALUES
('Alex Henrique', 'alex_henrique', 'alex@email.com', 'senha123', '2004-10-15', null), -- ID 1
('Geovanna Silva', 'geovanna_silva', 'geovanna@email.com', 'senha456', '2005-03-22', null), -- ID 2
('Carlos Eduardo', 'cadu_leitor', 'carlos@email.com', 'senha789', '2001-07-05', null); -- ID 3

INSERT INTO tbl_evento (nome, data_evento, local_evento, endereco, funcionamento) VALUES
('Feira Literária de São Paulo', '25 a 30 de Julho de 2026', 'Expo Center Norte', 'Rua José Bernardo Pinto, 333', 'Das 10h às 22h'),
('Clube do Livro: Especial Terror', '31/10/2026', 'Biblioteca Municipal', 'Av. Paulista, 1500', 'Às 19h00');

-- AJUSTADO: ID de livros migrados de INT para String/Alfanumérico gerados por APIs (ex: Google Books)
INSERT INTO tbl_livro (id_livro, titulo, isbn, autor, descricao, capa) VALUES
('yE9bAAAAMAAJ', 'Duna', '9788551002490', 'Frank Herbert', 'Uma jornada épica no planeta desértico de Arrakis.', 'https://capas.com/duna.jpg'),
('iK50DwAAQBAJ', 'O Iluminado', '9788560280421', 'Stephen King', 'O drama psicológico de Jack Torrance no isolado Hotel Overlook.', 'https://capas.com/iluminado.jpg'),
('4_A_DwAAQBAJ', 'Orgulho e Preconceito', '9788582850350', 'Jane Austen', 'O clássico confronto entre Elizabeth Bennet e o Sr. Darcy.', 'https://capas.com/orgulho.jpg');

INSERT INTO tbl_cafeteria (nome, endereco, horario_funcionamento, rede_social, foto) VALUES
('Café & Poesia', 'Praça da Sé, 45 - Centro', 'Segunda a Sábado, das 08h às 20h', '@cafe_e_poesia', 'https://fotos.com/cafeteria1.jpg'),
('Literato Coffe', 'Alameda Santos, 1200 - Paulista', 'Todos os dias, das 09h às 22h', '@literatocofee', 'https://fotos.com/cafeteria2.jpg');


-- =========================================================================
-- 2. INSERTS NAS TABELAS COM DEPENDÊNCIAS DIRETAS (NÍVEL 1)
-- =========================================================================

INSERT INTO tbl_notificacao (titulo, mensagem, id_usuario) VALUES
('Bem-vindo!', 'Obrigado por criar sua conta no ConectaBook.', 1),
('Novo Clube!', 'Um clube de Fantasia que você segue acabou de ser criado.', 2);

-- AJUSTADO: id_livro mapeado para as respectivas Strings inseridas acima
INSERT INTO tbl_acesso_livro (id_livro, id_usuario) VALUES
('yE9bAAAAMAAJ', 1), -- Alex acessou Duna
('iK50DwAAQBAJ', 1), -- Alex acessou O Iluminado
('4_A_DwAAQBAJ', 2); -- Geovanna acessou Orgulho e Preconceito

INSERT INTO tbl_avaliacao (estrelas, mensagem, id_usuario) VALUES
(5, 'Obra-prima da ficção científica, todo mundo deveria ler!', 1), -- ID 1
(4, 'Muito assustador, o King sabe construir tensão.', 2),          -- ID 2
(5, 'Ambiente maravilhoso para ler um bom livro enquanto toma um expresso.', 1); -- ID 3

INSERT INTO tbl_clube (nome, sobre, regras, foto, id_genero) VALUES
('Viajantes de Arrakis', 'Clube focado em leitura de Sci-Fi clássica e moderna.', 'Respeitar as opiniões e evitar spoilers sem aviso.', NULL, 3), -- ID 1 (Ficção Científica)
('Leitores da Madrugada', 'Para quem gosta de passar a noite lendo histórias assustadoras.', 'Proibido conteúdo ofensivo.', NULL, 4); -- ID 2 (Terror)


-- =========================================================================
-- 3. INSERTS NAS TABELAS DEPENDENTES DE CLUBES E HISTÓRICO (NÍVEL 2)
-- =========================================================================

INSERT INTO tbl_membros (administrador, id_usuario, id_clube) VALUES
(1, 1, 1), -- Alex é administrador do clube Viajantes de Arrakis (1)
(0, 2, 1), -- Geovanna é membro comum do clube Viajantes de Arrakis (1)
(1, 2, 2); -- Geovanna é administradora do Leitores da Madrugada (2)

-- AJUSTADO: id_livro como string e id_status_livro correspondente à tabela base
INSERT INTO tbl_estante (id_usuario, id_status_livro, id_livro) VALUES
(1, 3, 'yE9bAAAAMAAJ'), -- Alex marcou Duna como "Lido" (3)
(1, 2, 'iK50DwAAQBAJ'), -- Alex marcou O Iluminado como "Lendo" (2)
(2, 1, '4_A_DwAAQBAJ'); -- Geovanna marcou Orgulho e Preconceito como "Quero Ler" (1)


-- 🚨 REMOVIDO: INSERT na antiga tbl_conversa


-- CORRIGIDO: Modificado o campo id_conversa para o novo id_clube
-- Observe que no terceiro insert o id_clube vira NULL, indicando que o post vai direto para o FEED PRINCIPAL
INSERT INTO tbl_mensagem (comentario, arquivo, data_postagem, id_usuario, id_mensagem_pai, id_clube) VALUES
('E aí pessoal, o que estão achando do primeiro capítulo de Duna?', NULL, NOW(), 1, NULL, 1), -- ID 1 (Alex no clube 1)
('Eu achei o começo um pouco lento, mas o universo é incrível!', NULL, NOW(), 2, 1, 1),    -- ID 2 (Geovanna respondendo a msg 1 no clube 1)
('Alguém já leu harry potter?', NULL, NOW(), 3, NULL, NULL);                         -- ID 3 (Carlos postando no FEED GERAL)

-- Curtindo mensagens específicas
INSERT INTO tbl_curtida (id_usuario, id_mensagem) VALUES
(2, 1), -- Geovanna curtiu a mensagem 1 (do Alex)
(1, 2); -- Alex curtiu a resposta da Geovanna (mensagem 2)


-- =========================================================================
-- 4. INSERTS NAS TABELAS INTERMEDIÁRIAS MUITOS-PARA-MUITOS (NÍVEL 3)
-- =========================================================================

-- AJUSTADO: Vinculando avaliações aos seus respectivos IDs de livro textuais
INSERT INTO tbl_avaliacao_livro (id_avaliacao, id_livro) VALUES
(1, 'yE9bAAAAMAAJ'), -- Avaliação 1 vai para o Livro (Duna)
(2, 'iK50DwAAQBAJ'); -- Avaliação 2 vai para o Livro (O Iluminado)

INSERT INTO tbl_avaliacao_cafeteria (id_avaliacao, id_cafeteria) VALUES
(3, 1); -- Avaliação 3 vai para a Cafeteria 1 (Café & Poesia)

-- Gêneros favoritos dos usuários
INSERT INTO tbl_genero_usuario (id_genero, id_usuario) VALUES
(3, 1), -- Alex curte Ficção Científica (ID 3)
(2, 1), -- Alex curte Fantasia (ID 2)
(4, 2); -- Geovanna curte Terror (ID 4)

-- AJUSTADO: Mapeamento de gêneros com strings dos livros
INSERT INTO tbl_genero_livro (id_genero, id_livro) VALUES
(3, 'yE9bAAAAMAAJ'), -- Duna é Ficção Científica (ID 3)
(4, 'iK50DwAAQBAJ'), -- O Iluminado é Terror (ID 4)
(1, '4_A_DwAAQBAJ'); -- Orgulho e Preconceito é Romance (ID 1)
