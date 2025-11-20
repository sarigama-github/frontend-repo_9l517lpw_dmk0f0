import React from 'react'

export default function TopBar({ onNewGame, onEndTurn, turn, phase, resources, influenceOn, setInfluenceOn }) {
  return (
    <div className="w-full flex items-center justify-between p-3 bg-slate-900/60 backdrop-blur border-b border-slate-800 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-white">Malleable War</span>
        <span className="text-sm text-slate-300">Turn {turn} • {phase === 'player' ? 'Your phase' : 'AI phase'}</span>
        <div className="ml-4 text-sm text-slate-200">Food: {resources?.food ?? 0} • Lumber: {resources?.lumber ?? 0}</div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onNewGame} className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm">New Game</button>
        <button onClick={onEndTurn} className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-sm">End Turn</button>
        <label className="ml-3 flex items-center gap-2 text-slate-200 text-sm cursor-pointer">
          <input type="checkbox" checked={influenceOn} onChange={e=>setInfluenceOn(e.target.checked)} />
          Show Influence
        </label>
      </div>
    </div>
  )
}
