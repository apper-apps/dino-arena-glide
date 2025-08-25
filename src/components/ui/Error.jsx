import React from "react"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ 
  message = "Something went wrong!", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
      <div className="text-center max-w-md">
        {/* Error icon */}
        <div className="w-20 h-20 bg-error/20 rounded-full flex items-center justify-center mb-6 mx-auto">
          <ApperIcon name="AlertTriangle" size={40} className="text-error" />
        </div>
        
        {/* Error message */}
        <h2 className="text-2xl font-display text-white mb-4">Game Error</h2>
        <p className="text-gray-300 font-body text-lg mb-8">{message}</p>
        
        {/* Retry button */}
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="game-button inline-flex items-center gap-2"
          >
            <ApperIcon name="RotateCcw" size={20} />
            Try Again
          </button>
        )}
        
        {/* Additional help text */}
        <p className="text-gray-500 font-body text-sm mt-6">
          If the problem persists, try refreshing the page
        </p>
      </div>
    </div>
  )
}

export default Error