import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RightClube from "../../components/RightClube";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup, faCalendar, faBook } from '@fortawesome/free-solid-svg-icons';

import Header from "../../components/header/index.jsx"
import Footer from "../../components/footer/index.jsx"

import styles from "../MeusClubes/style.module.css"



const API_CLUBES = "https://conectabook.azurewebsites.net/v1/conectaBook/clubes";
const API_GENEROS = "https://conectabook.azurewebsites.net/v1/conectaBook/generos";

export default function MeusClubes() {
    const navigate = useNavigate();

    const [clubes, setClubes] = useState([]);
    const [filtro, setFiltro] = useState("todos")

    const userStorage = JSON.parse(localStorage.getItem("user"))
    const [generos, setGeneros] = useState([]);

    const [pesquisa, setPesquisa] = useState("");
    const [generoSelecionado, setGeneroSelecionado] = useState("");

    const [clubesMembro, setClubesMembro] = useState([])
    const [clubesAdmin, setClubesAdmin] = useState([])

    useEffect(() => {
        buscarClubes();
    }, []);

    useEffect(() => {
        async function buscarGeneros() {
            const res = await fetch(API_GENEROS);
            const data = await res.json();
            setGeneros(data.response);
        }

        buscarGeneros();
    }, []);

    const clubesFiltrados = clubes.filter((clube) => {
        const generoValido =
            generoSelecionado === "" ||
            clube.genero ==
            generos.find(
                (g) => g.id_genero == generoSelecionado
            )?.nome

        const nomeValido = clube.nome
            .toLowerCase()
            .includes(pesquisa.toLowerCase());

        return generoValido && nomeValido;
    });

    async function participarClube(idClube) {
    }

    async function buscarClubes(tipo = "todos") {
        let url = API_CLUBES
        const idUsuario = userStorage.user.id_usuario || userStorage.user.id


        if (tipo === "todos") {
            const [resMembro, resAdmin] = await Promise.all([
                fetch(`https://conectabook.azurewebsites.net/v1/conectaBook/membros/usuario/${idUsuario}`),
                fetch(`https://conectabook.azurewebsites.net/v1/conectaBook/membros/usuario/${idUsuario}/admin`)
            ])

            const dataMembro = await resMembro.json()
            const dataAdmin = await resAdmin.json()

            setClubesMembro(dataMembro.response || [])
            setClubesAdmin(dataAdmin.response || [])

            const clubesJuntos = [
                ...(dataMembro.response || []),
                ...(dataAdmin.response || [])
            ]

            const clubesUnicos = clubesJuntos.filter(
                (clube, index, self) =>
                    index === self.findIndex(
                        (c) => c.id_clube === clube.id_clube
                    )
            )
            setClubes(clubesUnicos)

            return
        }

        if (tipo === "membro") {
            url = `https://conectabook.azurewebsites.net/v1/conectaBook/membros/usuario/${idUsuario}`
        }

        if (tipo === "admin") {
            url = url = `https://conectabook.azurewebsites.net/v1/conectaBook/membros/usuario/${idUsuario}/admin`
        }

        const res = await fetch(url)
        const data = await res.json()

        setClubes(data.response)
    }
    const totalClubes = [...clubesMembro, ...clubesAdmin].filter(
        (clube, index, self) =>
            index === self.findIndex(
                (c) => c.id_clube === clube.id_clube
            )
    )
    return (
        <div className={styles.paginaDescobrirClubes}>

            <Header />

            <h1 className={styles.titulo}>Meus Clubes</h1>

            <div className={styles.mainClube}>
                <div className={styles.leftClube}>
                    <div className={styles.filtroClubes}>
                        <h3>Filtrar clubes</h3>
                        <div className={`${styles.meuClube} ${filtro === "todos" ? styles.ativo : ""
                            }`}
                            onClick={() => {
                                setFiltro("todos")
                                buscarClubes("todos")
                            }}>
                            <p>Todos os clubes</p>
                            <p>{totalClubes.length}</p>
                        </div>
                        <div
                            className={`${styles.meuClube} ${filtro === "admin" ? styles.ativo : ""
                                }`}
                            onClick={() => {
                                setFiltro("admin")
                                buscarClubes("admin")
                            }}>
                            <p>Sou administrador</p>
                            <p>{clubesAdmin.length}</p>
                        </div>
                        <div className={`${styles.meuClube} ${filtro === "membro" ? styles.ativo : ""
                            }`}
                            onClick={() => {
                                setFiltro("membro")
                                buscarClubes("membro")
                            }}>
                            <p>Participando</p>
                            <p>{clubesMembro.length}</p>
                        </div>
                    </div>

                    <div className={styles.dicasLayout}>
                        <h3>Dicas Rápidas</h3>
                        <div className={styles.dica}>
                            <FontAwesomeIcon icon={faPeopleGroup} />
                            <p>Convide amigos para o clube</p>
                        </div>
                        <div className={styles.dica}>
                            <FontAwesomeIcon icon={faCalendar} />
                            <p>Agende encontros e discussoes</p>
                        </div>
                        <div className={styles.dica}>
                            <FontAwesomeIcon icon={faBook} />
                            <p>Compartilhe leituras e inspirações</p>
                        </div>
                    </div>
                </div>


                <RightClube
                    pesquisa={pesquisa}
                    setPesquisa={setPesquisa}
                    navigate={navigate}
                    generos={generos}
                    generoSelecionado={generoSelecionado}
                    setGeneroSelecionado={setGeneroSelecionado}
                    clubesFiltrados={clubesFiltrados}
                    participarClube={participarClube}
                    meusClubes={true}
                    idsClubesMembro={[...clubesMembro, ...clubesAdmin].map(c => c.id_clube)}
                />
            </div>

            <Footer />

        </div>
    );
}