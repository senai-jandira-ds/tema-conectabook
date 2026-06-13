import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login/index.jsx'
import Home from '../pages/Home/index.jsx'
import Cadastro from '../pages/Cadastro/index.jsx'
import FeedPage from '../pages/feedPage/index.jsx'
import Perfil from '../pages/Perfil/index.jsx'
import Clube from '../pages/Clube/index.jsx'
import CriarClube from '../pages/CriarClube/criarClube.jsx'
import FeedClube from '../pages/FeedClube/index.jsx'
import EditarClube from '../pages/EditarClube/index.jsx'
import MeusClubes from '../pages/MeusClubes/index.jsx'
import Livro from '../pages/livros/index.jsx'
import LivroDetalhe from '../pages/livroDetalhe/index.jsx'
import LivroAvaliacoes from '../pages/livroAvaliacoes/index.jsx'
import Membros from '../pages/Membros/index.jsx'
import Cafeteria from '../pages/cafeteria/index.jsx'
import TodosLivros from '../pages/TodosLivros/index.jsx'
import Estante from '../pages/Estante/index.jsx'

function Rotas() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element ={<Home/>}/>
                <Route path='/login' element ={<Login/>}/>
                <Route path='/cadastro' element ={<Cadastro/>}/>
                <Route path='/feed' element ={<FeedPage/>}/>
                <Route path='/perfil' element ={<Perfil/>}/>
                <Route path='/clube' element ={<Clube/>}/>
                <Route path='/membros/:idClube' element ={<Membros/>}/>
                <Route path='/criarClube' element ={<CriarClube/>}/>
                <Route path='/editarClube' element ={<EditarClube/>}/>
                <Route path='/feedClube/:idClube' element ={<FeedClube/>}/>
                <Route path='/meusClubes' element ={<MeusClubes/>}/>
                <Route path='/livros' element ={<Livro/>}/>
                <Route path='/estante' element ={<Estante/>}/>
                <Route path='/todosLivros' element ={<TodosLivros/>}/>
                <Route path='/livroDetalhe/:id' element ={<LivroDetalhe/>}/>
                <Route path='/livroAvaliacoes' element ={<LivroAvaliacoes/>}/>
                <Route path='/cafeteria' element ={<Cafeteria/>}/>
                <Route path='*' element ={<h1>Not Found</h1>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas