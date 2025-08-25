import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import GameHub from "@/components/pages/GameHub"
import { GameProvider } from "@/hooks/useGameContext"

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<GameHub />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            className="toast-container"
          />
        </div>
      </BrowserRouter>
    </GameProvider>
  )
}

export default App