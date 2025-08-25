import React from "react"
import { motion } from "framer-motion"
import { useGameContext } from "@/hooks/useGameContext"
import ApperIcon from "@/components/ApperIcon"

const PauseMenu = () => {
  const { dispatch, currentGame, score } = useGameContext()

  const resumeGame = () => {
    dispatch({ type: "PAUSE_GAME" })
  }

  const restartGame = () => {
    dispatch({ type: "START_GAME" })
  }

  const returnToMenu = () => {
    dispatch({ type: "END_GAME", gameType: currentGame })
    dispatch({ type: "SET_CURRENT_GAME", payload: "menu" })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-surface rounded-2xl p-8 max-w-md w-full mx-4 border border-accent/20 text-center"
      >
        <h2 className="font-display text-3xl text-white mb-2">Game Paused</h2>
        <p className="font-body text-gray-300 mb-6">Current Score: {score.toLocaleString()}</p>
        
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resumeGame}
            className="game-button w-full flex items-center justify-center gap-2"
          >
            <ApperIcon name="Play" size={20} />
            Resume
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={restartGame}
            className="hud-element w-full py-3 hover:border-secondary/50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ApperIcon name="RotateCcw" size={20} />
            Restart
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={returnToMenu}
            className="hud-element w-full py-3 hover:border-error/50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ApperIcon name="Home" size={20} />
            Main Menu
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PauseMenu