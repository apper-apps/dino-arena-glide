import React from "react";
import { motion } from "framer-motion";
import { useGameInput } from "@/hooks/useGameInput";
import { useGameContext } from "@/contexts/GameContext";
import ApperIcon from "@/components/ApperIcon";

const TouchControls = ({ gameType }) => {
  const { handleInput, isMobile } = useGameInput()
  const { settings } = useGameContext()

  // Check if touch controls should be shown
  const shouldShowControls = () => {
    if (settings.controlType === 'mobile') return true
    if (settings.controlType === 'desktop') return false
    // Auto mode - show on mobile devices
    return isMobile
  }

  // Don't render if controls are disabled
  if (!shouldShowControls()) return null

  if (gameType === "runner") {
    return (
      <div className="fixed bottom-4 left-0 right-0 z-40 px-4">
        <div className="flex justify-center gap-8">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onTouchStart={() => handleInput("jump", true)}
            onTouchEnd={() => handleInput("jump", false)}
            onMouseDown={() => handleInput("jump", true)}
            onMouseUp={() => handleInput("jump", false)}
            onMouseLeave={() => handleInput("jump", false)}
            className="w-16 h-16 bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-primary shadow-lg active:scale-90 transition-transform"
          >
            <ApperIcon name="ArrowUp" size={28} className="text-white" />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onTouchStart={() => handleInput("duck", true)}
            onTouchEnd={() => handleInput("duck", false)}
            onMouseDown={() => handleInput("duck", true)}
            onMouseUp={() => handleInput("duck", false)}
            onMouseLeave={() => handleInput("duck", false)}
            className="w-16 h-16 bg-secondary/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-secondary shadow-lg active:scale-90 transition-transform"
          >
            <ApperIcon name="ArrowDown" size={28} className="text-white" />
          </motion.button>
        </div>

        {/* Instructions for desktop users when controls are forced on */}
        {settings.controlType === 'mobile' && !isMobile && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Handy-Modus aktiv • Tastatur: WASD oder Pfeiltasten + Leertaste
            </p>
          </div>
        )}
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
                onMouseDown={() => handleInput("up", true)}
                onMouseUp={() => handleInput("up", false)}
                onMouseLeave={() => handleInput("up", false)}
                className="w-12 h-12 bg-surface/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-accent/30 active:scale-90 transition-transform"
              >
                <ApperIcon name="ArrowUp" size={20} className="text-white" />
              </motion.button>
              <div></div>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onTouchStart={() => handleInput("left", true)}
                onTouchEnd={() => handleInput("left", false)}
                onMouseDown={() => handleInput("left", true)}
                onMouseUp={() => handleInput("left", false)}
                onMouseLeave={() => handleInput("left", false)}
                className="w-12 h-12 bg-surface/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-accent/30 active:scale-90 transition-transform"
              >
                <ApperIcon name="ArrowLeft" size={20} className="text-white" />
              </motion.button>
              <div></div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onTouchStart={() => handleInput("right", true)}
                onTouchEnd={() => handleInput("right", false)}
                onMouseDown={() => handleInput("right", true)}
                onMouseUp={() => handleInput("right", false)}
                onMouseLeave={() => handleInput("right", false)}
                className="w-12 h-12 bg-surface/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-accent/30 active:scale-90 transition-transform"
              >
                <ApperIcon name="ArrowRight" size={20} className="text-white" />
              </motion.button>
              
              <div></div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onTouchStart={() => handleInput("down", true)}
                onTouchEnd={() => handleInput("down", false)}
                onMouseDown={() => handleInput("down", true)}
                onMouseUp={() => handleInput("down", false)}
                onMouseLeave={() => handleInput("down", false)}
                className="w-12 h-12 bg-surface/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-accent/30 active:scale-90 transition-transform"
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
              onMouseDown={() => handleInput("attack", true)}
              onMouseUp={() => handleInput("attack", false)}
              onMouseLeave={() => handleInput("attack", false)}
              className="w-16 h-16 bg-primary/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-primary shadow-lg active:scale-90 transition-transform"
            >
              <ApperIcon name="Sword" size={28} className="text-white" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onTouchStart={() => handleInput("special", true)}
              onTouchEnd={() => handleInput("special", false)}
              onMouseDown={() => handleInput("special", true)}
              onMouseUp={() => handleInput("special", false)}
              onMouseLeave={() => handleInput("special", false)}
              className="w-16 h-16 bg-accent/80 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-accent shadow-lg active:scale-90 transition-transform"
            >
              <ApperIcon name="Zap" size={28} className="text-white" />
            </motion.button>
          </div>
        </div>

        {/* Instructions for desktop users when controls are forced on */}
        {settings.controlType === 'mobile' && !isMobile && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Handy-Modus aktiv • Tastatur: WASD/Pfeile, Leertaste/Enter, Shift
            </p>
          </div>
        )}
      </div>
    )
  }

  return null
}

export default TouchControls