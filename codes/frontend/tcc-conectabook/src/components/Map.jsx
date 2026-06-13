import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export function Map({ coords, cafes }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const marcadoresRef = useRef([])

  // Inicializa o mapa uma vez
  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-46.6333, -23.5505],
      zoom: 12
    })

    mapRef.current.addControl(new mapboxgl.NavigationControl())

    return () => mapRef.current.remove()
  }, [])

  // Voa para novas coordenadas
  useEffect(() => {
    if (!coords || !mapRef.current) return
    mapRef.current.flyTo({
      center: [coords.lng, coords.lat],
      zoom: 14,
      speed: 1.4
    })
  }, [coords])

  // Atualiza marcadores quando cafes mudam
  useEffect(() => {
    if (!mapRef.current) return

    // Remove marcadores antigos
    marcadoresRef.current.forEach(m => m.remove())
    marcadoresRef.current = []

    cafes.forEach(cafe => {
      const nome = cafe.tags?.name || 'Cafeteria'
      const horario = cafe.tags?.opening_hours || 'Horário não informado'
      const tel = cafe.tags?.phone || ''

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <strong>${nome}</strong><br/>
        <small>${horario}</small><br/>
        ${tel ? `<small>📞 ${tel}</small>` : ''}
      `)

      const marker = new mapboxgl.Marker({ color: '#6F4E37' })
        .setLngLat([cafe.lon, cafe.lat])
        .setPopup(popup)
        .addTo(mapRef.current)

      marcadoresRef.current.push(marker)
    })
  }, [cafes])

  return <div ref={containerRef} style={{ width: '100%', height: '700px', margin: "2rem" }} />
}