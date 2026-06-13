import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Button from "../button";
import Input from "../input";

import "./style.css"

import FotoClubeDefault from "../../assets/group.png";

// Variável para a URL base das imagens na nuvem
const URL_IMAGENS_CLUBES = "https://conectabookstorage.blob.core.windows.net/arquivos-mensagens/clubes/";

export default function RightClube({
    pesquisa,
    setPesquisa,
    navigate,
    generos,
    generoSelecionado,
    setGeneroSelecionado,
    clubesFiltrados,
    participarClube,
    meusClubes = false,
    idsClubesMembro = []
}) {

    return (
        <div className="right-clube">

            <div className="pesquisa">
                <div className="input-clube">
                    <Input
                        placeholder="Procure por um grupo..."
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                    />
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>

                <Button
                    onClick={() => navigate("/criarClube")}
                    text="Criar Clube"
                />
            </div>

            <div className="titulo-filtros">
                <div className="titulos">
                    <h2>Descubra clubes de leitura</h2>
                    <p>Encontre seu próximo clube e faça parte de histórias incríveis.</p>
                </div>

                <select
                    name="genero"
                    value={generoSelecionado}
                    onChange={(e) => setGeneroSelecionado(e.target.value)}
                >
                    <option value="">Todos os generos</option>

                    {generos.map((genero) => (
                        <option
                            key={genero.id_genero}
                            value={genero.id_genero}
                        >
                            {genero.nome}
                        </option>
                    ))}
                </select>
            </div>

            <div className="clubes">
                {clubesFiltrados.map((clube) => {

                    const participaDoClube = idsClubesMembro.includes(clube.id_clube)

                    return (
                        <div className="clube-detalhe" key={clube.id_clube}>


                            <div className="info-left">
                                <img
                                    src={
                                        clube.foto && clube.foto !== "null"
                                            ? clube.foto.startsWith("http")
                                                ? clube.foto
                                                : `${URL_IMAGENS_CLUBES}${clube.foto}`
                                            : FotoClubeDefault
                                    }
                                    alt={clube.nome}
                                />

                                <div className="info-clube">
                                    <div className="left-sobre">
                                        <h3>{clube.nome}</h3>

                                        <div className="p-clube">
                                            <p>{clube.genero}</p>
                                            <p>{clube.membros} membros</p>
                                        </div>

                                        <div className="sobre-clube">
                                            <div className="sobre-clube-text">
                                                <h4>Sobre o clube</h4>
                                                <p className="sobre-text">{clube.sobre}</p>
                                            </div>


                                        </div>
                                    </div>

                                    <div className="button-sobre">
                                        <Button

                                            text={participaDoClube ? "Entrar no Feed" : "Participar do Clube"}
                                            onClick={() => {
                                                if (participaDoClube) {
                                                    navigate(`/feedClube/${clube.id_clube}`)
                                                } else {
                                                    participarClube(clube.id_clube)
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>



                        </div>
                    )
                })}
            </div>

        </div>
    );
}