import Button from "../../components/button";
import Footer from "../../components/footer";
import Header from "../../components/header";
import Input from "../../components/input";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

import fotoClube1 from "../../assets/fotoClube1.jpg"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPeopleGroup, faCalendar } from "@fortawesome/free-solid-svg-icons"

import styles from "./style.module.css"

export default function EditarClube() {

    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const userStorage = JSON.parse(localStorage.getItem("user"))

        if (!userStorage) {
            navigate("/")
        } else {
            setUser(userStorage)
        }
    }, [])
    return (
        <div>
            <Header fotoUser={user?.user?.foto_perfil} />
            <main className={styles.mainEditarClube}>
                <div className={styles.mainOrganizacao}>
                    <div className={styles.ladosMain}>
                        <div className={styles.leftMain}>
                            <div className={styles.leftUpMain}>
                                <h3>Imagem do Clube</h3>
                                <img src={fotoClube1} alt="" />
                                <input type="file" id="meuArquivo" className={styles.inputFile}/>
                                <label for="meuArquivo" class="btn-estilizado">Selecionar Arquivo</label>

                            </div>
                            <div className={styles.leftDownMain}>
                                <div className={styles.infoClube}>
                                    <FontAwesomeIcon icon={faPeopleGroup} />
                                    <div className={styles.infoClubeText}>
                                        <h4>Membros</h4>
                                        <p>40 membros</p>
                                    </div>

                                </div>
                                <div className={styles.infoClube}>
                                    <FontAwesomeIcon icon={faCalendar} />
                                    <div className={styles.infoClubeText}>
                                        <h4>Criado em</h4>
                                        <p>15/03/2024</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className={styles.rightMain}>
                            <div className={styles.rightUpMain}>
                                <div className={styles.input}>
                                    <h3>Nome do Clube</h3>
                                    <Input />
                                </div>

                                <div className={styles.input}>
                                    <h3>Genero</h3>
                                    <select className={styles.select} name="" id="">
                                        <option value="">Mitologia</option>
                                    </select>
                                </div>

                            </div>
                            <div className={styles.RightMeioMain}>
                                <div>
                                    <h3>Regras do Clube de Leitura</h3>
                                    <textarea name="" id=""></textarea>
                                </div>
                                <div>
                                    <h3>Sobre o Clube</h3>
                                    <textarea name="" id=""></textarea>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className={styles.downMain}>
                        <Button text={"Excluir clube"} />
                        <Button text={"Editar Clube"} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}