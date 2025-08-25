import { useCallback, useEffect, useRef } from "react";
import { useGameContext } from "@/hooks/useGameContext";

export function useGameInput() {
const { currentGame, gameRunning, paused, settings, dispatch } = useGameContext()
  const keysPressed = useRef(new Set())

  const handleInput = useCallback((action, pressed) => {
    if (!gameRunning || paused) return

    const inputEvent = {
      action,
      pressed,
      timestamp: Date.now()
    }

    // Dispatch input to game context
    dispatch({ 
      type: "HANDLE_INPUT", 
      payload: inputEvent
    })
  }, [gameRunning, paused, dispatch])

  const handleKeyDown = useCallback((event) => {
    if (keysPressed.current.has(event.code)) return
    
    keysPressed.current.add(event.code)
    
    let action = null
    
    if (currentGame === "runner") {
      switch (event.code) {
        case "Space":
        case "ArrowUp":
        case "KeyW":
          action = "jump"
          break
        case "ArrowDown":
        case "KeyS":
          action = "duck"
          break
      }
    } else if (currentGame === "combat") {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          action = "up"
          break
        case "ArrowDown":
        case "KeyS":
          action = "down"
          break
        case "ArrowLeft":
        case "KeyA":
          action = "left"
          break
        case "ArrowRight":
        case "KeyD":
          action = "right"
          break
        case "Space":
          action = "attack"
          break
        case "KeyE":
          action = "special"
          break
      }
    }

    // Handle pause
    if (event.code === "Escape") {
      dispatch({ type: "PAUSE_GAME" })
      return
    }

    if (action) {
      event.preventDefault()
      handleInput(action, true)
    }
  }, [currentGame, handleInput, dispatch])
const handleKeyUp = useCallback((event) => {
    keysPressed.current.delete(event.code)
    
    let action = null
    
    if (currentGame === "runner") {
      switch (event.code) {
        case "Space":
        case "ArrowUp":
        case "KeyW":
          action = "jump"
          break
        case "ArrowDown":
        case "KeyS":
          action = "duck"
          break
      }
    } else if (currentGame === "combat") {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          action = "up"
          break
        case "ArrowDown":
        case "KeyS":
          action = "down"
          break
        case "ArrowLeft":
        case "KeyA":
          action = "left"
          break
        case "ArrowRight":
        case "KeyD":
          action = "right"
          break
        case "Space":
          action = "attack"
          break
        case "KeyE":
          action = "special"
          break
      }
    }

    if (action) {
      event.preventDefault()
      handleInput(action, false)
    }
  }, [currentGame, handleInput])

  const handleTouchInput = useCallback((action, pressed) => {
    handleInput(action, pressed)
  }, [handleInput])

  useEffect(() => {
if (!gameRunning) return

    // Check if keyboard controls should be enabled
    const shouldUseKeyboard = settings.controlType === 'desktop' || 
                             (settings.controlType === 'auto' && !isMobile())

    if (shouldUseKeyboard) {
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)
    }

    return () => {
      if (shouldUseKeyboard) {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
      }
    }
  }, [gameRunning, handleKeyDown, handleKeyUp, settings.controlType])

// Helper function to detect mobile devices
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 1)
  }

  return {
    handleTouchInput
  }
}