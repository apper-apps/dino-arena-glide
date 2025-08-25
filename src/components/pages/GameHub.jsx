import React, { useEffect, useRef } from "react";
import { useGameContext } from "@/hooks/useGameContext";
import PauseMenu from "@/components/organisms/PauseMenu";
import MainMenu from "@/components/organisms/MainMenu";
import GameCanvas from "@/components/organisms/GameCanvas";
import TouchControls from "@/components/organisms/TouchControls";
import GameHUD from "@/components/organisms/GameHUD";
import GameOverScreen from "@/components/organisms/GameOverScreen";

const GameHub = () => {
  const { currentGame, gameRunning, paused, settings, loadGameData } = useGameContext()
  const canvasRef = useRef(null)

  useEffect(() => {
    loadGameData()
  }, [loadGameData])

  const isMobile = window.innerWidth <= 768

  const shouldShowTouchControls = () => {
    return isMobile && settings?.touchControls !== false
  }

  return (
    <div className="game-hub w-full h-screen bg-background overflow-hidden game-ui">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/20 to-background"></div>
      
      {currentGame === "menu" && <MainMenu />}
      
      {(currentGame === "runner" || currentGame === "combat") && (
        <>
          <GameCanvas ref={canvasRef} gameType={currentGame} />
          
          {gameRunning && <GameHUD />}
          
          {paused && <PauseMenu />}
          
          {!gameRunning && !paused && currentGame !== "menu" && (
            <GameOverScreen gameType={currentGame} />
          )}
          
{shouldShowTouchControls() && gameRunning && !paused && (
            <TouchControls gameType={currentGame} />
          )}
        </>
      )}
    </div>
  )
}

export default GameHub