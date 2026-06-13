import { useState } from "react"

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

export function SearchBar({ onCoords, onLoading }) {
    const [cidade, setCidade] = useState('')

    function localizarUsuario() {
        onLoading(true)
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                onCoords(coords.latitude, coords.longitude)
                onLoading(false)
            }
        )
    }

    async function buscarCidade() {
        if (!cidade.trim()) return
        onLoading(true)

        // URL em uma linha só, sem quebras
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(cidade.trim())}.json?access_token=${TOKEN}&language=pt&country=BR&limit=1`

        const res = await fetch(url)
        const data = await res.json()

        // erro de digitação: 'lenght' → 'length'
        if (!data.features.length) {
            alert('Cidade não encontrada.')
            onLoading(false)
            return
        }

        const [lng, lat] = data.features[0].center
        onCoords(lat, lng)
        onLoading(false)
    }

    return (
        <div className="search-bar">
            <button onClick={localizarUsuario}>📍 Perto de mim</button>

            <input
                type="text"
                placeholder="Ex: Campinas, SP"
                value={cidade}
                onChange={e => setCidade(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && buscarCidade()}
            />
            <button onClick={buscarCidade}>Buscar</button>
        </div>
    )
}