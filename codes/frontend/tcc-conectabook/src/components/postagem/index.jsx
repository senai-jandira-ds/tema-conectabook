import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment } from '@fortawesome/free-solid-svg-icons';

import userDefault from "../../assets/userDefault.webp"

import { useState } from 'react';
import Input from '../input';

import "./style.css"

export default function Postagem({ post, idClube }) {

    const [abrirComentario, setAbrirComentario] = useState(false)
    const [comentario, setComentario] = useState("")
    const [comentarios, setComentarios] = useState([])
    const [comentarioRespondendo, setComentarioRespondendo] = useState(null)
    const [textoResposta, setTextoResposta] = useState("")
    const [respostaRespondendo, setRespostaRespondendo] = useState(null)
    const [textoSubResposta, setTextoSubResposta] = useState("")
    const [curtido, setCurtido] = useState(post.curtido || false)
    const [idCurtida, setIdCurtida] = useState(post.id_curtida || null)
    const [curtidas, setCurtidas] = useState(post.total_curtidas || 0)
    const [quantidadeComentarios, setQuantidadeComentarios] = useState(
        post.total_comentarios || 0
    )


    async function responderResposta(idRespostaPai, idComentarioPai) {
        if (!textoSubResposta.trim()) return

        try {
            const user = JSON.parse(localStorage.getItem("user"))

            const formData = new FormData()
            formData.append("comentario", textoSubResposta)
            formData.append("id_usuario", user.user.id)
            formData.append("id_clube", idClube ?? "")
            formData.append("id_mensagem_pai", idRespostaPai)

            const response = await fetch(
                "https://conectabook.onrender.com/v1/conectaBook/mensagem",
                { method: "POST", body: formData }
            )

            const data = await response.json()

            if (data.response) {
                setComentarios((prev) =>
                    prev.map((comentario) => {
                        if (comentario.id_mensagem === idComentarioPai) {
                            return {
                                ...comentario,
                                respostas: comentario.respostas.map((resposta) => {
                                    if (resposta.id_mensagem === idRespostaPai) {
                                        return {
                                            ...resposta,
                                            respostas: [
                                                ...(resposta.respostas || []),
                                                {
                                                    ...data.response,
                                                    nome_usuario: user.user.nome,
                                                    foto_perfil: user.user.foto_perfil
                                                }
                                            ]
                                        }
                                    }
                                    return resposta
                                })
                            }
                        }
                        return comentario
                    })
                )
            }

            setTextoSubResposta("")
            setRespostaRespondendo(null)

        } catch (error) {
            console.log(error)
        }
    }

    async function responderComentario(idComentarioPai) {
        if (!textoResposta.trim()) return

        try {
            const user = JSON.parse(localStorage.getItem("user"))

            const formData = new FormData()
            formData.append("comentario", textoResposta)
            formData.append("id_usuario", user.user.id)
            formData.append("id_clube", idClube ?? "")
            formData.append("id_mensagem_pai", idComentarioPai)

            const response = await fetch(
                "https://conectabook.onrender.com/v1/conectaBook/mensagem",
                { method: "POST", body: formData }
            )

            const data = await response.json()

            if (data.response) {
                setComentarios((prev) =>
                    prev.map((comentario) => {
                        if (comentario.id_mensagem === idComentarioPai) {
                            return {
                                ...comentario,
                                respostas: [
                                    ...(comentario.respostas || []),
                                    {
                                        ...data.response,
                                        nome_usuario: user.user.nome,
                                        foto_perfil: user.user.foto_perfil
                                    }
                                ]
                            }
                        }
                        return comentario
                    })
                )
            }

            setTextoResposta("")
            setComentarioRespondendo(null)

        } catch (error) {
            console.log(error)
        }
    }

    async function buscarComentarios() {
        try {
            const response = await fetch(
                `https://conectabook.onrender.com/v1/conectaBook/mensagem/${post.id_mensagem}/respostas`
            )

            const data = await response.json()

            console.log("respostas brutas:", data)
            const todos = data.respostas

            const mapa = {}
            todos.forEach((item) => {
                mapa[item.id_mensagem] = { ...item, respostas: [] }
            })

            const raizes = []

            todos.forEach((item) => {
                if (item.id_mensagem_pai === post.id_mensagem) {
                    raizes.push(mapa[item.id_mensagem])
                } else if (mapa[item.id_mensagem_pai]) {
                    mapa[item.id_mensagem_pai].respostas.push(mapa[item.id_mensagem])
                }
            })

            setComentarios(raizes)

        } catch (error) {
            console.log(error)
        }
    }

    async function criarComentario() {
        if (!comentario.trim()) return

        try {
            const user = JSON.parse(localStorage.getItem("user"))

            const formData = new FormData()
            formData.append("comentario", comentario)
            formData.append("id_usuario", user.user.id)
            formData.append("id_clube", idClube ?? "")
            formData.append("id_mensagem_pai", post.id_mensagem)

            const response = await fetch(
                "https://conectabook.onrender.com/v1/conectaBook/mensagem",
                { method: "POST", body: formData }
            )

            const data = await response.json()

            if (data.response) {
                setComentarios((prev) => [
                    ...prev,
                    {
                        ...data.response,
                        respostas: []
                    }
                ])

                setQuantidadeComentarios(prev => prev + 1)
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function curtirPost() {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            if (curtido) {
                // 1. Faz o DELETE usando o ID correto salvo no estado
                const response = await fetch(
                    `https://conectabook.onrender.com/v1/conectaBook/curtida/${idCurtida}`,
                    {
                        method: "DELETE"
                    }
                );

                if (response.ok) {
                    setCurtido(false);
                    setIdCurtida(null); // Limpa o ID
                    setCurtidas(prev => prev - 1);
                } else {
                    console.error("Erro ao remover curtida");
                }

            } else {
                // 2. Faz o POST para criar a curtida
                const response = await fetch(
                    "https://conectabook.onrender.com/v1/conectaBook/curtida",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            id_usuario: user.user.id,
                            id_mensagem: post.id_mensagem
                        })
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);

                    setCurtido(true);
                    // CORREÇÃO AQUI: A API retorna o ID na propriedade 'id'
                    setIdCurtida(data.id);
                    setCurtidas(prev => prev + 1);
                } else {
                    console.error("Erro ao curtir post");
                }
            }

        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    }

    return (
        <div className="postagem">

            <img className='fotoPerfilPostagem'
                src={post.foto_perfil || userDefault}
                onError={(e) => { e.target.src = userDefault }}
                alt=""
            />

            <div className="postagem-text">

                <div className="info-post">
                    <h3>{post.nome_usuario}</h3>
                </div>

                <p>{post.comentario}</p>

                {post.arquivo && (
                    <img
                        className="fotoPost"
                        src={post.arquivo}
                        alt=""
                    />
                )}

                <div className="reacoes">
                    <div className="reacao" onClick={curtirPost}>
                        <FontAwesomeIcon
                            className={`icone ${curtido ? "curtido" : ""}`}
                            icon={faHeart}
                        />
                        <p>{curtidas}</p>
                    </div>
                    <div
                        className="reacao"
                        onClick={() => {
                            const novoEstado = !abrirComentario
                            setAbrirComentario(novoEstado)
                            if (novoEstado) buscarComentarios()
                        }}
                    >
                        <FontAwesomeIcon className='icone' icon={faComment} />
                        <p>{quantidadeComentarios}</p>
                    </div>
                </div>

                {abrirComentario && (
                    <div className="area-comentarios">

                        <div className="criar-comentario">
                            <Input
                                type="text"
                                placeholder="Comente algo..."
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") criarComentario() }}
                            />
                            <button onClick={criarComentario}>Comentar</button>
                        </div>

                        {comentarios.map((item) => (
                            <div key={item.id_mensagem}>
                                <div className="comentario">
                                    <img className='fotoPerfilPostagem' src={item.foto_perfil || userDefault} alt="" />
                                    <div>
                                        <h3>{item.nome_usuario}</h3>
                                        <p>{item.comentario}</p>
                                        <button onClick={() => {
                                            setComentarioRespondendo(
                                                comentarioRespondendo === item.id_mensagem ? null : item.id_mensagem
                                            )
                                        }}>
                                            Responder
                                        </button>
                                    </div>
                                </div>

                                {comentarioRespondendo === item.id_mensagem && (
                                    <div style={{ marginLeft: "40px" }}>
                                        <Input
                                            type="text"
                                            placeholder="Responder comentário..."
                                            value={textoResposta}
                                            onChange={(e) => setTextoResposta(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === "Enter") responderComentario(item.id_mensagem) }}
                                        />
                                        <button onClick={() => responderComentario(item.id_mensagem)}>Responder</button>
                                    </div>
                                )}

                                <div style={{ marginLeft: "40px" }}>
                                    {item.respostas?.map((resposta) => (
                                        <div key={resposta.id_mensagem} className="comentario">
                                            <img src={resposta.foto_perfil || userDefault} alt="" />
                                            <div>
                                                <h3>{resposta.nome_usuario}</h3>
                                                <p>{resposta.comentario}</p>
                                                <button onClick={() => {
                                                    setRespostaRespondendo(
                                                        respostaRespondendo === resposta.id_mensagem ? null : resposta.id_mensagem
                                                    )
                                                }}>
                                                    Responder
                                                </button>

                                                {respostaRespondendo === resposta.id_mensagem && (
                                                    <div>
                                                        <Input
                                                            type="text"
                                                            placeholder="Responder resposta..."
                                                            value={textoSubResposta}
                                                            onChange={(e) => setTextoSubResposta(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === "Enter") responderResposta(resposta.id_mensagem, item.id_mensagem)
                                                            }}
                                                        />
                                                        <button onClick={() => responderResposta(resposta.id_mensagem, item.id_mensagem)}>
                                                            Responder
                                                        </button>
                                                    </div>
                                                )}

                                                <div style={{ marginLeft: "40px" }}>
                                                    {resposta.respostas?.map((subResposta) => (
                                                        <div key={subResposta.id_mensagem} className="comentario">
                                                            <img src={subResposta.foto_perfil || userDefault} alt="" />
                                                            <div>
                                                                <h3>{subResposta.nome_usuario}</h3>
                                                                <p>{subResposta.comentario}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}