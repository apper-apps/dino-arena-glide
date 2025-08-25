import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { useGameContext } from "@/hooks/useGameContext"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"

const GameOverScreen = ({ gameType }) => {
  const { 
    score, 
    coins, 
    highScores, 
    dispatch, 
    saveGameData 
  } = useGameContext()

  const isNewHighScore = score > highScores[gameType]

  useEffect(() => {
    saveGameData()
    if (isNewHighScore) {
      toast.success("New High Score! 🎉")
    }
  }, [saveGameData, isNewHighScore])

  const playAgain = () => {
    dispatch({ type: "START_GAME" })
  }

  const returnToMenu = () => {
    dispatch({ type: "SET_CURRENT_GAME", payload: "menu" })
  }

  const switchGame = () => {
    const otherGame = gameType === "runner" ? "combat" : "runner"
    dispatch({ type: "SET_CURRENT_GAME", payload: otherGame })
    dispatch({ type: "START_GAME" })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-surface rounded-2xl p-8 max-w-md w-full mx-4 border border-accent/20 text-center"
      >
        {/* Game Over Title */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          {isNewHighScore ? (
            <div className="w-20 h-20 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Trophy" size={40} className="text-white" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-gradient-to-r from-error/20 to-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="GamepadIcon" size={40} className="text-gray-400" />
            </div>
          )}
        </motion.div>

        <h2 className="font-display text-3xl text-white mb-2">
          {isNewHighScore ? "New Record!" : "Game Over"}
        </h2>
        
        <p className="font-body text-gray-300 mb-6">
          {gameType === "runner" ? "Dino Runner" : "Combat Arena"}
        </p>

        {/* Score Display */}
        <div className="space-y-4 mb-8">
          <div className="hud-element">
            <div className="flex justify-between items-center">
              <span className="font-body text-gray-300">Final Score</span>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {score.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="hud-element">
            <div className="flex justify-between items-center">
              <span className="font-body text-gray-300">Coins Earned</span>
              <div className="flex items-center gap-2">
                <ApperIcon name="Coins" size={16} className="text-secondary" />
                <span className="font-semibold text-secondary">+{Math.floor(score / 100)}</span>
              </div>
            </div>
          </div>
          
          <div className="hud-element">
            <div className="flex justify-between items-center">
              <span className="font-body text-gray-300">High Score</span>
              <span className="font-semibold text-accent">
                {Math.max(score, highScores[gameType]).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playAgain}
            className="game-button w-full flex items-center justify-center gap-2"
          >
            <ApperIcon name="RotateCcw" size={20} />
            Play Again
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={switchGame}
            className="hud-element w-full py-3 hover:border-accent/50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ApperIcon name={gameType === "runner" ? "Sword" : "Zap"} size={20} />
            Try {gameType === "runner" ? "Combat Arena" : "Dino Runner"}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={returnToMenu}
            className="hud-element w-full py-3 hover:border-gray-500 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ApperIcon name="Home" size={20} />
            Main Menu
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default GameOverScreen