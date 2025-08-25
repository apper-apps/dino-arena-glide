import React, { createContext, useContext, useReducer, useCallback } from "react"

const GameContext = createContext()

const INITIAL_STATE = {
  currentGame: "menu",
  gameRunning: false,
  paused: false,
  score: 0,
  coins: 0,
  lives: 3,
  level: 1,
  highScores: {
    runner: 0,
    combat: 0
  },
  unlockedSkins: ["default"],
  currentSkin: "default",
  settings: {
    soundEnabled: true,
    musicEnabled: true,
    difficulty: "normal"
  },
  player: {
    x: 0,
    y: 0,
    health: 100,
    maxHealth: 100,
    speed: 5,
    powerUps: []
  },
  gameObjects: {
    obstacles: [],
    enemies: [],
    collectibles: [],
    projectiles: []
  }
}

function gameReducer(state, action) {
  switch (action.type) {
    case "SET_CURRENT_GAME":
      return { ...state, currentGame: action.payload }
    
    case "START_GAME":
      return { 
        ...state, 
        gameRunning: true, 
        paused: false,
        score: 0,
        coins: state.coins,
        lives: 3,
        player: {
          ...INITIAL_STATE.player,
          health: 100,
          maxHealth: 100
        },
        gameObjects: {
          obstacles: [],
          enemies: [],
          collectibles: [],
          projectiles: []
        }
      }
    
    case "PAUSE_GAME":
      return { ...state, paused: !state.paused }
    
    case "END_GAME":
      const newHighScore = action.gameType === "runner" 
        ? Math.max(state.highScores.runner, state.score)
        : Math.max(state.highScores.combat, state.score)
      
      return {
        ...state,
        gameRunning: false,
        paused: false,
        highScores: {
          ...state.highScores,
          [action.gameType]: newHighScore
        }
      }
    
    case "UPDATE_SCORE":
      return { ...state, score: state.score + action.payload }
    
    case "UPDATE_COINS":
      return { ...state, coins: state.coins + action.payload }
    
    case "UPDATE_PLAYER":
      return { 
        ...state, 
        player: { ...state.player, ...action.payload } 
      }
    
    case "UPDATE_GAME_OBJECTS":
      return {
        ...state,
        gameObjects: { ...state.gameObjects, ...action.payload }
      }
    
    case "UNLOCK_SKIN":
      if (!state.unlockedSkins.includes(action.payload)) {
        return {
          ...state,
          unlockedSkins: [...state.unlockedSkins, action.payload]
        }
      }
      return state
    
    case "SET_CURRENT_SKIN":
      return { ...state, currentSkin: action.payload }
    
    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
    
    case "LOAD_SAVED_DATA":
      return { ...state, ...action.payload }
    
    default:
      return state
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE)

const saveGameData = useCallback(() => {
    const dataToSave = {
      highScores: state.highScores,
      unlockedSkins: state.unlockedSkins,
      currentSkin: state.currentSkin,
      coins: state.coins,
      settings: state.settings
    }
    localStorage.setItem("dinoArenaData", JSON.stringify(dataToSave))
  }, [state.highScores, state.unlockedSkins, state.currentSkin, state.coins, state.settings])

  const loadGameData = useCallback(() => {
    try {
      const savedData = localStorage.getItem("dinoArenaData")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        dispatch({ type: "LOAD_SAVED_DATA", payload: parsedData })
      }
    } catch (error) {
      console.error("Error loading saved data:", error)
    }
  }, [])

  const contextValue = {
    ...state,
    dispatch,
    saveGameData,
    loadGameData
  }

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}