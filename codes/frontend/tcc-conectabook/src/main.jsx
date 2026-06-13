import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Rotas from './Routes/Rotas'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <Rotas/>,
)
