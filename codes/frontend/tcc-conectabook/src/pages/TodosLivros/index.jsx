import { useEffect, useState } from "react"


import styles from "./style.module.css"
import CardLivro from "../../components/CardLivro/CardLivro"
import Header from "../../components/header"
import Footer from "../../components/footer"

export default function TodosLivros() {

    const [books, setBooks] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        async function fetchBooks() {

            setLoading(true)

            try {

                const res = await fetch(
                    `https://openlibrary.org/search.json?q=livros&page=${page}`
                )

                const data = await res.json()

                const mapped = data.docs
                    .filter(book => book.cover_i && book.title && book.author_name && book.author_name.length > 0)
                    .slice(0, 20)
                    .map(book => ({
                        key: book.key,
                        title: book.title,
                        author: book.author_name?.[0] ?? "Autor desconhecido",

                        coverUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                    }))
                setBooks(mapped)

            } catch (error) {
                console.log(error)
            }

            setLoading(false)
        }

        fetchBooks()

    }, [page])

    return (
        <div className={styles.container}>

            <Header />

            <main className={styles.mainTodosLivros}>
                <h1>Todos os livros</h1>

                {loading && <p>Carregando...</p>}

                <div className={styles.listBooks}>

                    {books.map(book => (

                        <CardLivro
                            key={book.key}
                            imagem={book.coverUrl}
                            titulo={book.title}
                            autor={book.author}
                            rota={`/livroDetalhe/${book.key.split('/works/')[1]}`}
                        />

                    ))}

                </div>

                <div className={styles.pagination}>

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Voltar
                    </button>

                    <span>Página {page}</span>

                    <button
                        onClick={() => setPage(page + 1)}
                    >
                        Próxima
                    </button>

                </div>

            </main>


            <Footer />

        </div>
    )
}