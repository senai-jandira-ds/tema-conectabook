import './header.css'
import logo from '../../assets/logoAtualizado.png';
import { Link } from 'react-router-dom';

import fotoDefault from "../../assets/userDefault.webp"


function Header({ fotoUser }) {

    return (
        <header className='headerPage'>
            <img className='logo' src={logo} alt="logo" />
            <Link className='a' to="/clube">Clube de Leitura</Link>
            <Link className='a' to="/livros">Livros</Link>
            <Link className='a' to="/feed">Feed</Link>
            <Link className='a' to="/cafeteria">Cafeteria</Link>
            <Link to={"/perfil"} className='user'>
                <img
                    className='fotoUser'
                    src={(fotoUser && fotoUser !== "null" ? fotoUser : null) || fotoDefault}
                    alt=""
                />
            </Link>
        </header>
    )
}

export default Header