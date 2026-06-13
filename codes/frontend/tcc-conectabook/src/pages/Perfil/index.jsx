import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import Header from "../../components/header/index"
import Button from "../../components/button/index"
import Input from "../../components/input/index"
import { Link } from "react-router-dom"
import './style.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook, faStar, faShieldHalved } from "@fortawesome/free-solid-svg-icons"
import { faFacebook, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons"
import Footer from "../../components/footer"

import userDefault from "../../assets/userDefault.webp"

import imageCompression from "browser-image-compression"



function Perfil() {

    const navigate = useNavigate()


    async function handleDelete() {
        try {
            const userStorage = JSON.parse(localStorage.getItem("user"))

            const userId =
                userStorage.user.id ||
                userStorage.user.id_usuario

            const confirmDelete = window.confirm("Tem certeza que deseja excluir sua conta?")

            if (!confirmDelete) return

            const response = await fetch(`https://conectabook.azurewebsites.net/v1/conectaBook/usuarios/${userId}`, {
                method: "DELETE"
            })

            const data = await response.json()

            console.log(data)

            if (data.status) {
                alert("Conta excluída com sucesso")
                localStorage.removeItem("user")
                navigate("/login")
            } else {
                alert("Erro ao excluir usuário")
            }
        } catch (error) {
            console.error(error)
            alert("Erro na requisição")
        }
    }

    async function handleUpdate() {
        try {
            const userStorage = JSON.parse(localStorage.getItem("user"))
    
            const form = new FormData()
            form.append("nome", formData.nome)
            form.append("nome_usuario", formData.username)
            form.append("email", formData.email)
            form.append("data_nascimento", formData.dataNascimento)
    
            if (foto) {
                form.append("foto_perfil", foto)
            }
    
            const userId = userStorage.user.id || userStorage.user.id_usuario
    
            const putResponse = await fetch(
                `https://conectabook.azurewebsites.net/v1/conectaBook/usuarios/${userId}`,
                {
                    method: "PUT",
                    body: form,
                }
            )
    
            //  Verifica antes de tentar parsear JSON
            if (!putResponse.ok) {
                const errorText = await putResponse.text() // lê como texto para não quebrar
                console.error("Erro do servidor:", putResponse.status, errorText)
                alert(`Erro ao atualizar perfil (${putResponse.status})`)
                return
            }
    
            const putData = await putResponse.json()
    
            if (!putData.status) {
                alert("Erro ao atualizar perfil")
                return
            }
    
            const getResponse = await fetch(
                `https://conectabook.azurewebsites.net/v1/conectaBook/usuarios/${userId}`
            )
    
            if (!getResponse.ok) {
                console.error("Erro ao buscar usuário atualizado:", getResponse.status)
                alert("Perfil atualizado, mas não foi possível recarregar os dados.")
                return
            }
    
            const getData = await getResponse.json()
            const userData = getData.response || getData.user || getData
    
            const updatedUser = { ...userStorage, user: userData }
            localStorage.setItem("user", JSON.stringify(updatedUser))
            setUser(updatedUser)
    
            alert("Perfil atualizado com sucesso!")
    
        } catch (error) {
            console.error("Erro no PUT:", error)
            alert("Erro na requisição")
        }
    }

    const [formData, setFormData] = useState({
        username: "",
        nome: "",
        email: "",
        senha: "",
        dataNascimento: "",
        id: ""
    })

    const [foto, setFoto] = useState(null)
    const [preview, setPreview] = useState(null)

    async function handleFotoChange(e) {
        const file = e.target.files[0]

        if (!file) return

        const compressedFile = await imageCompression(file, {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 500,
            useWebWorker: true
        })

        const fileFinal = new File([compressedFile], file.name, {
            type: file.type
        })

        setFoto(fileFinal)

        setPreview(URL.createObjectURL(fileFinal))
        
    }

    const INPUT_DATA = [
        { id: 1, name: "username", label: "Nome de Usuário", placeholder: "Digite seu usuário...", type: "text", required: true },
        { id: 2, name: "nome", label: "Nome Completo", placeholder: "Digite seu nome...", type: "text", required: true },
        { id: 3, name: "email", label: "E-mail", placeholder: "Digite seu e-mail...", type: "email", required: true },
        { id: 5, name: "dataNascimento", label: "Data de Nascimento", type: "date", required: true },
    ]

    const [user, setUser] = useState(null)

    useEffect(() => {
        const userStorage = JSON.parse(localStorage.getItem("user"))

        if (userStorage) {

            setUser(userStorage)
            


            setFormData({
                username: userStorage.user.nome_usuario || "",
                nome: userStorage.user.nome || "",
                email: userStorage.user.email || "",
                senha: "",
                dataNascimento: userStorage.user.data_nascimento
                    ? userStorage.user.data_nascimento.split("T")[0]
                    : "",
                id: userStorage.user.id_usuario || ""
            })
        }
    }, [])

    function handleChange(e) {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }



    return (
        <div>
            <Header
                fotoUser={user?.user?.foto_perfil}
            />
            <div className="up-perfil">
                <h1>Perfil</h1>
                <Button
                    text={"Editar Perfil"} onClick={handleUpdate} />
            </div>

            <div className="down-perfil">
                <div className="left-perfil">
                    <div className="user-icon">
                        <img className="img-user"
                            src={preview || user?.user?.foto_perfil || userDefault}
                            alt="Foto do usuário"
                        />

                        <input type="file"
                            accept="image/*"
                            onChange={handleFotoChange} />


                        <h2>{user?.user.nome}</h2>
                        <p>@{user?.user.nome_usuario}</p>
                    </div>


                    <div className="excluir-conta">
                        <Button className="button-excluir" onClick={handleDelete} text={"Excluir Conta"} />
                        <p>Essa ação não pode ser desfeita</p>
                    </div>


                </div>

                <div className="right-perfil">
                    <div className="apresentacao-perfil">
                        <h2>Olá, {user?.user.nome}</h2>
                        <p>Bem vindo á sua conta ConectaBook.</p>
                    </div>

                    <br />
                    <div className="inputs-perfil">
                        {INPUT_DATA.map((input) => (
                            <div key={input.id} className="input-perfil">
                                <Input
                                    name={input.name}
                                    label={input.label}
                                    placeholder={input.placeholder}
                                    value={formData[input.name]}
                                    onChange={handleChange}
                                    type={input.type}
                                    required={input.required}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="seguranca">
                        <FontAwesomeIcon className="icone-perfil" icon={faShieldHalved} />
                        <div className="seguranca-text">
                            <h4>Seus dados estão seguros</h4>
                            <p>Não compartilhe suas informações com terceiros</p>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />


        </div>
    )

}

export default Perfil