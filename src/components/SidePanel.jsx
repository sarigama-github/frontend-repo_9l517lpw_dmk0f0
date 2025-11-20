import React from 'react'

export default function SidePanel({ selected, onCommand, setSelected }) {
  if (!selected) return (
    <div className="w-64 p-3 text-slate-200">Select a unit or tile.</div>
  )

  const u = selected.unit
  const t = selected.tile

  return (
    <div className="w-64 p-3 space-y-3 text-slate-200">
      {u && (
        <div className="bg-slate-800/60 p-3 rounded border border-slate-700">
          <div className="font-semibold capitalize">{u.type}</div>
          <div className="text-sm text-slate-300">HP: {u.hp}</div>
          <div className="text-sm text-slate-300">Pos: {u.x},{u.y}</div>
          <div className="flex gap-2 mt-2">
            <button className="px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-500" onClick={() => setSelected({ unit: u, mode: 'move' })}>Move</button>
            {u.type === 'worker' && (
              <>
                <button className="px-2 py-1 text-xs rounded bg-amber-600 hover:bg-amber-500" onClick={() => onCommand({ type: 'harvest', unit_id: u.id })}>Harvest</button>
                <button className="px-2 py-1 text-xs rounded bg-emerald-600 hover:bg-emerald-500" onClick={() => setSelected({ unit: u, mode: 'build', structure: 'bridge' })}>Build Bridge</button>
                <button className="px-2 py-1 text-xs rounded bg-slate-600 hover:bg-slate-500" onClick={() => setSelected({ unit: u, mode: 'build', structure: 'wall' })}>Build Wall</button>
              </>
            )}
            {u.type === 'catapult' && (
              <button className="px-2 py-1 text-xs rounded bg-orange-600 hover:bg-orange-500" onClick={() => setSelected({ unit: u, mode: 'bombard' })}>Bombard</button>
            )}
          </div>
        </div>
      )}
      {selected.mode === 'move' && (
        <div className="text-xs text-slate-300">Click a destination tile within the grid. Movement distance is stochastic each resolution.</div>
      )}
      {selected.mode === 'build' && (
        <div className="text-xs text-slate-300">Click the current tile to attempt building a {selected.structure}. Costs lumber.</div>
      )}
      {selected.mode === 'bombard' && (
        <div className="text-xs text-slate-300">Click a target tile 2-4 tiles away to attempt bombardment.</div>
      )}
      {t && (
        <div className="bg-slate-800/60 p-3 rounded border border-slate-700">
          <div className="font-semibold">Tile {t.x},{t.y}</div>
        </div>
      )}
    </div>
  )
}
