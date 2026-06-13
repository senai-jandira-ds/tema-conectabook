import Footer from "../../components/footer";
import Header from "../../components/header";
import Button from "../../components/button";
import Input from "../../components/input";
import ToastContainer from "../../components/ToastContainer"; // 1. Importe o componente (ajuste o caminho se necessário)

import "./style.css"
import { useEffect, useState } from "react";

const INPUT_DATA = [
    { id: 1, name: "nome", label: "Nome do Clube", placeholder: "Digite o name do clube...", type: "text", required: true },
    { id: 2, name: "sobre", label: "Sobre", placeholder: "Descreva o clube...", type: "text", required: true },
    { id: 3, name: "regras", label: "Regras", placeholder: "Descreva as regras do clube...", type: "text", required: true },
]

const API_GENEROS = "https://conectabook.azurewebsites.net/v1/conectaBook/generos"
const API_CLUBES = "https://conectabook.azurewebsites.net/v1/conectaBook/clubes"

export default function CriarClube() {
    // 2. Estado para armazenar os toasts
    const [toasts, setToasts] = useState([])

    const [form, setForm] = useState({
        nome: "",
        sobre: "",
        regras: "",
        id_genero: "",
        foto: null
    })

    const [preview, setPreview] = useState(null)
    const [generos, setGeneros] = useState([])

    // 2. Função auxiliar para disparar o toast
    function showToast(message, type = "success") {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3000)
    }

    function verificarDuplicados(clubes, form) {
        if (!clubes || !Array.isArray(clubes)) return null // <-- adicione isso
    
        const clubeExiste = clubes.some(
            c => c.nome === form.nome
        )
    
        if (clubeExiste) {
            return "Clube já existente"
        }
    
        return null
    }

    function validarFormulario() {
        const { nome, sobre, rules, id_genero } = form // Correção sutil: aqui estava regras, alterado para bater com o estado rules/regras

        if (!form.nome.trim()) return "Nome obrigatório"
        if (!form.sobre.trim()) return "Sobre obrigatório"
        if (!form.regras.trim()) return "Regras obrigatório"
        if (!form.id_genero) return "Gênero obrigatório"

        return null
    }

    function handleChange(e) {
        const { name, value } = e.target

        setForm({
            ...form,
            [name]: value
        })
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const erro = validarFormulario()

        if (erro) {
            showToast(erro, "error") // Substituído alert por showToast
            return
        }

        try {
            const responseClubes = await fetch("https://conectabook.azurewebsites.net/v1/conectaBook/clubes")
            const dataClubes = await responseClubes.json()

            const erroDuplicado = verificarDuplicados(dataClubes.response, form)

            if (erroDuplicado) {
                showToast(erroDuplicado, "error") // Substituído alert por showToast
                return
            }

            console.log(form.foto)

            const formData = new FormData()
            formData.append("nome", form.nome)
            formData.append("sobre", form.sobre)
            formData.append("regras", form.regras)
            formData.append("id_genero", form.id_genero)

            if (form.foto) {
                formData.append("foto", form.foto)
            }

            const responseClube = await fetch(API_CLUBES, {
                method: "POST",
                body: formData
            })

            const data = await responseClube.json()

            console.log("RESPOSTA DA API:", data)

            if (!responseClube.ok || !data.response?.id_clube) {
                throw new Error("Erro ao cadastrar clube");
            }

            const usuario = JSON.parse(localStorage.getItem("user"))
            const idUsuario = usuario?.user?.id_usuario || usuario?.user?.id

            console.log("USUARIO DO LOCALSTORAGE:", usuario)
            console.log("ID USUARIO:", idUsuario)

            const idClube = data.response.id_clube || data.response.id

            console.log({
                id_usuario: idUsuario,
                id_clube: idClube,
                administrador: 1
            })

            const responseMembros = await fetch("https://conectabook.azurewebsites.net/v1/conectaBook/membros", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_usuario: idUsuario,
                    id_clube: idClube,
                    administrador: 1
                })
            })

            if (!responseMembros.ok) {
                throw new Error("Erro ao criar admin do clube");
            }

            showToast("Clube criado com sucesso!") // Substituído alert por showToast

        } catch (error) {
            console.log(error)
            showToast("Erro no servidor ao tentar criar o clube", "error") // Substituído alert por showToast
        }
    }

    function handleFotoChange(e) {
        const file = e.target.files[0]

        if (file) {
            setForm({
                ...form,
                foto: file
            })

            setPreview(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        async function buscarGeneros() {
            try {
                const response = await fetch(API_GENEROS)
                const data = await response.json()

                setGeneros(data.response)
            } catch (error) {
                console.log("Erro ao buscar generos", error)
            }
        }

        buscarGeneros()
    }, [])

    return (
        <div className="container-criarClube">
            <Header />
            <main className="main-criarClube">
                <div className="criarClube-card">

                    <form className="formulario-criarClube" onSubmit={handleSubmit}>
                        <div className="titulo-criarClube">
                            <h2>Criar Clube</h2>
                            <p>Preencha as informações a seguir:</p>
                        </div>
                        <div className="questionario-criarClube">
                            <div className="left-criarClube">
                                <div className="upload-box">
                                    <h2>Foto</h2>
                                    <input
                                        type="file"
                                        id="foto"
                                        accept="image/*"
                                        onChange={handleFotoChange}
                                    />

                                    <label htmlFor="foto" className="upload-label">
                                        {preview ? (
                                            <img src={preview} alt="Preview" className="preview-image" />
                                        ) : (
                                            "+"
                                        )}
                                    </label>
                                </div>

                                <div className="comboBox">
                                    <h2>Genero</h2>
                                    <select name="id_genero" value={form.id_genero} onChange={handleChange}>
                                        <option value="">Selecione uma opção</option>
                                        {generos.map((genero) => (
                                            <option key={genero.id_genero} value={genero.id_genero}>
                                                {genero.nome}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                            </div>

                            <div className="right-criarClube">
                                {INPUT_DATA.map((input) => (
                                    <Input
                                        key={input.id}
                                        id={input.id}
                                        name={input.name}
                                        label={input.label}
                                        placeholder={input.placeholder}
                                        value={form[input.name]}
                                        onChange={handleChange}
                                        type={input.type}
                                        required={input.required}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <Button text={"Criar Clube"} />
                        </div>
                    </form>
                </div>
            </main>
            <Footer />

            {/* 4. O componente container é adicionado aqui na raiz da div principal */}
            <ToastContainer toasts={toasts} />
        </div>
    )
}