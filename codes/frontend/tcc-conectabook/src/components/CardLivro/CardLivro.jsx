import Button from "../button"
import styles from "./style.module.css"
import { useNavigate } from "react-router-dom"

export default function CardLivro({
    imagem,
    titulo,
    autor,
    avaliacao,
    rota
}) {

    const navigate = useNavigate()

    return (
        <div className={styles.livro}>
            <img
                src={imagem}
                alt={titulo}
                onError={(e) => {
                    e.target.src = "/sem-capa.png"
                }}
            />

            <h4>{titulo}</h4>

            <p>{autor}</p>

            {avaliacao && (
                <p>⭐ {avaliacao}</p>
            )}

            <Button
                text={"Ver Livro"}
                className={styles.button}
                onClick={() => navigate(rota)}
            />
        </div>
    )
}