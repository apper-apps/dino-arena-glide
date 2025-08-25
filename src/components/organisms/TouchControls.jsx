import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { useGameInput } from "@/hooks/useGameInput"

const TouchControls = ({ gameType }) => {
  const { handleInput } = useGameInput()

  if (gameType === "runner") {
    return (
      <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
        <div className="flex justify-center gap-8">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onTouchStart={() => handleInput("jump", true)}
            onTouchEnd={() => handleInput("jump", false)}
            className="w-16 h-16 bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-primary shadow-lg"
          >
            <ApperIcon name="ArrowUp" size={28} className="text-white" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onTouchStart={() => handleInput("duck", true)}
            onTouchEnd={() => handleInput("duck", false)}
            className="w-16 h-16 bg-secondary/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-secondary shadow-lg"
          >
            <ApperIcon name="ArrowDown" size={28} className="text-white" />
          </motion.button>
        </div>
      </div>
    )
  }

  if (gameType === "combat") {
    return (
      <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
        <div className="flex justify-between items-end">
          {/* Movement pad */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-1">
              <div></div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onTouchStart={() => handleInput("up", true)}
                onTouchEnd={() => handleInput("up", false)}
                className="w-12 h-12 bg-surface/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-accent/30"
              >
                <ApperIcon name="ArrowUp" size={20} className="text-white" />
              </motion.button>
              <div></div>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onTouchStart={() => handleInput("left", true)}
                onTouchEnd={() => handleInput("left", false)}
                className="w-12 h-12 bg-surface/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-accent/30"
              >
                <ApperIcon name="ArrowLeft" size={20} className="text-white" />
              </motion.button>
              <div></div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onTouchStart={() => handleInput("right", true)}
                onTouchEnd={() => handleInput("right", false)}
                className="w-12 h-12 bg-surface/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-accent/30"
              >
                <ApperIcon name="ArrowRight" size={20} className="text-white" />
              </motion.button>
              
              <div></div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onTouchStart={() => handleInput("down", true)}
                onTouchEnd={() => handleInput("down", false)}
                className="w-12 h-12 bg-surface/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-accent/30"
              >
                <ApperIcon name="ArrowDown" size={20} className="text-white" />
              </motion.button>
              <div></div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onTouchStart={() => handleInput("attack", true)}
              onTouchEnd={() => handleInput("attack", false)}
              className="w-16 h-16 bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-primary shadow-lg"
            >
              <ApperIcon name="Sword" size={28} className="text-white" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onTouchStart={() => handleInput("special", true)}
              onTouchEnd={() => handleInput("special", false)}
              className="w-16 h-16 bg-accent/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-accent shadow-lg"
            >
              <ApperIcon name="Zap" size={28} className="text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default TouchControls