import Footer from "../../components/footer";
import Header from "../../components/header";
import Button from "../../components/button/index.jsx"
import styles from "./style.module.css"
import LivroTitulosSemelhantes from "../../components/livroTitulosSemelhantes/index.jsx"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LivroDetalhe() {

    const { id } = useParams();
    const [livro, setLivro] = useState(null);

    const [modalEstante, setModalEstante] = useState(false)
    const [statusSelecionado, setStatusSelecionado] = useState(null)
    const [livroNaEstante, setLivroNaEstante] = useState(null)

    const [user, setUser] = useState(null)

    const statusMap = {
        quero_ler: 1,
        lendo: 2,
        lido: 3
    }

    const statusLabelMap = {
        quero_ler: "Quero ler",
        lendo: "Lendo",
        lido: "Já li"
    }

    const statusNomeParaChave = {
        "Quero Ler": "quero_ler",
        "Lendo": "lendo",
        "Lido": "lido"
    }

    useEffect(() => {
        const userStorage = JSON.parse(localStorage.getItem("user"))
        if (userStorage) setUser(userStorage)
    }, [])

    // ─── Garante que o livro existe no banco ───────────────────────────────────
    useEffect(() => {
        if (!livro) return;

        async function garantirLivroNoBanco() {
            try {
                await fetch(`https://conectabook.azurewebsites.net/v1/conectaBook/livros`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_livro: livro.id,
                        isbn: livro.isbn,
                        titulo: livro.title,
                        autor: livro.author,
                        descricao: livro.description ?? "Sem descrição",
                        capa: livro.coverUrl
                    }),
                });
            } catch (error) {
                console.error("Erro ao garantir livro no banco:", error);
            }
        }

        garantirLivroNoBanco();
    }, [livro]);

    useEffect(() => {
        async function fetchLivro() {
            try {
                const res = await fetch(`https://openlibrary.org/works/${id}.json`)
                const data = await res.json()

                let authorName = "Autor desconhecido"
                if (data.authors?.length > 0) {
                    const authorKey = data.authors[0].author.key
                    const authorRes = await fetch(`https://openlibrary.org${authorKey}.json`)
                    const authorData = await authorRes.json()
                    authorName = authorData.name
                }

                const genero = data.subjects?.[0] ?? "Gênero não informado"
                let paginas = "Não informado"
                let anoPublicacao = "Não informado"

                const editionsRes = await fetch(`https://openlibrary.org/works/${id}/editions.json?limit=1`)
                const editionsData = await editionsRes.json()
                const edition = editionsData.entries?.[0]
                let isbn = null

                if (edition) {
                    paginas = edition.number_of_pages ?? "Não informado"
                    anoPublicacao = edition.publish_date ?? "Não informado"
                    isbn = edition.isbn_13?.[0] || edition.isbn_10?.[0] || null
                }

                setLivro({
                    id,
                    title: data.title,
                    author: authorName,
                    description: data.description?.value ?? data.description ?? "Sem descrição.",
                    genero,
                    paginas,
                    anoPublicacao,
                    isbn,
                    coverUrl: data.covers?.[0]
                        ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
                        : null
                })

            } catch (error) {
                console.log(error)
            }
        }
        fetchLivro()
    }, [id])

    useEffect(() => {
        async function verificarEstante() {
            if (!user || !id) return

            try {
                const res = await fetch(
                    `https://conectabook.azurewebsites.net/v1/conectaBook/estante/usuario/${user.user.id}`
                )

                if (!res.ok) return

                const data = await res.json()

                const lista = data.estante ?? []

                const encontrado = lista.find(item => item.id_livro === id)

                if (encontrado) {
                    setLivroNaEstante(encontrado)

                    setStatusSelecionado(statusNomeParaChave[encontrado.status_leitura])
                }

            } catch (error) {
                console.log("Erro ao verificar estante:", error)
            }
        }

        verificarEstante()
    }, [user, id])

    const handleAbrirModal = () => {
        if (livroNaEstante) {

            setStatusSelecionado(statusNomeParaChave[livroNaEstante.status_leitura])
        } else {
            setStatusSelecionado(null)
        }
        setModalEstante(true)
    }

    const handleAdicionarEstante = async () => {
        if (!statusSelecionado || !user) return

        const statusId = statusMap[statusSelecionado]

        try {
            let res

            if (livroNaEstante) {

                console.log(livroNaEstante)

                res = await fetch(
                    `https://conectabook.azurewebsites.net/v1/conectaBook/estante/${livroNaEstante.id_estante}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id_usuario: user.user.id,       // ← adicionar
                            id_livro: livro.id,             // ← adicionar
                            id_status_livro: statusId
                        })
                    }
                )
            } else {
                res = await fetch(`https://conectabook.azurewebsites.net/v1/conectaBook/estante`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id_usuario: user.user.id,
                        id_livro: livro.id,
                        id_status_livro: statusId
                    })
                })
            }

            if (!res.ok) {
                const erro = await res.json()
                console.error("Erro do backend:", erro)
                return
            }


            const statusLeituraMap = {
                quero_ler: "Quero Ler",
                lendo: "Lendo",
                lido: "Lido"
            }

            setLivroNaEstante(prev => ({
                ...prev,
                status_leitura: statusLeituraMap[statusSelecionado]
            }))

            setModalEstante(false)

        } catch (error) {
            console.log(error)
        }
    }

    const handleRemoverEstante = async () => {
        if (!livroNaEstante || !user) return

        try {

            const res = await fetch(
                `https://conectabook.azurewebsites.net/v1/conectaBook/estante/${livroNaEstante.id_estante}`,
                { method: 'DELETE' }
            )

            if (!res.ok) {
                const erro = await res.json()
                console.error("Erro ao remover:", erro)
                return
            }

            setLivroNaEstante(null)
            setStatusSelecionado(null)
            setModalEstante(false)

        } catch (error) {
            console.log(error)
        }
    }

    const navigate = useNavigate()

    if (!livro) return <p>Carregando...</p>

    return (
        <div>
            <Header fotoUser={user?.user?.foto_perfil} />
            <main className={styles.mainDetalhe}>
                <div className={styles.mainUp}>
                    <div>
                        <img src={livro.coverUrl} alt="" />
                    </div>
                    <div className={styles.leftUpMain}>
                        <div className={styles.leftUpMainText}>
                            <h1>{livro.title}</h1>
                            <h2>{livro.author}</h2>
                            <div className={styles.infosLivro}>
                                <div className={styles.infoLivro}><p>{livro.genero}</p></div>
                                <div className={styles.infoLivro}><p>{livro.anoPublicacao}</p></div>
                                <div className={styles.infoLivro}><p>{livro.paginas}</p></div>
                            </div>
                            <p className={styles.sobreLivro}>{livro.description}</p>
                        </div>

                        <div className={styles.buttons}>
                            <div className={styles.avaliacaoButtons}>
                                <Button text={"Favoritar"} />
                                <Button
                                    text={"Avaliacoes"}
                                    onClick={() => navigate('/livroAvaliacoes', { state: { livro } })}
                                />
                            </div>


                            <Button
                                text={
                                    livroNaEstante
                                        ? `✓ ${statusLabelMap[statusNomeParaChave[livroNaEstante.status_leitura]]}`
                                        : "Adicionar à estante"
                                }
                                onClick={handleAbrirModal}
                                className={styles.adicionarEstante}
                            />

                            {modalEstante && (
                                <div className={styles.modalOverlay}>
                                    <div className={styles.modal}>
                                        <h2>
                                            {livroNaEstante ? "Atualizar na estante" : "Adicionar à estante"}
                                        </h2>
                                        <p>Como você está com <em>{livro.title}</em>?</p>

                                        {["lendo", "lido", "quero_ler"].map((status) => (
                                            <button
                                                key={status}
                                                className={`${styles.statusBtn} ${statusSelecionado === status ? styles.selected : ""}`}
                                                onClick={() => setStatusSelecionado(status)}
                                            >
                                                {statusLabelMap[status]}
                                            </button>
                                        ))}

                                        <div className={styles.modalActions}>
                                            {livroNaEstante && (
                                                <button
                                                    className={styles.removerBtn}
                                                    onClick={handleRemoverEstante}
                                                >
                                                    Remover da estante
                                                </button>
                                            )}
                                            <button onClick={() => setModalEstante(false)}>
                                                Cancelar
                                            </button>
                                            <button
                                                disabled={!statusSelecionado}
                                                onClick={handleAdicionarEstante}
                                            >
                                                {livroNaEstante ? "Atualizar" : "Adicionar"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <LivroTitulosSemelhantes livroAtual={{ titulo: livro.title, autor: livro.author }} />
            </main>
            <Footer />
        </div>
    )
}