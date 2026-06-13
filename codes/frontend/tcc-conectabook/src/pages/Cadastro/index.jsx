
import { useEffect, useState } from "react"
import Input from "../../components/input"
import logo from "../../assets/logoAtualizado.png"
import "./style.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleUser, faUser, faEnvelope, faLock, faCalendar } from "@fortawesome/free-solid-svg-icons"
import Button from "../../components/button"
import Footer from "../../components/footer"

const INPUT_DATA = [
    { id: 1, name: "usuario", label: "Nome de Usuário", placeholder: "Digite seu usuário...", type: "text", required: true, faIcon: faUser },
    { id: 2, name: "nome", label: "Nome Completo", placeholder: "Digite seu nome...", type: "text", required: true, faIcon: faUser },
    { id: 3, name: "email", label: "E-mail", placeholder: "Digite seu e-mail...", type: "email", required: true, faIcon: faEnvelope },
    { id: 5, name: "nascimento", label: "Data de Nascimento", type: "date", required: true, faIcon: faCalendar },
    { id: 4, name: "senha", label: "Senha", placeholder: "Digite sua senha...", type: "password", required: true, faIcon: faLock },
    { id: 6, name: "confirmarSenha", label: "Confirme sua Senha", placeholder: "Confirme sua Senha...", type: "password", required: true, faIcon: faLock },

]

const API_GENEROS = "https://conectabook.azurewebsites.net/v1/conectaBook/generos"
const API_USUARIOS = "https://conectabook.azurewebsites.net/v1/conectaBook/usuarios"
const API_GENERO_USUARIO = "https://conectabook.azurewebsites.net/v1/conectaBook/genero-usuario/multiplos"


function Cadastro() {

    function verificarDuplicados(usuarios, form) {
        const emailExiste = usuarios.some(
            u => u.email === form.email
        )

        if (emailExiste) {
            return "E-mail já cadastrado"
        }

        const usuarioExiste = usuarios.some(
            u => u.nome_usuario === form.usuario
        )

        if (usuarioExiste) {
            return "Nome de usuário já existe"
        }

        return null
    }

    function validarFormulario() {
        const { usuario, nome, email, senha, confirmarSenha, nascimento, generosFavorito } = form

        if (!usuario.trim()) return "Usuário obrigatório"
        if (!nome.trim()) return "Nome obrigatório"
        if (!email.trim()) return "E-mail obrigatório"
        if (!email.includes("@")) return "E-mail inválido"

        if (!nascimento) return "Data de nascimento obrigatória"

        if (!senha || senha.length < 6) return "Senha deve ter no mínimo 6 caracteres"

        if (senha !== confirmarSenha) return "As senhas não coincidem"

        if (generosFavorito.length === 0) return "Selecione pelo menos 1 gênero"

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
            alert(erro)
            return
        }

        try {

            const responseUsuarios = await fetch("https://conectabook.azurewebsites.net/v1/conectaBook/usuarios")
            const dataUsuarios = await responseUsuarios.json()

            const erroDuplicado = verificarDuplicados(dataUsuarios.response, form)

            if (erroDuplicado) {
                alert(erroDuplicado)
                return
            }

            const responseUsuario = await fetch(API_USUARIOS, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: form.nome,
                    nome_usuario: form.usuario,
                    email: form.email,
                    senha: form.senha,
                    data_nascimento: form.nascimento
                })
            })

            const dataUsuario = await responseUsuario.json()


            if (!responseUsuario.ok) {
                throw new Error("Erro ao cadastrar usuário");
            }

            const idUsuario = dataUsuario.usuario_criado.id



            const responseGenero = await fetch(API_GENERO_USUARIO, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_usuario: idUsuario,
                    generos: form.generosFavorito
                })
            }
            )

            if (!responseGenero.ok) {
                throw new Error("Erro ao cadastrar generos");

            }

            alert("Usuario cadastrado com sucesso!")

        } catch (error) {
            console.log(error)
            alert("Erro no servidor")
        }
    }

    function toggleGenero(genero) {


        const lista = form.generosFavorito

        let novaLista

        if (lista.includes(genero)) {
            novaLista = lista.filter(item => item !== genero)
        } else {
            if (lista.length >= 5) return
            novaLista = [...lista, genero]
        }

        setForm({
            ...form,
            generosFavorito: novaLista
        })
    }

    const [form, setForm] = useState({
        usuario: "",
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        nascimento: "",
        generosFavorito: []
    })

    const [generos, setGeneros] = useState([])



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

        <div>
            <header className="header-cadastro">
                <img className="img-header" src={logo} alt="" />
            </header>
            <main className="main-cadastro">
                <div className="titulo-criar-conta">
                    <FontAwesomeIcon icon={faCircleUser} style={{ color: "rgb(123,104,238)", }} size="8x" />
                    <h1>Criar Conta</h1>
                    <p>Preencha os dados abaixo para criar sua conta</p>
                </div>

                <div className="formulario">
                    <form onSubmit={handleSubmit}>
                        <div className="inputs">
                            {INPUT_DATA.map((input) => (
                                <div key={input.id} className="input">
                                    <Input
                                        id={input.id}
                                        name={input.name}
                                        faIcon={input.faIcon}
                                        label={input.label}
                                        placeholder={input.placeholder}
                                        value={form[input.name]}
                                        onChange={handleChange}
                                        type={input.type}
                                        required={input.required}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="generos-favoritos">
                            <h4>Generos Favoritos</h4>
                            <p>Selecione seus generos favoritos (máx 5)</p>

                            <div className="generos-container">
                                {generos.map((genero) => (
                                    <button
                                        key={genero.id_genero}
                                        type="button"
                                        className={`genero-tag ${form.generosFavorito.includes(genero.id_genero)
                                            ? "ativo"
                                            : ""
                                            }`}
                                        onClick={() => toggleGenero(genero.id_genero)}
                                    >
                                        {genero.nome}
                                    </button>
                                ))}
                            </div>

                        </div>
                        <div className="down-cadastro">
                            <Button
                                text="Criar Conta"
                                type="submit"
                            />
                            <div className="link-login">
                                <p>Já tem conta?</p>
                                <a className="link-cadastro" href="/login">Fazer Login</a>
                            </div>
                        </div>

                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Cadastro