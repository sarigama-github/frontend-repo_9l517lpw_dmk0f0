import React, { useMemo } from 'react'

const terrainColors = {
  plains: '#3b82f620',
  forest: '#16a34a33',
  fields: '#facc1533',
  mountain: '#47556966',
  water: '#60a5fa55',
}

export default function MapView({ game, selected, setSelected, influence, influenceOn, onCommand }) {
  const w = game?.map?.width ?? 0
  const h = game?.map?.height ?? 0

  const tiles = game?.map?.tiles ?? []

  const getTile = (x, y) => tiles[y * w + x]

  const renderInfluence = (x, y) => {
    if (!influenceOn || !influence) return null
    const i = y * w + x
    const t = influence.threat?.[i] || 0
    const s = influence.safety?.[i] || 0
    const a = influence.attraction?.[i] || 0
    const danger = Math.min(1, t / 6)
    const safe = Math.min(1, s / 6)
    const pull = Math.min(1, a / 4)
    const r = Math.floor(255 * danger)
    const g = Math.floor(255 * safe)
    const b = Math.floor(255 * pull)
    return (
      <div className="absolute inset-0" style={{ backgroundColor: `rgba(${r},${g},${b},0.25)` }} />
    )
  }

  const units = useMemo(() => game?.factions?.flatMap(f => f.units.map(u => ({...u, color: f.color, faction: f.name}))) ?? [], [game])

  const handleTileClick = (x, y) => {
    if (selected?.mode === 'move' && selected.unit) {
      onCommand({ type: 'move', unit_id: selected.unit.id, target: [x, y] })
      setSelected(null)
      return
    }
    if (selected?.mode === 'build' && selected.unit) {
      onCommand({ type: 'build', unit_id: selected.unit.id, payload: { structure: selected.structure } })
      setSelected(null)
      return
    }
    setSelected({ tile: { x, y }, mode: 'tile' })
  }

  const handleUnitClick = (u) => {
    setSelected({ unit: u, mode: 'unit' })
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${w}, 28px)`, gridAutoRows: '28px' }}>
      {Array.from({ length: w * h }).map((_, i) => {
        const x = i % w
        const y = Math.floor(i / w)
        const t = getTile(x, y)
        const isRelic = (x === game.relic_pos[0] && y === game.relic_pos[1])
        return (
          <div key={i} className="relative border border-slate-800" style={{ background: terrainColors[t.terrain] || '#00000022' }} onClick={() => handleTileClick(x, y)}>
            {t.structure === 'bridge' && <div className="absolute inset-1 rounded bg-amber-300/70" />}
            {t.structure === 'wall' && <div className="absolute inset-1 rounded bg-slate-400/80" />}
            {isRelic && <div className="absolute inset-0 flex items-center justify-center text-amber-300">★</div>}
            {renderInfluence(x, y)}
            {units.filter(u => u.x === x && u.y === y).map(u => (
              <div key={u.id} className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); handleUnitClick(u) }}>
                <div className="w-5 h-5 rounded-full border-2" style={{ backgroundColor: u.type === 'worker' ? '#facc15' : u.type === 'infantry' ? '#60a5fa' : u.type === 'catapult' ? '#f97316' : '#ef4444', borderColor: u.color }} title={`${u.type}${u.carried_relic ? ' (Relic)' : ''}`}></div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
