import { useState } from "react";

export function useCafes() {
    const [cafes, setCafes] = useState([])
    const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState(null)

    async function buscarCafeterias(lat, lng, raio = 1500) {
        setLoading(true)
        setErro(null)

        const query = `
        [out:json][timeout:15];
      node["amenity"="cafe"](around:${raio},${lat},${lng});
      out body;
      `

      try {
        const res = await fetch('https://overpass-api.de/api/interpreter',{
            method:'POST',
            body: new URLSearchParams({data:query})
        })
        const data = await res.json()
        setCafes(data.elements.filter(c => c.lat && c.lon))
      } catch (error) {
        setErro('Erro ao buscar cafeterias. Tente novamente.')
      } finally{
        setLoading(false)
      }
    }

    return{cafes, loading, erro, buscarCafeterias}
}