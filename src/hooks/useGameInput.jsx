import { useCallback, useEffect, useRef } from "react";
import { useGameContext } from "@/hooks/useGameContext";

export function useGameInput() {
  const { currentGame, settings, dispatch } = useGameContext()
  const keysPressed = useRef(new Set())
  
  // Handle keyboard input
  const handleKeyDown = useCallback((event) => {
    const key = event.key.toLowerCase()
    
    // Prevent default for game keys
    const gameKeys = ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'enter', 'shift']
    if (gameKeys.includes(key)) {
      event.preventDefault()
    }
    
    if (keysPressed.current.has(key)) return
    keysPressed.current.add(key)
    
    // Map keys to game inputs based on game type
    if (currentGame === 'runner') {
      switch (key) {
        case ' ':
        case 'arrowup':
        case 'w':
          handleGameInput('jump', true)
          break
        case 'arrowdown':
        case 's':
          handleGameInput('duck', true)
          break
      }
    } else if (currentGame === 'combat') {
      switch (key) {
        case 'arrowup':
        case 'w':
          handleGameInput('up', true)
          break
        case 'arrowdown':
        case 's':
          handleGameInput('down', true)
          break
        case 'arrowleft':
        case 'a':
          handleGameInput('left', true)
          break
        case 'arrowright':
        case 'd':
          handleGameInput('right', true)
          break
        case ' ':
        case 'enter':
          handleGameInput('attack', true)
          break
        case 'shift':
          handleGameInput('special', true)
          break
      }
    }
  }, [currentGame])

  const handleKeyUp = useCallback((event) => {
    const key = event.key.toLowerCase()
    keysPressed.current.delete(key)
    
    // Map key releases to game inputs
    if (currentGame === 'runner') {
      switch (key) {
        case ' ':
        case 'arrowup':
        case 'w':
          handleGameInput('jump', false)
          break
        case 'arrowdown':
        case 's':
          handleGameInput('duck', false)
          break
      }
    } else if (currentGame === 'combat') {
      switch (key) {
        case 'arrowup':
        case 'w':
          handleGameInput('up', false)
          break
        case 'arrowdown':
        case 's':
          handleGameInput('down', false)
          break
        case 'arrowleft':
        case 'a':
          handleGameInput('left', false)
          break
        case 'arrowright':
        case 'd':
          handleGameInput('right', false)
          break
        case ' ':
        case 'enter':
          handleGameInput('attack', false)
          break
        case 'shift':
          handleGameInput('special', false)
          break
      }
    }
  }, [currentGame])

  // Game input handler that processes actual game actions
  const handleGameInput = useCallback((action, pressed) => {
    // Only process if we're in a game
    if (currentGame === 'menu') return
    
    // Handle different game actions
    switch (action) {
      case 'jump':
        if (pressed && currentGame === 'runner') {
          // Implement jump logic
          console.log('Jump action triggered')
        }
        break
      case 'duck':
        if (pressed && currentGame === 'runner') {
          // Implement duck logic
          console.log('Duck action triggered')
        }
        break
      case 'up':
      case 'down':
      case 'left':
      case 'right':
        if (currentGame === 'combat') {
          // Implement movement logic
          console.log(`Movement ${action}: ${pressed}`)
        }
        break
      case 'attack':
        if (pressed && currentGame === 'combat') {
          // Implement attack logic
          console.log('Attack action triggered')
        }
        break
      case 'special':
        if (pressed && currentGame === 'combat') {
          // Implement special attack logic
          console.log('Special attack triggered')
        }
        break
    }
  }, [currentGame])

  // Touch input handler for mobile controls
  const handleInput = useCallback((action, pressed) => {
    handleGameInput(action, pressed)
  }, [handleGameInput])

  // Set up keyboard event listeners
  useEffect(() => {
    const shouldUseKeyboard = () => {
      if (settings.controlType === 'desktop') return true
      if (settings.controlType === 'mobile') return false
      // Auto mode - use keyboard on desktop
      return !isMobile()
    }

    if (shouldUseKeyboard()) {
      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)

      return () => {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
      }
    }
  }, [handleKeyDown, handleKeyUp, settings.controlType])

  // Clean up keys when game changes
  useEffect(() => {
    keysPressed.current.clear()
  }, [currentGame])
// Helper function to detect mobile devices
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 1)
  }

  return {
    handleInput,
    handleGameInput,
    isMobile: isMobile()
  }
}