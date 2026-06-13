import { useEffect, useState } from "react"
import Header from "../../components/header"
import Footer from "../../components/footer"
import CardLivro from "../../components/CardLivro/CardLivro"


import styles from "./style.module.css"

export default function Estante() {
    const [livros, setLivros] = useState([])
    const [user, setUser] = useState(null)

    useEffect(() => {
        const userStorage = JSON.parse(localStorage.getItem("user"))
        if (userStorage) {
            setUser(userStorage)
        }
    }, [])

    useEffect(() => {
        const userId = user?.user?.id

        if (!userId) return

        fetch(`https://conectabook.azurewebsites.net/v1/conectaBook/estante/usuario/${userId}`)
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar estante")
                return res.json()
            })
            .then(data => {
                const lista = Array.isArray(data.estante) ? data.estante : []
                setLivros(lista)
            })
            .catch(err => {
                console.log(err)
            })
    }, [user])

    return (
        <>
            <Header />

            <main className={styles.mainLivros}>
                <div>
                    <h2>Lendo</h2>
                    <div className={styles.livros}>
                        {livros
                            .filter(livro => livro.status_leitura === "Lendo")
                            .map(livro => (
                                <CardLivro
                                    key={livro.id_estante}
                                    imagem={livro.capa}
                                    titulo={livro.titulo}
                                    autor={livro.autor}
                                    rota={`/livroDetalhe/${livro.id_livro}`}
                                />
                            ))}
                    </div>
                </div>

                <div>
                    <h2>Lido</h2>
                    <div className={styles.livros}>
                        {livros
                            .filter(livro => livro.status_leitura === "Lido")
                            .map(livro => (
                                <CardLivro
                                    key={livro.id_estante}
                                    imagem={livro.capa}
                                    titulo={livro.titulo}
                                    autor={livro.autor}
                                    rota={`/livroDetalhe/${livro.id_livro}`}
                                />
                            ))}
                    </div>
                </div>

                <div >
                    <h2>Quero Ler</h2>
                    <div className={styles.livros}>
                        {livros
                            .filter(livro => livro.status_leitura === "Quero Ler")
                            .map(livro => (
                                <CardLivro
                                    key={livro.id_estante}
                                    imagem={livro.capa}
                                    titulo={livro.titulo}
                                    autor={livro.autor}
                                    rota={`/livroDetalhe/${livro.id_livro}`}
                                />
                            ))}
                    </div>
                </div>
            </main>

            <Footer />
        </>
    )
}