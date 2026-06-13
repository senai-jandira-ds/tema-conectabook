import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../../components/header/index"
import LeftFeed from "../../components/feed"

import fotoPessoa1 from "../../assets/fotoPessoa1.jpg"

import styles from "./style.module.css"

import fotoLivro1 from "../../assets/fotoLivro1.jpg"
import fotoClube1 from "../../assets/group.png"
import Footer from "../../components/footer"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faStar,
    faStarHalfStroke
} from "@fortawesome/free-solid-svg-icons";

import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

function Feed() {

    const POSTS_API = "https://conectabook.azurewebsites.net/v1/conectaBook/mensagem/feed/principal"

    const [posts, setPosts] = useState([])
    const [user, setUser] = useState(null)

    const [clubesUsuario, setClubesUsuario] = useState([])

    const [livrosSugeridos, setLivrosSugeridos] = useState([])

    const [livrosPopulares, setLivrosPopulares] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        const userStorage = JSON.parse(localStorage.getItem("user"))



        if (!userStorage) {
            navigate("/")
        } else {
            setUser(userStorage)
            getPosts()
            getLivrosFavoritos(userStorage.user.id)
            getClubesUsuario(userStorage.user.id)
            getLivrosPopulares()
        }

        async function getLivrosPopulares() {
            try {
                const response = await fetch(
                    "https://openlibrary.org/trending/monthly.json?limit=3"
                )

                const data = await response.json()

                const livros = data.works.map(livro => ({
                    id: livro.key.split("/").pop(),
                    titulo: livro.title,
                    autor: livro.author_name?.[0] || "Autor desconhecido",
                    capa: livro.cover_i
                        ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
                        : fotoLivro1
                }))

                setLivrosPopulares(livros)
            } catch (error) {
                console.log(error)
            }
        }

        async function getClubesUsuario(idUsuario) {
            try {
                const response = await fetch(
                    `https://conectabook.azurewebsites.net/v1/conectaBook/membros/usuario/${idUsuario}`
                )

                const data = await response.json()

                setClubesUsuario(data.response ?? [])

            } catch (error) {
                console.log(error)
            }
        }

        async function getLivrosFavoritos(idUsuario) {
            try {
                const responseGenero = await fetch(
                    `https://conectabook.azurewebsites.net/v1/conectaBook/genero-usuario/usuario/${idUsuario}`
                )

                const dataGenero = await responseGenero.json()

                const mapaGeneros = {
                    "Romance": "romance",
                    "Fantasia": "fantasy",
                    "Ficção Científica": "science_fiction",
                    "Terror": "horror",
                    "Suspense": "thriller",
                    "Mistério": "mystery",
                    "Aventura": "adventure",
                    "Drama": "drama",
                    "Comédia": "humor",
                    "Ação": "action",
                    "Biografia": "biography",
                    "História": "history",
                    "Poesia": "poetry",
                    "Infantil": "children",
                    "Juvenil": "young_adult",
                    "Distopia": "dystopian",
                    "HQ": "comics",
                    "Mangá": "manga",
                    "Autoajuda": "self_help",
                    "Religioso": "religion",
                    "Técnico": "technology",
                    "Educação": "education",
                    "Filosofia": "philosophy",
                    "Psicologia": "psychology",
                    "Policial": "crime"
                }

                const generos = dataGenero.response ?? []
                const resultados = await Promise.all(
                    generos.map(async (genero) => {
                        const assunto = mapaGeneros[genero.nome] || genero.nome

                        const responseLivro = await fetch(`https://openlibrary.org/search.json?subject=${encodeURIComponent(assunto)}&limit=3`)

                        const dataLivro = await responseLivro.json()

                        return dataLivro.docs.map(livro => ({
                            id: livro.key.split("/").pop(),
                            titulo: livro.title,
                            autor: livro.author_name?.[0] || "Autor desconhecido",
                            capa: livro.cover_i
                                ? `https://covers.openlibrary.org/b/id/${livro.cover_i}-M.jpg`
                                : fotoLivro1
                        }))
                    })
                )

                const livros = resultados.flat()

                const livrosUnicos = livros.filter(
                    (livro, index, self) =>
                        index === self.findIndex(
                            l => l.titulo === livro.titulo
                        )
                )

                setLivrosSugeridos(livrosUnicos)

            } catch (error) {
                console.log(error)
            }
        }

        async function getPosts() {
            try {
                const response = await fetch(POSTS_API)

                const data = await response.json()


                setPosts(data.response)
            } catch (error) {
                console.log(error)

            }
        }

        getPosts()
        getLivrosPopulares()
    }, [])

    return (

        <div>
            <Header
                fotoUser={user?.user?.foto_perfil}
            />
            <div className={styles.mainFeed}>
                <LeftFeed feedUrl={"https://conectabook.azurewebsites.net/v1/conectaBook/mensagem/feed/principal"} />
                <div className={styles.feedPageRight}>
                    <div className={styles.divRight}>
                        <div className={styles.divRightTitulo}>
                            <h3>Titulos Sugeridos</h3>
                            <p>Ver Todos</p>
                        </div>

                        {
                            livrosSugeridos.slice(0, 5).map((livro, index) => (

                                <div
                                    key={index}
                                    className={styles.titulos}
                                >

                                    <div className={styles.livro}
                                        onClick={() => navigate(`/livroDetalhe/${livro.id}`)}>
                                        <img
                                            src={livro.capa}
                                            alt={livro.titulo}
                                            onError={(e) => {
                                                e.target.src = fotoLivro1
                                            }}
                                        />

                                        <div>
                                            <h4>{livro.titulo}</h4>

                                            <p>{livro.autor}</p>

                                            <div>
                                                <div className={styles.avaliacao}>
                                                    <div>
                                                        <FontAwesomeIcon
                                                            icon={faStar}
                                                            style={{ color: "rgb(255, 212, 59)" }}
                                                        />
                                                        <FontAwesomeIcon
                                                            icon={faStar}
                                                            style={{ color: "rgb(255, 212, 59)" }}
                                                        />
                                                        <FontAwesomeIcon
                                                            icon={faStar}
                                                            style={{ color: "rgb(255, 212, 59)" }}
                                                        />
                                                        <FontAwesomeIcon
                                                            icon={faStar}
                                                            style={{ color: "rgb(255, 212, 59)" }}
                                                        />
                                                        <FontAwesomeIcon
                                                            icon={faStarRegular}
                                                            style={{ color: "rgb(255, 212, 59)" }}
                                                        />
                                                    </div>

                                                    <p>Sugestão</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))
                        }
                    </div>
                    <div className={styles.divRight}>
                        <div className={styles.divRightTitulo}>
                            <h3>Meus Clube de Literatura</h3>
                            <p>Ver todos</p>
                        </div>
                        <div className={styles.clubesFeed}>
                            {clubesUsuario.length > 0 ? (
                                clubesUsuario.map((clube) => (
                                    <div
                                        key={clube.id_clube}
                                        className={styles.clube}
                                        onClick={() => navigate(`/feedClube/${clube.id_clube}`)}
                                    >
                                        <img
                                            className={styles.imagemClube}
                                            src={clube.foto || fotoClube1}
                                            alt={clube.nome}
                                            onError={(e) => {
                                                e.target.src = fotoClube1
                                            }}
                                        />

                                        <div>
                                            <h4>{clube.nome}</h4>

                                            <p>
                                                {clube.membros}{" "}
                                                {clube.membros === 1 ? "membro" : "membros"}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Você ainda não participa de nenhum clube.</p>
                            )}
                        </div>

                    </div>
                    <div className={styles.divRight}>
                        <div className={styles.divRightTitulo}>
                            <h3>Mais Lidos do Mês</h3>
                            <p>Ver todos</p>
                        </div>

                        {
                            livrosPopulares.slice(0, 5).map((livro) => (
                                <div
                                    key={livro.id}
                                    className={styles.titulos}
                                >
                                    <div
                                        className={styles.livro}
                                        onClick={() =>
                                            navigate(`/livroDetalhe/${livro.id}`)
                                        }
                                    >
                                        <img
                                            src={livro.capa}
                                            alt={livro.titulo}
                                            onError={(e) => {
                                                e.target.src = fotoLivro1
                                            }}
                                        />

                                        <div>
                                            <h4>{livro.titulo}</h4>
                                            <p>{livro.autor}</p>

                                            <div className={styles.avaliacao}>
                                                <div>
                                                    <FontAwesomeIcon
                                                        icon={faStar}
                                                        style={{ color: "rgb(255, 212, 59)" }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faStar}
                                                        style={{ color: "rgb(255, 212, 59)" }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faStar}
                                                        style={{ color: "rgb(255, 212, 59)" }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faStar}
                                                        style={{ color: "rgb(255, 212, 59)" }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faStar}
                                                        style={{ color: "rgb(255, 212, 59)" }}
                                                    />
                                                </div>

                                                <p>Trending</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </div>

    )
}

export default Feed