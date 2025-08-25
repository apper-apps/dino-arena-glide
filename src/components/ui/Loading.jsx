import React from "react"

const Loading = ({ message = "Loading game..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative">
        {/* Animated dino silhouette */}
        <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-lg animate-pulse mb-4"></div>
        
        {/* Loading dots */}
        <div className="flex space-x-2 justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
      </div>
      
      <p className="text-white font-body text-lg mt-6 animate-pulse">{message}</p>
    </div>
  )
}

export default Loading