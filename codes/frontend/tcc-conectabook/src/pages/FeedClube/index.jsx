import Button from "../../components/button";
import Header from "../../components/header";
import Footer from "../../components/footer";

import Input from "../../components/input/index.jsx"

import fotoPessoa1 from "../../assets/fotoPessoa1.jpg"
import fotoClube1 from "../../assets/fotoClube1.jpg"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment } from '@fortawesome/free-solid-svg-icons';

import { useNavigate, useParams } from "react-router-dom";

import "./style.css"

import { useEffect, useState } from "react";
import LeftFeed from "../../components/feed/index.jsx";

export default function FeedClube() {

    const { idClube } = useParams()
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [isAdmin, setIsAdmin] = useState(null)
    const [clube, setClube] = useState(null)

    const [clubesGenero, setClubesGenero] = useState([])

    const [idVinculoMembro, setIdVinculoMembro] = useState(null)



    useEffect(() => {
        async function buscarClubesGenero() {
            if (!clube?.id_genero) return

            const res = await fetch(
                `https://conectabook.azurewebsites.net/v1/conectaBook/clubes/genero/${clube.id_genero}`
            )

            const data = await res.json()

            // remove o próprio clube da lista
            const clubesFiltrados = data.response.filter(
                item => item.id_clube !== Number(idClube)
            )

            setClubesGenero(clubesFiltrados)
        }

        buscarClubesGenero()
    }, [clube, idClube])

    useEffect(() => {
        async function verificarAdmin() {
            const res = await fetch(
                `https://conectabook.azurewebsites.net/v1/conectaBook/membros/clube/${idClube}`
            )

            const data = await res.json()

            // Encontra o usuário atual na lista de membros retornada pela API
            const membro = data.response.find(
                membro =>
                    membro.id_usuario === user?.user?.id_usuario ||
                    membro.id_usuario === user?.user?.id
            )

            setIsAdmin(membro?.administrador === 1)

            // 👉 Salva o id_membros correto que veio no JSON da API
            if (membro) {
                setIdVinculoMembro(membro.id_membros)
            }
        }

        if (user) {
            verificarAdmin()
        }
    }, [user, idClube])

    useEffect(() => {

        const userStorage = JSON.parse(
            localStorage.getItem("user")
        )

        if (userStorage) {
            setUser(userStorage)
        }

    }, [])

    useEffect(() => {
        async function buscarClube() {
            const res = await fetch(`https://conectabook.azurewebsites.net/v1/conectaBook/clubes/${idClube}`)
            const data = await res.json()
            setClube(data.response)
        }
        buscarClube()
    }, [idClube])

    async function sairDoClube() {
        // Se o estado estiver nulo, significa que o id_membros não foi capturado ou ele não pertence ao clube
        if (!idVinculoMembro) {
            alert("Não foi possível encontrar o seu vínculo com este clube.");
            return;
        }

        const confirmar = window.confirm("Tem certeza que deseja sair deste clube?");
        if (!confirmar) return;

        try {
            const res = await fetch(`https://conectabook.azurewebsites.net/v1/conectaBook/membros/${idVinculoMembro}`, {
                method: "DELETE"
            });

            if (res.ok) {
                alert("Você saiu do clube com sucesso.");
                navigate("/feed")
            } else {
                console.log(res)
                alert("Não foi possível sair do clube. Tente novamente mais tarde.");
            }
        } catch (error) {
            console.error("Erro ao tentar sair do clube:", error);
            alert("Erro de conexão com o servidor.");
        }
    }

    console.log(clube)

    return (

        <div className="feedClube-container">
            <Header fotoUser={user?.user?.foto_perfil} />
            <main className="main-container">
                <div className="up-main">
                    <div className="up-left-main">
                        <Button text="Feed" onClick={() => navigate(`/feedClube/${idClube}`)} />
                        <Button text="Membros" onClick={() => navigate(`/membros/${idClube}`)} />
                    </div>
                    {user && !isAdmin && (
                        <button className="btn-sair-clube" onClick={sairDoClube}>
                            Sair do Clube
                        </button>
                    )}
                    {
                        isAdmin && (
                            <Button
                                onClick={() => navigate(`/editarClube/${idClube}`)}
                                text="Editar"
                            />
                        )
                    }
                </div>
                <div className="main-feedClube">

                    <div>
                        <div className="titulo-left-main">
                            <h2>{clube?.nome}</h2>
                            <p>{clube?.total_membros} membros</p>
                        </div>

                        <LeftFeed
                            idClube={idClube}
                            feedUrl={`https://conectabook.azurewebsites.net/v1/conectaBook/mensagem/clube/${idClube}/mensagens/principais`}
                        />

                    </div>



                    <div className="right-main">
                        <div className="sobre">
                            <h3>Sobre</h3>
                            <p>{clube?.sobre}</p>
                        </div>
                        <div className="clubesMesmoGenero">
                            <h3>Clubes do mesmo Gênero</h3>

                            {clubesGenero.map((item) => (
                                <div className="clube-diverso" key={item.id_clube}>
                                    <div className="clube-diferente">
                                        <img
                                            className="imagemClubeMesmoGenero"
                                            src={item.foto}
                                            alt={item.nome}
                                        />

                                        <div className="titulo-clube-diverso">
                                            <p>{item.nome}</p>
                                            <p>{item.total_membros} membros</p>
                                        </div>

                                    </div>

                                    <Button
                                        text="Ver clube"
                                        onClick={() => navigate(`/feedClube/${item.id_clube}`)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}