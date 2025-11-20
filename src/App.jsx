import { useEffect, useState, useCallback } from 'react'
import TopBar from './components/TopBar'
import MapView from './components/MapView'
import SidePanel from './components/SidePanel'

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [game, setGame] = useState(null)
  const [selected, setSelected] = useState(null)
  const [influence, setInfluence] = useState(null)
  const [influenceOn, setInfluenceOn] = useState(false)

  const loadInfluence = useCallback(async (gid) => {
    if (!gid) return
    const res = await fetch(`${baseUrl}/games/${gid}/influence`)
    if (res.ok) {
      setInfluence(await res.json())
    }
  }, [baseUrl])

  const newGame = useCallback(async () => {
    const res = await fetch(`${baseUrl}/games`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ width: 24, height: 24 }) })
    if (res.ok) {
      const g = await res.json()
      setGame(g)
      setSelected(null)
      setInfluence(null)
      setTimeout(() => loadInfluence(g.id), 50)
    }
  }, [baseUrl, loadInfluence])

  const endTurn = useCallback(async () => {
    if (!game?.id) return
    const res = await fetch(`${baseUrl}/games/${game.id}/end-turn`, { method: 'POST' })
    if (res.ok) {
      const g = await res.json()
      setGame(g)
      setTimeout(() => loadInfluence(g.id), 50)
    }
  }, [baseUrl, game, loadInfluence])

  const sendCommand = useCallback(async (cmd) => {
    if (!game?.id) return
    const res = await fetch(`${baseUrl}/games/${game.id}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cmd)
    })
    if (res.ok) {
      await endTurn() // resolve immediately for simplicity
    }
  }, [baseUrl, game, endTurn])

  useEffect(() => {
    // auto create game on load
    newGame()
  }, [newGame])

  const playerFaction = game?.factions?.find(f => f.name === 'Player')

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <TopBar onNewGame={newGame} onEndTurn={endTurn} turn={game?.turn ?? 0} phase={game?.phase ?? 'player'} resources={playerFaction?.resources} influenceOn={influenceOn} setInfluenceOn={setInfluenceOn} />
      <div className="p-4 flex gap-4">
        <div className="overflow-auto rounded border border-slate-800">
          {game ? (
            <MapView game={game} selected={selected} setSelected={setSelected} influence={influence} influenceOn={influenceOn} onCommand={sendCommand} />
          ) : (
            <div className="p-6 text-slate-300">Generating map…</div>
          )}
        </div>
        <SidePanel selected={selected} onCommand={sendCommand} setSelected={setSelected} />
      </div>
    </div>
  )
}

export default App
