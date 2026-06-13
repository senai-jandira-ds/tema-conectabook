import { useEffect, useState } from "react"
import styles from "./style.module.css"
import { useNavigate } from "react-router-dom"

// Recebe o livro atual como prop para buscar semelhantes
// Ex: <LivroTitulosSemelhantes livroAtual={{ titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry" }} />
export default function LivroTitulosSemelhantes({ livroAtual }) {
    const [livros, setLivros] = useState([])
    const [loading, setLoading] = useState(true)
    const [erro, setErro] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!livroAtual?.titulo) return
        buscarLivrosSemelhantes(livroAtual.titulo, livroAtual.autor)
    }, [livroAtual?.titulo, livroAtual?.autor]) // ← só os valores, não o objeto

    async function buscarLivrosSemelhantes(titulo, autor) {
        setLoading(true)
        setErro(null)

        try {
            //  Busca o livro atual para pegar seus subjects
            const buscaAtual = await fetch(
                `https://openlibrary.org/search.json?title=${encodeURIComponent(titulo)}&author=${encodeURIComponent(autor)}&limit=1&fields=subject,key`
            )
            const dataAtual = await buscaAtual.json()
            const livroEncontrado = dataAtual.docs?.[0]

            let url = ""

            if (livroEncontrado?.subject?.length > 0) {
                //  Pega o primeiro subject relevante e busca livros semelhantes
                const subject = livroEncontrado.subject[0]
                url = `https://openlibrary.org/search.json?subject=${encodeURIComponent(subject)}&limit=12&fields=key,title,author_name,cover_i,ratings_average`
            } else {
                // Fallback: busca por autor se não encontrar subjects
                url = `https://openlibrary.org/search.json?author=${encodeURIComponent(autor)}&limit=12&fields=key,title,author_name,cover_i,ratings_average`
            }

            const buscaSemelhantes = await fetch(url)
            const dataSemelhantes = await buscaSemelhantes.json()

            //  Filtra o próprio livro dos resultados e formata os dados
            const semelhantes = dataSemelhantes.docs
                ?.filter(l => !l.title?.toLowerCase().includes(titulo.toLowerCase()))
                .slice(0, 6)
                .map((l, index) => ({
                    id: l.key || index,
                    nome: l.title || "Título desconhecido",
                    autor: l.author_name?.[0] || "Autor desconhecido",
                    avaliacao: l.ratings_average?.toFixed(2) || null,
                    imagem: l.cover_i
                        ? `https://covers.openlibrary.org/b/id/${l.cover_i}-M.jpg`
                        : null,
                }))

            setLivros(semelhantes || [])
            console.log(livros)
        } catch (err) {
            console.error(err)
            setErro("Não foi possível carregar títulos semelhantes.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.bodyLivro}>
            <div className={styles.titulosSemelhantesText}>
                <p>Títulos Semelhantes</p>
                <p>Ver Todos</p>
            </div>

            {loading && <p className={styles.mensagem}>Carregando...</p>}
            {erro && <p className={styles.mensagem}>{erro}</p>}

            {!loading && !erro && (
                <div className={styles.titulosSemelhantes}>
                    {livros.length === 0 ? (
                        <p className={styles.mensagem}>Nenhum título semelhante encontrado.</p>
                    ) : (
                        livros.map((livro) => (
                            <div className={styles.tituloSemelhante} key={livro.id} onClick={() => navigate(`/livroDetalhe/${livro.id.split("/").pop()}`)}
                                style={{ cursor: "pointer" }}>
                                {livro.imagem ? (
                                    <img src={livro.imagem} alt={livro.nome} />
                                ) : (
                                    <div className={styles.semCapa}>Sem capa</div>
                                )}
                                <p>{livro.nome}</p>
                                <p>{livro.autor}</p>
                                {livro.avaliacao && <p>⭐ {livro.avaliacao}</p>}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}