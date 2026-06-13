import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPeopleGroup, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import Footer from "../../components/footer"
import fotoClube1 from "../../assets/fotoClube1.jpg"
import Button from "../../components/button"
import Input from "../../components/input"
import { useEffect, useState } from "react"
import { Await, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import ToastContainer from '../../components/ToastContainer/index.jsx'

import "./style.css"
import Header from "../../components/header"

import FotoClubeDefault from "../../assets/group.png"
import RightClube from "../../components/RightClube"

const API_GENEROS = "https://conectabook.azurewebsites.net/v1/conectaBook/generos"

// Variável para a URL base das imagens na nuvem
const URL_IMAGENS_CLUBES = "https://conectabookstorage.blob.core.windows.net/arquivos-mensagens/clubes/"

export default function Clube() {

    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const [clubes, setClube] = useState([])
    const [generos, setGenero] = useState([])
    const [generoSelecionado, setGeneroSelecionado] = useState("")
    const API_CLUBES = "https://conectabook.azurewebsites.net/v1/conectaBook/clubes"
    const [pesquisa, setPesquisa] = useState("")
    const [clubeAdmin, setClubeAdmin] = useState([])
    const [clubeMembro, setClubeMembro] = useState([])
    const idsClubesMembro = [
        ...clubeMembro.map(clube => clube.id_clube),
        ...clubeAdmin.map(clube => clube.id_clube)
    ]
    const [toasts, setToasts] = useState([])

    const clubesFiltrados = clubes.filter((clube) => {

        const generoValido =
            generoSelecionado === "" ||
            clube.genero ==
            generos.find(
                (genero) => genero.id_genero == generoSelecionado
            )?.nome

        const nomeValido =
            clube.nome.toLowerCase().includes(pesquisa.toLowerCase())

        return generoValido && nomeValido
    })

    useEffect(() => {
        const userStorage = JSON.parse(localStorage.getItem("user"))

        if (!userStorage) {
            navigate("/")
        } else {
            setUser(userStorage)
        }
    }, [])

    useEffect(() => {
        buscarClubes()
        buscarGeneros()
    }, [])

    useEffect(() => {
        const userStorage = JSON.parse(localStorage.getItem("user"))
        const idUsuario = userStorage.user.id_usuario || userStorage.user.id

        if (idUsuario) {
            buscarClubesAdmin(idUsuario)
            buscarClubesMembro(idUsuario)
        }
    }, [])

    async function buscarClubes() {
        try {
            const response = await fetch(API_CLUBES)
            const data = await response.json()

            setClube(data.response)
        } catch (error) {
            console.log(error)
        }


    }

    function showToast(message, type = "success") {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3000)
    }

    async function buscarGeneros() {
        try {
            const response = await fetch(API_GENEROS)
            const data = await response.json()

            setGenero(data.response)
        } catch (error) {
            console.log(error)
        }
    }

    async function participarClube(idClube) {
        const idUsuario = user.user.id_usuario || user.user.id
        try {
            const response = await fetch("https://conectabook.azurewebsites.net/v1/conectaBook/membros", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_usuario: idUsuario,
                    id_clube: idClube,
                    administrador: 0
                })
            })

            if (!response.ok) throw new Error("Erro ao entrar no clube")

            showToast("Você entrou no clube com sucesso!")
            await buscarClubesMembro(idUsuario)

        } catch (error) {
            console.log(error)
            showToast("Não foi possível entrar no clube", "error")
        }
    }

    const meuClubeAdmin = clubeAdmin?.[clubeAdmin.length - 1] || null
    const meuClubeMembro = clubeMembro?.[0] || null

    async function buscarClubesAdmin(idUsuario) {
        try {
            const response = await fetch(
                `https://conectabook.azurewebsites.net/v1/conectaBook/membros/usuario/${idUsuario}/admin/`
            )

            const data = await response.json()

            setClubeAdmin(data.response)

        } catch (error) {
            console.log("Erro ao buscar clubes admin", error)
        }
    }

    async function buscarClubesMembro(idUsuario) {
        try {
            const response = await fetch(
                `https://conectabook.azurewebsites.net/v1/conectaBook/membros/usuario/${idUsuario}`
            )

            const data = await response.json()

            setClubeMembro(data.response)

        } catch (error) {
            console.log("Erro ao buscar clubes membro", error)
        }
    }

    return (
        <div className="body-feedClube">
            <Header
                fotoUser={user?.user?.foto_perfil} />

            <main className="main-clube">
                <div className="left-clube">
                    <div className="meus-clubes">
                        <div className="titulo-acess">
                            <FontAwesomeIcon icon={faPeopleGroup} />
                            <h2>Clubes faço parte</h2>
                        </div>
                        <div className="clube-acess">
                            {meuClubeMembro ? (
                                <Link
                                    to={`/feedClube/${meuClubeMembro.id_clube}`}
                                    className="clubePage"
                                >
                                    <img
                                        src={
                                            meuClubeMembro.foto && meuClubeMembro.foto !== "null"
                                                ? meuClubeMembro.foto.startsWith("http")
                                                    ? meuClubeMembro.foto
                                                    : `${URL_IMAGENS_CLUBES}${meuClubeMembro.foto}`
                                                : FotoClubeDefault
                                        }
                                        alt={meuClubeMembro.nome}
                                    />
                                    <div className="clube-acess-text">
                                        <h3>{meuClubeMembro.nome}</h3>
                                        <p>{meuClubeMembro.quantiaMembros} membros</p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="empty-state">
                                    <p>Você ainda não participa de nenhum clube</p>
                                    <Button text="Descobrir clubes" onClick={() => navigate("/clubes")} />
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="meus-clubes">
                        <div className="titulo-acess">
                            <FontAwesomeIcon icon={faPeopleGroup} />
                            <h2>Clubes Administro</h2>
                        </div>
                        <div className="clube-acess">
                            {meuClubeAdmin ? (
                                <Link
                                    to={`/feedClube/${meuClubeAdmin.id_clube}`}
                                    className="clubePage"
                                >
                                    <img
                                        src={
                                            meuClubeAdmin.foto && meuClubeAdmin.foto !== "null"
                                                ? meuClubeAdmin.foto.startsWith("http")
                                                    ? meuClubeAdmin.foto
                                                    : `${URL_IMAGENS_CLUBES}${meuClubeAdmin.foto}`
                                                : FotoClubeDefault
                                        }
                                        alt={meuClubeAdmin.nome}
                                    />
                                    <div className="clube-acess-text">
                                        <h3>{meuClubeAdmin.nome}</h3>
                                        <p>{meuClubeAdmin.quantiaMembros} membros</p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="empty-state">
                                    <p>Você ainda não administra nenhum clube</p>
                                    <Button text="Criar clube" onClick={() => navigate("/criarClube")} />
                                </div>
                            )}
                        </div>
                        <Button
                            text={"Ver Todos os clubes"}
                            onClick={() => navigate("/meusClubes")}
                        />
                    </div>

                </div>

                <RightClube
                    pesquisa={pesquisa}
                    setPesquisa={setPesquisa}
                    navigate={navigate}
                    generoSelecionado={generoSelecionado}
                    setGeneroSelecionado={setGeneroSelecionado}
                    generos={generos}
                    clubesFiltrados={clubesFiltrados}
                    participarClube={participarClube}
                    meusClubes={false}
                    idsClubesMembro={idsClubesMembro}
                />
            </main>

            <Footer />
            <ToastContainer toasts={toasts} />
        </div>
    )
}