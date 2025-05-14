import './App.css'
import GameBoard from './components/board/GameBoard'
import { Home } from './components/home/Home'
import { useState } from 'react'
import { GameProvider } from './contexts/GameContext'
import { useGame } from './hooks/useGame'

function App() {
  const [gameStarted, setGameStarted] = useState(false)

  const handleStartGame = () => {
    setGameStarted(true);
  }

  return (
    <GameProvider>
      <main>
        {/* <GameBoard /> */}
        {gameStarted ? (
          <GameWrapper />
        ): (
          <Home onStartGame={handleStartGame} />  
        )}
        {/* <Home /> */}
      </main>
    </GameProvider>
  )
}

function GameWrapper() {
  const { level } = useGame();
  return <GameBoard level={level} />
}

export default App
