import React from "react"
import { motion } from "framer-motion"
import { useGameContext } from "@/hooks/useGameContext"
import ApperIcon from "@/components/ApperIcon"

const GameHUD = () => {
  const { 
    score, 
    coins, 
    lives, 
    level,
    player,
    currentGame,
    dispatch 
  } = useGameContext()

  const pauseGame = () => {
    dispatch({ type: "PAUSE_GAME" })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 p-4"
    >
      <div className="flex justify-between items-start">
        {/* Left side stats */}
        <div className="flex flex-col gap-2">
          <div className="hud-element">
            <div className="flex items-center gap-2">
              <ApperIcon name="Target" size={18} className="text-primary" />
              <span className="font-bold text-lg">{score.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="hud-element">
            <div className="flex items-center gap-2">
              <ApperIcon name="Coins" size={18} className="text-secondary" />
              <span className="font-semibold">{coins}</span>
            </div>
          </div>
          
          {currentGame === "combat" && (
            <div className="hud-element">
              <div className="flex items-center gap-2">
                <ApperIcon name="Heart" size={18} className="text-error" />
                <div className="w-20 h-2 bg-background rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-error to-warning transition-all duration-300"
                    style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm">{player.health}/{player.maxHealth}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex flex-col gap-2">
          <div className="hud-element">
            <div className="flex items-center gap-2">
              <ApperIcon name="Trophy" size={18} className="text-accent" />
              <span className="font-semibold">Level {level}</span>
            </div>
          </div>
          
          {currentGame === "runner" && (
            <div className="hud-element">
              <div className="flex items-center gap-2">
                <ApperIcon name="Shield" size={18} className="text-success" />
                <div className="flex gap-1">
                  {[...Array(lives)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-success rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={pauseGame}
            className="hud-element hover:border-accent/50 transition-all duration-200"
          >
            <ApperIcon name="Pause" size={18} />
          </motion.button>
        </div>
      </div>

      {/* Power-up indicators */}
      {player.powerUps && player.powerUps.length > 0 && (
        <div className="flex justify-center mt-4">
          <div className="flex gap-2">
            {player.powerUps.map((powerUp, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="hud-element px-3 py-1 bg-gradient-to-r from-accent to-info"
              >
                <div className="flex items-center gap-1">
                  <ApperIcon name="Zap" size={14} />
                  <span className="text-sm font-bold">{powerUp.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default GameHUD