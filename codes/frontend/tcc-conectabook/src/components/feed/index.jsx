import Button from "../button";
import Input from "../input";

import Postagem from "../postagem";

import "./style.css"

import userDefault from "../../assets/userDefault.webp"

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LeftFeed({ posts, idConversa, idClube, feedUrl }) {

    const [user, setUser] = useState({})
    const [mensagem, setMensagem] = useState("")
    const [listaPosts, setListaPosts] = useState([])
    const [arquivo, setArquivo] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const fileInputRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const userStorage = JSON.parse(localStorage.getItem("user"))
        if (!userStorage) {
            navigate("/")
        } else {
            setUser(userStorage)
        }
    }, [])

    useEffect(() => {
        carregarPosts()
    }, [])

    async function carregarPosts() {
        try {
            const response = await fetch(feedUrl)
            const data = await response.json()
            const user = JSON.parse(localStorage.getItem("user"))

            const postsComDados = await Promise.all(
                (data.response ?? []).map(async (post) => {
                    try {
                        const [responseCurtidas, responseComentarios] =
                            await Promise.all([
                                fetch(`https://conectabook.onrender.com/v1/conectaBook/curtida/mensagem/${post.id_mensagem}`),
                                fetch(`https://conectabook.onrender.com/v1/conectaBook/mensagem/${post.id_mensagem}/respostas`)
                            ])

                        const dataCurtidas = await responseCurtidas.json()
                        const dataComentarios = await responseComentarios.json()

                        const curtidaUsuario = dataCurtidas.curtidas?.find(
                            (curtida) => curtida.id_usuario === user.user.id
                        )

                        return {
                            ...post,
                            total_curtidas: dataCurtidas.quantidade || 0,
                            total_comentarios: dataComentarios.respostas?.length || 0,
                            curtido: !!curtidaUsuario,
                            id_curtida: curtidaUsuario?.id_curtida || null
                        }
                    } catch (error) {
                        console.log(error)
                        return {
                            ...post,
                            total_curtidas: 0,
                            total_comentarios: 0,
                            curtido: false,
                            id_curtida: null
                        }
                    }
                })
            )

            setListaPosts(postsComDados)
        } catch (error) {
            console.log(error)
        }
    }

    async function handlePost() {
        if (mensagem.trim() === "") return

        const formData = new FormData()
        formData.append("comentario", mensagem)
        formData.append("id_usuario", user.user.id)
        formData.append("id_clube", idClube ?? "")
        if (arquivo) {
            formData.append("arquivo", arquivo)
        }

        try {
            const response = await fetch("https://conectabook.onrender.com/v1/conectaBook/mensagem", {
                method: "POST",
                body: formData
            })

            const data = await response.json()

            if (response.ok) {
                setMensagem("")
                setArquivo(null)
                setPreviewUrl(null)
                await carregarPosts()
            }

            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="left-main">
            <form
                className="input-postagem"
                onSubmit={(e) => {
                    e.preventDefault()
                    handlePost()
                }}
            >
                <div className="inputComFoto">
                    <img src={userDefault} alt="" />
                    <Input
                        placeholder="O que está pensando?"
                        value={mensagem}
                        onChange={(e) => setMensagem(e.target.value)}
                    />
                </div>

                <div className="inputComArquivo">

                    {/* Input nativo escondido */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => {
                            const file = e.target.files[0]
                            setArquivo(file)
                            if (file && file.type.startsWith("image/")) {
                                setPreviewUrl(URL.createObjectURL(file))
                            } else {
                                setPreviewUrl(null)
                            }
                        }}
                        style={{ display: "none" }}
                    />

                    {/* Botão estilizado que aciona o input */}
                    <button
                        type="button"
                        className="upload-btn"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        {arquivo ? arquivo.name : "Anexar arquivo"}
                    </button>

                    {previewUrl && (
                        <div className="preview-container">
                            <img src={previewUrl} alt="Preview" className="preview-imagem" />
                            <button
                                type="button"
                                className="remover-preview"
                                onClick={() => {
                                    setArquivo(null)
                                    setPreviewUrl(null)
                                    fileInputRef.current.value = ""
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <Button text="Postar" type="submit" />
                </div>
            </form>

            {(listaPosts ?? []).map((post) => (
                <Postagem
                    key={post.id_mensagem}
                    post={post}
                    idClube={idClube ?? null}
                />
            ))}
        </div>
    )
}