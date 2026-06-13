import Button from "../../components/button";
import Footer from "../../components/footer";
import Header from "../../components/header";
import LivroTitulosSemelhantes from "../../components/livroTitulosSemelhantes";

import fotoPessoa1 from "../../assets/userDefault.webp";

import styles from "./style.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTags, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = "https://conectabook.azurewebsites.net/v1/conectaBook/";

export default function LivroAvaliacao() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const livro = state?.livro; // dados vindos do LivroDetalhe

    const [user, setUser] = useState(null);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [media, setMedia] = useState(null);
    const [novaAvaliacao, setNovaAvaliacao] = useState("");
    const [estrelas, setEstrelas] = useState(0);
    const [estrelasHover, setEstrelasHover] = useState(0);
    const [carregando, setCarregando] = useState(true);
    const [publicando, setPublicando] = useState(false);
    const [erro, setErro] = useState(null);
    const [sucesso, setSucesso] = useState(false);

    // ─── 1. Carrega usuário do localStorage ───────────────────────────────────
    useEffect(() => {
        const userStorage = JSON.parse(localStorage.getItem("user"));
        if (userStorage) setUser(userStorage);
    }, []);

    // ─── 2. Garante que o livro existe no banco ao entrar na página ───────────
    useEffect(() => {
        if (!livro) return;

        async function garantirLivroNoBanco() {
            const payload = {
                id_livro: livro.id,
                isbn: livro.isbn,         // usa isbn se disponível, senão o id da OpenLibrary
                titulo: livro.title ?? livro.titulo,
                autor: livro.author ?? livro.autor,
                descricao: livro.descricao ?? livro.description ?? "Sem descrição",
                capa: livro.coverUrl
            }
            console.log(payload)
            try {
                await fetch(`${API_URL}livros`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_livro: livro.id,
                        isbn: livro.isbn,         // usa isbn se disponível, senão o id da OpenLibrary
                        titulo: livro.title ?? livro.titulo,
                        autor: livro.author ?? livro.autor,
                        descricao: livro.descricao ?? livro.description ?? "Sem descrição",
                        capa: livro.coverUrl
                    }),
                });
                // Ignora status: se 201 = criado; se 409 = já existe — ambos estão OK
            } catch (error) {
                console.error("Erro ao garantir livro no banco:", error);
            }
        }

        garantirLivroNoBanco();
    }, [livro]);

    // ─── 3. Busca avaliações e média do livro ─────────────────────────────────
    useEffect(() => {
        if (!livro) return;
        console.log(livro)

        async function fetchAvaliacoes() {
            try {
                const [avaliacoesRes, mediaRes] = await Promise.all([
                    fetch(`${API_URL}avaliacao-livro/livro/${livro.id}`),
                    fetch(`${API_URL}avaliacao-livro/estatisticas/livro/${livro.id}`),
                ]);

                const avaliacoesData = await avaliacoesRes.json();
                const mediaData = await mediaRes.json();

                // A rota retorna { response: [...] } conforme o controller
                const raw = avaliacoesData.response ?? avaliacoesData
                setAvaliacoes(Array.isArray(raw) ? raw : [])
                setMedia(mediaData.response ?? mediaData);
            } catch (error) {
                console.error("Erro ao buscar avaliações:", error);
            } finally {
                setCarregando(false);
            }
        }

        fetchAvaliacoes();
    }, [livro]);

    // ─── 4. Publicar avaliação: 2 etapas (avaliação → vínculo com livro) ─────
    async function handlePublicar() {
        if (!novaAvaliacao.trim()) {
            setErro("Escreva algo na sua avaliação antes de publicar.");
            return;
        }
        if (estrelas === 0) {
            setErro("Selecione uma nota de 1 a 5 estrelas.");
            return;
        }
        if (!user) {
            setErro("Você precisa estar logado para avaliar.");
            return;
        }

        setErro(null);
        setSucesso(false);
        setPublicando(true);

        try {
            // ── Etapa A: cria a avaliação ──────────────────────────────────────
            const resAvaliacao = await fetch(`${API_URL}avaliacao`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    estrelas: estrelas,
                    id_usuario: user?.user?.id,
                    mensagem: novaAvaliacao,
                }),
            });

            const avaliacaoData = await resAvaliacao.json();

            if (!resAvaliacao.ok) {
                setErro("Erro ao criar avaliação. Tente novamente.");
                console.error("Erro ao criar avaliação:", avaliacaoData);
                return;
            }

            // ── Etapa B: vincula avaliação ao livro ────────────────────────────
            const idAvaliacao = avaliacaoData.id ?? avaliacaoData.response?.id;

            console.log(avaliacaoData)

            const resVinculo = await fetch(`${API_URL}avaliacao-livro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_avaliacao: idAvaliacao,
                    id_livro: livro.id,
                }),
            });

            if (!resVinculo.ok) {
                setErro("Avaliação criada, mas houve um problema ao vinculá-la ao livro.");
                console.error("Erro ao criar vínculo avaliação-livro");
                return;
            }

            // ── Sucesso: atualiza a lista sem recarregar ───────────────────────
            const novaAvaliacaoObj = {
                id: idAvaliacao,
                estrelas: estrelas,
                mensagem: novaAvaliacao,
                nome_usuario: user?.user?.nome ?? "Você",
                foto_perfil: user?.user?.foto_perfil ?? null,
            };

            setAvaliacoes((prev) => [novaAvaliacaoObj, ...(Array.isArray(prev) ? prev : [])]);
            setNovaAvaliacao("");
            setEstrelas(0);
            setSucesso(true);
            setTimeout(() => setSucesso(false), 3000);
        } catch (error) {
            console.error("Erro ao publicar avaliação:", error);
            setErro("Erro inesperado. Verifique sua conexão e tente novamente.");
        } finally {
            setPublicando(false);
        }
    }

    // ─── Guards ───────────────────────────────────────────────────────────────
    if (!livro) return <p>Livro não encontrado.</p>;
    if (carregando) return <p>Carregando...</p>;

    return (
        <div>
            <Header fotoUser={user?.user?.foto_perfil} />

            <main className={styles.mainAvaliacao}>
                <div className={styles.conteudoAvaliacao}>
                    {/* ── Capa + estatísticas ── */}
                    <div>
                        <img src={livro.coverUrl} alt={livro.title ?? livro.titulo} />

                        <div className={styles.infosLivro}>
                            <div className={styles.infoLivro}>
                                <FontAwesomeIcon className={styles.icone} icon={faStar} size="lg" />
                                <div>
                                    <p>Média</p>
                                    <p>{media?.media_estrelas ?? "—"}</p>
                                </div>
                            </div>
                            <div className={styles.infoLivro}>
                                <FontAwesomeIcon className={styles.icone} icon={faTags} size="lg" />
                                <div>
                                    <p>Classificação</p>
                                    <p>{media?.classificacao ?? "—"}</p>
                                </div>
                            </div>
                            <div className={styles.infoLivro}>
                                <FontAwesomeIcon className={styles.icone} icon={faPeopleGroup} size="lg" />
                                <div>
                                    <p>Avaliações</p>
                                    <p>{media?.total_avaliacoes ?? "—"}</p>
                                </div>
                            </div>
                        </div>

                        <Button text={"Ver Detalhes"} onClick={() => navigate(`/livroDetalhe/${livro.id}`)} />
                    </div>

                    {/* ── Formulário de avaliação ── */}
                    <div className={styles.avaliacao}>
                        <div className={styles.livroTitulo}>
                            <div>
                                <h1>{livro.title ?? livro.titulo}</h1>
                                <p>{livro.author ?? livro.autor}</p>
                            </div>
                            <Button
                                text={publicando ? "Publicando..." : "Publicar"}
                                onClick={handlePublicar}
                                disabled={publicando}
                            />
                        </div>

                        {/* Seletor de estrelas */}
                        <div className={styles.estrelasContainer}>
                            {[1, 2, 3, 4, 5].map((n) => (
                                <FontAwesomeIcon
                                    key={n}
                                    icon={n <= (estrelasHover || estrelas) ? faStar : faStarRegular}
                                    className={styles.estrelaSeletor}
                                    onClick={() => setEstrelas(n)}
                                    onMouseEnter={() => setEstrelasHover(n)}
                                    onMouseLeave={() => setEstrelasHover(0)}
                                    style={{
                                        cursor: "pointer",
                                        color: n <= (estrelasHover || estrelas) ? "#f5a623" : "#ccc",
                                        fontSize: "1.4rem",
                                        marginRight: "4px",
                                        transition: "color 0.15s",
                                    }}
                                />
                            ))}
                        </div>

                        <div className={styles.textarea}>
                            <textarea
                                placeholder="Escreva sua avaliação..."
                                value={novaAvaliacao}
                                onChange={(e) => setNovaAvaliacao(e.target.value)}
                            />
                        </div>



                        {/* Feedback de erro ou sucesso */}
                        {erro && <p style={{ color: "red", marginTop: "8px" }}>{erro}</p>}
                        {sucesso && <p style={{ color: "green", marginTop: "8px" }}>Avaliação publicada com sucesso!</p>}

                        {/* ── Lista de avaliações ── */}
                        <div className={styles.users}>
                            {avaliacoes.length === 0 && <p>Nenhuma avaliação ainda. Seja o primeiro!</p>}

                            {Array.isArray(avaliacoes) && avaliacoes.map((avaliacao, index) => (
                                <div key={avaliacao.id ?? index} className={styles.user}>
                                    <div className={styles.userPost}>
                                        <img
                                            src={avaliacao.foto_perfil ?? fotoPessoa1}
                                            alt={avaliacao.nome_usuario ?? "Usuário"}
                                        />
                                        <p>{avaliacao.nome_usuario ?? "Usuário"}</p>
                                    </div>

                                    {/* Estrelas da avaliação */}
                                    {avaliacao.estrelas && (
                                        <div>
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <FontAwesomeIcon
                                                    key={n}
                                                    icon={n <= avaliacao.estrelas ? faStar : faStarRegular}
                                                    style={{
                                                        color: n <= avaliacao.estrelas ? "#f5a623" : "#ccc",
                                                        fontSize: "0.9rem",
                                                        marginRight: "2px",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div>
                                        <p>{avaliacao.mensagem}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </main>

            <LivroTitulosSemelhantes livroAtual={{ titulo: livro.title ?? livro.titulo, autor: livro.author ?? livro.autor }} />
            <Footer />
        </div>
    );
}