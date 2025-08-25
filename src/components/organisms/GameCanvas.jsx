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
// Initialize canvas and start game engine
    const canvas = ref.current
    if (!canvas) return

    // Set canvas size to fill container
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Enable high DPI support
    const ctx = canvas.getContext('2d')
    const devicePixelRatio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * devicePixelRatio
    canvas.height = rect.height * devicePixelRatio
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    
    ctx.scale(devicePixelRatio, devicePixelRatio)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
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
      if (!paused && gameRunning && gameEngine) {
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
  }, [gameRunning, paused])

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