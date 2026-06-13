export function CafeCard({ cafe }) {
  const nome = cafe.tags?.name || 'Cafeteria sem nome'
  const horario = cafe.tags?.opening_hours || '—'
  const tel = cafe.tags?.phone || '—'
  const site = cafe.tags?.website

  return (
    <div className="cafe-card">
      <h3>{nome}</h3>
      <p>🕐 {horario}</p>
      <p>📞 {tel}</p>
      {site && <a className="tagCafeteria" href={site} target="_blank" rel="noreferrer">🌐 Site</a>}
    </div>
  )
}