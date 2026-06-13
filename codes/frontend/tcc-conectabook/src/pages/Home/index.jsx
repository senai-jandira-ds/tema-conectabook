import image from '../../assets/image.png';
import Button from '../../components/button';
import Footer from '../../components/footer';
import hpCapa from '../../assets/hpCapa.png';
import fotoPessoa from '../../assets/fotoPessoa.jpg';
import livro from '../../assets/livro.jpg';
import eventos from '../../assets/eventos.jpg'
import cafeteria from '../../assets/cafeteria.jpeg'
import { useNavigate } from 'react-router-dom'

import HeaderHome from './headerHome';

import './style.css'

const CLUBES_DATA = [
  { id: 1, nome: "Harry Lovers", membros: 700, image: hpCapa },
  { id: 2, nome: "Harry Lovers", membros: 700, image: hpCapa },
  { id: 3, nome: "Harry Lovers", membros: 700, image: hpCapa },
  { id: 4, nome: "Harry Lovers", membros: 700, image: hpCapa }
]

const EVENTOS_DATA = [
  { id: 1, nome: "Bienal de São Paulo", image: eventos },
  { id: 2, nome: "Bienal de São Paulo", image: eventos },
  { id: 3, nome: "Bienal de São Paulo", image: eventos },
]

const CAFETERIA_DATA = [
  { id: 1, nome: "Cafeteria Batatinha", image: cafeteria },
  { id: 2, nome: "Cafeteria Batatinha", image: cafeteria },
  { id: 3, nome: "Cafeteria Batatinha", image: cafeteria },
  { id: 4, nome: "Cafeteria Batatinha", image: cafeteria }
]

const FEEDBACKS_DATA = [
  { id: 1, autor: "Eloa Raposa", feedback: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis natus atque sed eum itaque quas nulla sunt voluptas enim delectus ducimus blanditiis rerum, quam cupiditate. Ex natus maiores voluptatem labore?", livroComentado: "Crime e Castigo - Dostoieviski", image: fotoPessoa },
  { id: 2, autor: "Eloa Raposa", feedback: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis natus atque sed eum itaque quas nulla sunt voluptas enim delectus ducimus blanditiis rerum, quam cupiditate. Ex natus maiores voluptatem labore?", livroComentado: "Crime e Castigo - Dostoieviski", image: fotoPessoa },
  { id: 3, autor: "Eloa Raposa", feedback: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis natus atque sed eum itaque quas nulla sunt voluptas enim delectus ducimus blanditiis rerum, quam cupiditate. Ex natus maiores voluptatem labore?", livroComentado: "Crime e Castigo - Dostoieviski", image: fotoPessoa },
  { id: 4, autor: "Eloa Raposa", feedback: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis natus atque sed eum itaque quas nulla sunt voluptas enim delectus ducimus blanditiis rerum, quam cupiditate. Ex natus maiores voluptatem labore?", livroComentado: "Crime e Castigo - Dostoieviski", image: fotoPessoa }
]

const LIVROS_DATA = [
  { id: 1, autor: "E. K. Johnston", titulo: "A esperança da rainha", image: livro },
  { id: 2, autor: "E. K. Johnston", titulo: "A esperança da rainha", image: livro },
  { id: 3, autor: "E. K. Johnston", titulo: "A esperança da rainha", image: livro },
  { id: 4, autor: "E. K. Johnston", titulo: "A esperança da rainha", image: livro },
  { id: 5, autor: "E. K. Johnston", titulo: "A esperança da rainha", image: livro },
]

function LivroCard({ autor, titulo, image }) {
  return (
    <div className="livro">
      <img src={image} alt="" />
      <h3>{titulo}</h3>
      <p>{autor}</p>
    </div>
  )
}

function ClubeCard({ nome, membros, image }) {
  return (
    <div className="clube">
      <img src={image} alt="Logo Harry Potter" />
      <h3>{nome}</h3>
      <p>{membros} membros</p>
    </div>
  )
}

function FeedbackCard({ nome, feedback, livroComentado, image }) {
  return (
    <div className="opiniao">
      <img src={image} alt="" />
      <div className="infoPessoa">
        <div className="leitorLivro">
          <h3>{nome}</h3>
          <p className='feedbackLivro'>{livroComentado}</p>
        </div>
        <p>{feedback}</p>
      </div>
    </div>
  )

}

function CafeteriaCard({ nome, image }) {
  return (
    <div className="cafeteria">
      <img src={image} alt="" />
      <h3>{nome}</h3>
    </div>
  )
}

function EventoCard({ nome, image }) {
  return (
    <div className="evento">
      <img src={image} alt="" />
      <h3>{nome}</h3>
    </div>
  )
}



function Home() {
  const navigate = useNavigate()
  return (
    <div>
      <HeaderHome />
      <main className='home-main'>
        <div className='info'>
          <div className="textos">
            <h1>ConectaBook: Uma plataforma para conexão de leitores.</h1>
            <p>
              Uma plataforma feita para conectar leitores, descobrir novas histórias e compartilhar experiências através de clubes, avaliações e encontros literários.
            </p>
          </div>


          <div className='buttons'>
            <Button text="Criar Conta" onClick={() => navigate("/cadastro")} />
            <Button text="Fazer Login" onClick={() => navigate('/login')} />
          </div>
        </div>

        <img className='image' src={image} alt="" />

      </main>

      <section className='clubesSection'>
        <div className="clubeText">
          <h2>Encontre um clube que combine com você</h2>
          <Button text={"Ver Clubes"}></Button>
        </div>

        <div className="clubes-home">
          {CLUBES_DATA.map((clube) => (
            <ClubeCard
              key={clube.id}
              nome={clube.nome}
              membros={clube.membros}
              image={clube.image}
            />
          ))}
        </div>
      </section>

      <section className='feedbackSection'>
        <h2>Publique suas opiniões literárias</h2>
        <div className="opinioes">
          {FEEDBACKS_DATA.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              nome={feedback.autor}
              feedback={feedback.feedback}
              livroComentado={feedback.livroComentado}
              image={feedback.image}
            />
          ))}

        </div>
      </section>

      <section className='bookSection'>
        <h2>Veja os livros em destaque no momento</h2>
        <div className="livros">
          {LIVROS_DATA.map((livro) => (
            <LivroCard
              key={livro.id}
              autor={livro.autor}
              titulo={livro.titulo}
              image={livro.image}
            />
          ))}
        </div>
      </section>

      <section className='eventSection'>
        <h2>Veja os Eventos que iram ocorrer</h2>
        <div className="eventos">
          {EVENTOS_DATA.map((evento) => (
            <EventoCard
              key={evento.id}
              nome={evento.nome}
              image={evento.image}
            />
          ))}
        </div>
      </section>

      <section className='cafeteriaSection'>
        <h2>Encontre uma cafeteria para combinar com sua leitura</h2>
        <div className="cafeterias">
          {CAFETERIA_DATA.map((cafeteria) => (
            <CafeteriaCard
              key={cafeteria.id}
              nome={cafeteria.nome}
              image={cafeteria.image}

            />
          ))

          }
        </div>
      </section>

      <Footer/>
    </div>
  )
}

export default Home
