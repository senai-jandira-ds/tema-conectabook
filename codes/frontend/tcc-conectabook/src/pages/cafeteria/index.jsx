import { useState } from 'react'
import { Map } from '../../components/Map'
import { SearchBar } from '../../components/SearchBar'
import { CafeCard } from '../../components/CafeCard'
import { useCafes } from '../../hooks/useCafes'

import './style.css'
import Header from '../../components/header'
import Footer from '../../components/footer'

export default function App() {
    const [coords, setCoords] = useState(null)
    const [loadingGeo, setLoadingGeo] = useState(false)
    const { cafes, loading, erro, buscarCafeterias } = useCafes()

    function handleCoords(lat, lng) {
        setCoords({ lat, lng })
        buscarCafeterias(lat, lng)
    }

    return (
        <div>
            <Header />
            <div className="app">
                <h1>☕ Cafeterias por aí</h1>

                <SearchBar onCoords={handleCoords} onLoading={setLoadingGeo} />

                {(loading || loadingGeo) && <p className="status">Buscando...</p>}
                {erro && <p className="status erro">{erro}</p>}
                {!loading && cafes.length > 0 && (
                    <p className="status">{cafes.length} cafeterias encontradas</p>
                )}
                <div className='cafeteriaDiv'>
                    <Map coords={coords} cafes={cafes} />

                    <div className="lista">
                        {cafes.map(cafe => (
                            <CafeCard key={cafe.id} cafe={cafe} />
                        ))}
                    </div>
                </div>


            </div>
            <Footer />
        </div>

    )
}