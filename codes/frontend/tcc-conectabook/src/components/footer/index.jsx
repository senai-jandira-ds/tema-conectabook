import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebook, faInstagram, faXTwitter } from "@fortawesome/free-brands-svg-icons"
import logoPng from "../../assets/logoAtualizado.png"
import { Link } from "react-router-dom"
import "./style.css"

function Footer() {
    return (
        <div className="footer-conteudo">
                <div className="footer-left">
                    <div className="conectabook-footer">
                        <img className="footer-logo" src={logoPng} alt="" />
                        <p> <span>Conecta</span>Book</p>
                    </div>
                    <p>Conectando leitores, compartilhando histórias e criando comunidades.</p>
                </div>

                <div className="navegacao">
                    <h4>Navegação</h4>
                    <Link className="link-footer" to="/clubeLeitura">Clube de leitura</Link>
                    <Link className="link-footer" to="/livros">Livros</Link>
                    <Link className="link-footer" to="/feed">Feed</Link>
                    <Link className="link-footer" to="/cafeteria">Cafeteria</Link>
                    <Link className="link-footer" to="/eventos">Eventos</Link>
                </div>

                <div className="institucional">
                    <h4>Institucional</h4>
                    <Link className="link-footer" to="/clubeLeitura">Sobre nós</Link>
                    <Link className="link-footer" to="/livros">Privacidade</Link>
                    <Link className="link-footer" to="/feed">Termos de Uso</Link>
                    <Link className="link-footer" to="/cafeteria">Contato</Link>
                    <Link className="link-footer" to="/eventos">Eventos</Link>
                </div>

                <div className="redesSociais">

                    <div className="div-redeSocial">
                        <div className="redeSocial">
                            <FontAwesomeIcon className="icon" icon={faFacebook} />
                        </div>
                        <div className="redeSocial">
                            <FontAwesomeIcon className="icon" icon={faInstagram} />
                        </div>
                        <div className="redeSocial">
                            <FontAwesomeIcon className="icon" icon={faXTwitter} />
                        </div>
                    </div>
                    <div className="copyright">
                        <p>2026 ConectaBook </p>
                        <p>Todos os direitos reservados</p>
                    </div>
                </div>




            </div>
    )
}

export default Footer