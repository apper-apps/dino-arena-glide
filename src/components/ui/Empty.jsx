import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No Data Available",
  message = "There's nothing to display right now.",
  actionText = "Get Started",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {/* Empty state icon */}
      <div className="w-20 h-20 bg-surface/50 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-gray-400" />
      </div>
      
      {/* Empty state content */}
      <h3 className="text-xl font-display text-white mb-3">{title}</h3>
      <p className="text-gray-400 font-body mb-8 max-w-sm">{message}</p>
      
      {/* Call to action */}
      {onAction && (
        <button
          onClick={onAction}
          className="game-button inline-flex items-center gap-2"
        >
          <ApperIcon name="Play" size={20} />
          {actionText}
        </button>
      )}
    </div>
  )
}

export default Empty