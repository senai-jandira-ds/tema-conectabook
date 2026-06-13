import fotoPessoa1 from "../../assets/fotoPessoa1.jpg"
import Button from "../../components/button"
import Footer from "../../components/footer"
import Header from "../../components/header"

import userDefault from "../../assets/userDefault.webp"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCrown } from '@fortawesome/free-solid-svg-icons';

import styles from "./style.module.css"

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Membros() {
    const MEMBROS_DATA = [
        { id: 1, nome: "José Eduardo", administrador: "Membro", foto: fotoPessoa1 },
        { id: 2, nome: "Ana Clara", administrador: "Administrador", foto: fotoPessoa1 },
        { id: 3, nome: "Lucas Henrique", administrador: "Membro", foto: fotoPessoa1 },
        { id: 4, nome: "Mariana Souza", administrador: "Membro", foto: fotoPessoa1 },
        { id: 5, nome: "Pedro Augusto", administrador: "Administrador", foto: fotoPessoa1 },
        { id: 6, nome: "Fernanda Lima", administrador: "Membro", foto: fotoPessoa1 },
        { id: 7, nome: "Carlos Eduardo", administrador: "Membro", foto: fotoPessoa1 },
        { id: 8, nome: "Juliana Martins", administrador: "Administrador", foto: fotoPessoa1 },
        { id: 9, nome: "Rafael Costa", administrador: "Membro", foto: fotoPessoa1 },
        { id: 10, nome: "Beatriz Almeida", administrador: "Administrador", foto: fotoPessoa1 },
        { id: 11, nome: "Thiago Oliveira", administrador: "Membro", foto: fotoPessoa1 },
        { id: 12, nome: "Camila Ferreira", administrador: "Membro", foto: fotoPessoa1 },
        { id: 13, nome: "Gabriel Santos", administrador: "Membro", foto: fotoPessoa1 },
        { id: 14, nome: "Larissa Rocha", administrador: "Administrador", foto: fotoPessoa1 },
        { id: 15, nome: "Matheus Silva", administrador: "Membro", foto: fotoPessoa1 }
    ]


    const { idClube } = useParams()

    const [membros, setMembros] = useState([])

    const [user, setUser] = useState(null)

    const [isAdmin, setIsAdmin] = useState(null)
    const [clube, setClube] = useState(null)

    useEffect(() => {
        async function verificarAdmin() {
            const res = await fetch(
                `https://conectabook.azurewebsites.net/v1/conectaBook/membros/clube/${idClube}`
            )

            const data = await res.json()

            const membro = data.response.find(
                membro =>
                    membro.id_usuario === user?.user?.id_usuario ||
                    membro.id_usuario === user?.user?.id
            )

            setIsAdmin(membro?.administrador === 1)
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
        async function buscarMembros() {
            const res = await fetch(`https://conectabook.azurewebsites.net/v1/conectaBook/membros/clube/${idClube}`)
            const data = await res.json()
            console.log(data)
            setMembros(data.response)
        }
        buscarMembros()
    }, [idClube])

    const navigate = useNavigate()
    return (
        <div className={styles.container}>
            <Header fotoUser={user?.user?.foto_perfil} />
            <main className={styles.mainMembro}>
                <div className={styles.membrosButton}>
                    <div className={styles.buttons}>
                        <Button text="Feed" onClick={() => navigate(`/feedClube/${idClube}`)} />
                        <Button text="Membros" onClick={() => navigate(`/membros/${idClube}`)} />
                    </div>
                    {
                        isAdmin && (
                            <Button
                                onClick={() => navigate(`/editarClube/${idClube}`)}
                                text="Editar"
                            />
                        )
                    }
                </div>

                <div className={styles.titulo}>
                    <i></i>
                    <h2>Membros do Clube - {membros[0]?.nome_clube}</h2>
                    <p>Veja todos os membros do clube e sua função</p>
                    <hr />
                </div>
                
                <div className={styles.membros}>
                    {membros.map((membro) => (
                        <div className={styles.membro}>
                            <img src={membro.foto_perfil || userDefault} alt="" />
                            <div>
                                <h3>{membro.nome_usuario}</h3>
                                <p>{membro.administrador}</p>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faCrown} />
                                <FontAwesomeIcon icon={faTrash} />
                            </div>
                        </div>
                    ))}
                </div>

            </main>
            <Footer />
        </div>
    )
}