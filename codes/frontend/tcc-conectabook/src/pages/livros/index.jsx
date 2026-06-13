import Input from "../../components/input"
import styles from "./style.module.css"

import Header from "../../components/header/index.jsx"
import Footer from "../../components/footer/index.jsx"

import Button from "../../components/button/index.jsx"

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CardLivro from "../../components/CardLivro/CardLivro.jsx"

const genres = [
  { id: 1, name: "fantasy", label: "Fantasia" },
  { id: 2, name: "romance", label: "Romance" },
  { id: 3, name: "science_fiction", label: "Ficção Científica" },
  { id: 4, name: "horror", label: "Terror" },
  { id: 5, name: "adventure", label: "Aventura" },
  { id: 6, name: "mystery", label: "Mistério" },
  { id: 7, name: "thriller", label: "Thriller" },
  { id: 8, name: "history", label: "História" },
  { id: 9, name: "biography", label: "Biografia" },
  { id: 10, name: "poetry", label: "Poesia" },
  { id: 11, name: "drama", label: "Drama" },
  { id: 12, name: "comics", label: "Quadrinhos" },
  { id: 13, name: "manga", label: "Mangá" },
  { id: 14, name: "young_adult", label: "Young Adult" },
  { id: 15, name: "children", label: "Infantil" },
  { id: 16, name: "religion", label: "Religião" },
  { id: 17, name: "psychology", label: "Psicologia" },
  { id: 18, name: "philosophy", label: "Filosofia" },
]

export default function Livro() {

  const [books, setBooks] = useState([])
  const [estante, setEstante] = useState([])
  const [estanteLoading, setEstanteLoading] = useState(false)
  const [estanteErro, setEstanteErro] = useState(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Carrega usuário do localStorage
  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem("user"))
    if (userStorage) {
      setUser(userStorage)
    }
  }, [])

  // Busca estante quando o usuário estiver disponível
  useEffect(() => {
    const userId = user?.user?.id
    if (!userId) return

    setEstanteLoading(true)
    setEstanteErro(null)

    fetch(`https://conectabook.azurewebsites.net/v1/conectaBook/estante/usuario/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar estante")
        return res.json()
      })
      .then(data => {
        const lista = Array.isArray(data.estante) ? data.estante : [] 
        setEstante(lista)
      })
      .catch(err => {
        console.error(err)
        setEstanteErro("Não foi possível carregar sua estante.")
      })
      .finally(() => setEstanteLoading(false))
  }, [user])

  // Busca livros em destaque
  useEffect(() => {
    fetch('https://openlibrary.org/trending/daily.json?limit=5')
      .then(res => res.json())
      .then(data => {
        const mapped = data.works
          .filter(book => book.cover_i && book.title)
          .map(book => ({
            key: book.key,
            title: book.title,
            author: book.author_name?.[0] ?? "Autor desconhecido",
            coverUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          }))
        setBooks(mapped)
      })
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm && !selectedGenre) return

    setIsSearching(true)
    setHasSearched(true)

    let query = searchTerm
    if (selectedGenre) query += ` subject:${selectedGenre}`

    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=50`
    )
    const data = await res.json()

    const mapped = data.docs
      .filter(book => book.cover_i && book.title && book.author_name?.[0])
      .map(book => ({
        key: book.key,
        title: book.title,
        author: book.author_name[0],
        coverUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      }))

    setSearchResults(mapped)
    setIsSearching(false)
  }

  return (
    <div className={styles.container}>
      <Header fotoUser={user?.user?.foto_perfil} />
      <div className={styles.main}>
        <div className={styles.upMain}>
          <div className={styles.upMainLeft}>
            <h2>Descubra seu próximo livro</h2>
            <p>
              Encontre histórias, conecte-se com leitores e transforme sua leitura em algo ainda mais especial.
            </p>
          </div>

          <form className={styles.upMainRight} onSubmit={handleSearch}>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={"Digite o nome de um livro"}
            />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">Todos os gêneros</option>
              {genres.map((genero) => (
                <option key={genero.id} value={genero.name}>
                  {genero.label}
                </option>
              ))}
            </select>
            <Button text={"Buscar"} type="submit" />
          </form>
        </div>

        {!hasSearched && (
          <>
            {/* Livros em destaque */}
            <div className={styles.livros}>
              <div className={styles.divMain}>
                <h3>Livros em destaque</h3>
                <Button text={"Ver Todos"} onClick={() => navigate('/todosLivros')} />
              </div>
              <div className={styles.listLivros}>
                {books.map((livro) => (
                  <CardLivro
                    key={livro.key}
                    imagem={livro.coverUrl}
                    titulo={livro.title}
                    autor={livro.author}
                    rota={`/livroDetalhe/${livro.key.split('/works/')[1]}`}
                  />
                ))}
              </div>
            </div>

            {/* Minha estante */}
            <div className={styles.livros}>
              <div className={styles.divMain}>
                <h3>Minha estante</h3>
                <Button text={"Ver Todos"} onClick={() => navigate('/estante')} />
              </div>

              {estanteLoading && <p>Carregando estante...</p>}
              {estanteErro && <p>{estanteErro}</p>}
              {!estanteLoading && !estanteErro && estante.length === 0 && (
                <p>Sua estante está vazia. Adicione livros para vê-los aqui!</p>
              )}

              {!estanteLoading && !estanteErro && estante.length > 0 && (
                <div className={styles.listLivros}>
                  {estante.map((livro) => (
                    <CardLivro
                      key={livro.id_estante}
                      imagem={livro.capa}
                      titulo={livro.titulo}
                      autor={livro.autor}
                      rota={`/livroDetalhe/${livro.id_livro}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {hasSearched && (
          <div className={styles.livros}>
            <div className={styles.divMain}>
              <h3>Resultados da busca</h3>
              <Button text={"Limpar busca"} onClick={() => {
                setHasSearched(false)
                setSearchResults([])
                setSearchTerm("")
                setSelectedGenre("")
              }} />
            </div>
            {isSearching ? (
              <p>Buscando...</p>
            ) : (
              <div className={styles.listLivros}>
                {searchResults.map((livro) => (
                  <CardLivro
                    key={livro.key}
                    imagem={livro.coverUrl}
                    titulo={livro.title}
                    autor={livro.author}
                    rota={`/livroDetalhe/${livro.key.split('/works/')[1]}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}