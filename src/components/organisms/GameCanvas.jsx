import React, { useRef, useEffect, forwardRef } from "react"
import { useGameContext } from "@/hooks/useGameContext"
import { useGameEngine } from "@/hooks/useGameEngine"

const GameCanvas = forwardRef(({ gameType }, ref) => {
  const canvasRef = useRef(null)
  const { gameRunning, paused } = useGameContext()
  
  const gameEngine = useGameEngine(canvasRef, gameType)

  useEffect(() => {
    if (ref) {
      ref.current = canvasRef.current
    }
  }, [ref])

  useEffect(() => {
    if (!canvasRef.current || !gameEngine) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Game loop
    let animationId
    const gameLoop = (timestamp) => {
      if (!paused && gameRunning) {
        gameEngine.update(timestamp)
        gameEngine.render(ctx)
      }
      animationId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [gameEngine, gameRunning, paused])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-gradient-to-b from-sky-400 via-sky-200 to-green-200"
      style={{ touchAction: "none" }}
    />
  )
})

GameCanvas.displayName = "GameCanvas"

export default GameCanvas