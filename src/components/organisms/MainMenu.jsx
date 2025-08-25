import React, { useState } from "react"
import { motion } from "framer-motion"
import { useGameContext } from "@/hooks/useGameContext"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"

const MainMenu = () => {
  const { highScores, coins, unlockedSkins, dispatch } = useGameContext()
  const [showSettings, setShowSettings] = useState(false)

  const startGame = (gameType) => {
    dispatch({ type: "SET_CURRENT_GAME", payload: gameType })
    dispatch({ type: "START_GAME" })
    toast.success(`Starting ${gameType === "runner" ? "Dino Runner" : "Combat Arena"}!`)
  }

  const menuVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-secondary/10 rounded-full animate-float" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-accent/10 rounded-full animate-float" style={{ animationDelay: "2s" }}></div>
      </div>

      <motion.div
        className="max-w-4xl w-full text-center relative z-10"
        variants={menuVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Title */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="font-display text-6xl md:text-8xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            DINO ARENA
          </h1>
          <p className="font-body text-xl text-gray-300">
            Epic 2-in-1 Gaming Experience
          </p>
        </motion.div>

        {/* Stats Display */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="hud-element">
            <div className="flex items-center gap-2 justify-center">
              <ApperIcon name="Coins" size={20} className="text-secondary" />
              <span>{coins} Coins</span>
            </div>
          </div>
          <div className="hud-element">
            <div className="flex items-center gap-2 justify-center">
              <ApperIcon name="Trophy" size={20} className="text-primary" />
              <span>Runner: {highScores.runner}</span>
            </div>
          </div>
          <div className="hud-element">
            <div className="flex items-center gap-2 justify-center">
              <ApperIcon name="Sword" size={20} className="text-accent" />
              <span>Combat: {highScores.combat}</span>
            </div>
          </div>
        </motion.div>

        {/* Game Selection */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm rounded-2xl p-8 border border-primary/30 cursor-pointer"
            onClick={() => startGame("runner")}
          >
            <ApperIcon name="Zap" size={48} className="text-primary mx-auto mb-4" />
            <h3 className="font-display text-2xl text-white mb-2">Dino Runner</h3>
            <p className="font-body text-gray-300 mb-4">
              Endless running adventure with obstacles and power-ups
            </p>
            <div className="game-button w-full">
              Play Runner
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-accent/20 to-info/20 backdrop-blur-sm rounded-2xl p-8 border border-accent/30 cursor-pointer"
            onClick={() => startGame("combat")}
          >
            <ApperIcon name="Sword" size={48} className="text-accent mx-auto mb-4" />
            <h3 className="font-display text-2xl text-white mb-2">Combat Arena</h3>
            <p className="font-body text-gray-300 mb-4">
              Action-packed battles with multiple weapons and enemies
            </p>
            <div className="game-button w-full">
              Enter Arena
            </div>
          </motion.div>
        </motion.div>

        {/* Menu Actions */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hud-element hover:border-secondary/50 transition-all duration-200"
            onClick={() => setShowSettings(!showSettings)}
          >
            <ApperIcon name="Settings" size={20} className="mr-2" />
            Settings
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hud-element hover:border-accent/50 transition-all duration-200"
          >
            <ApperIcon name="Palette" size={20} className="mr-2" />
            Skins ({unlockedSkins.length})
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hud-element hover:border-primary/50 transition-all duration-200"
          >
            <ApperIcon name="Info" size={20} className="mr-2" />
            How to Play
          </motion.button>
        </motion.div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              className="bg-surface rounded-2xl p-8 max-w-md w-full mx-4 border border-accent/20"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-2xl text-white mb-6">Settings</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-body text-white">Sound Effects</span>
                  <button className="w-12 h-6 bg-primary rounded-full"></button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-white">Background Music</span>
                  <button className="w-12 h-6 bg-primary rounded-full"></button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-white">Difficulty</span>
                  <select className="bg-background text-white px-3 py-1 rounded">
                    <option>Easy</option>
                    <option>Normal</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>
              <button
                className="game-button w-full mt-6"
                onClick={() => setShowSettings(false)}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default MainMenu