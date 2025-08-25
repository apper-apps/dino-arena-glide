/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B35",
        secondary: "#F7931E", 
        accent: "#00D9FF",
        surface: "#2C3E50",
        background: "#1A252F",
        success: "#27AE60",
        warning: "#F39C12",
        error: "#E74C3C",
        info: "#3498DB"
      },
      fontFamily: {
        display: ["Bungee", "cursive"],
        body: ["Outfit", "sans-serif"]
      },
      animation: {
        "bounce-gentle": "bounce 1s ease-in-out infinite",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shake": "shake 0.5s ease-in-out",
        "float": "float 3s ease-in-out infinite alternate"
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(2px)" }
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "100%": { transform: "translateY(-10px)" }
        }
      }
    },
  },
  plugins: [],
}