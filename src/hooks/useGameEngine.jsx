import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGameContext } from "@/hooks/useGameContext";

export function useGameEngine(canvasRef, gameType) {
  const {
    gameRunning,
    paused,
    score,
    level,
    player,
    gameObjects,
    dispatch
  } = useGameContext()

  const animationRef = useRef(null)
  const lastTimeRef = useRef(0)
  const gameState = useRef({
    initialized: false,
    inputState: {},
    entities: {
      player: {
        x: 100,
        y: 300,
        width: 40,
        height: 40,
        velocityY: 0,
        velocityX: 0,
        onGround: true,
        health: 100,
        maxHealth: 100,
        speed: 5,
        jumpPower: 15,
        color: "#FF6B35"
      }
    },
    obstacles: [],
    enemies: [],
    collectibles: [],
    projectiles: [],
    particles: [],
    camera: { x: 0, y: 0 },
    background: { x: 0 }
  })

  useEffect(() => {
    const handleInput = (event) => {
      if (event.type === "HANDLE_INPUT") {
        gameState.current.inputState[event.payload.action] = event.payload.pressed
      }
    }

    // Listen for input events from context
    const unsubscribe = () => {} // In a real implementation, this would be context subscription
    return unsubscribe
  }, [])

  // Initialize game
  const initGame = useCallback(() => {
    if (!gameRunning) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Reset game state
    gameState.current.entities.player = {
      x: 100,
      y: canvas.height - 140,
      width: 40,
      height: 40,
      velocityY: 0,
      velocityX: 0,
      onGround: true,
      health: 100,
      maxHealth: 100,
      speed: gameType === "combat" ? 8 : 5,
      jumpPower: gameType === "runner" ? 15 : 12,
      color: "#FF6B35"
    }

    gameState.current.obstacles = []
    gameState.current.enemies = []
    gameState.current.collectibles = []
    gameState.current.projectiles = []
    gameState.current.particles = []
    gameState.current.camera = { x: 0, y: 0 }
    gameState.current.background = { x: 0 }
    gameState.current.initialized = true

    dispatch({ type: "UPDATE_PLAYER", payload: gameState.current.entities.player })
  }, [gameRunning, gameType, dispatch, canvasRef])

  // Spawn obstacles
  const spawnObstacle = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const obstacle = {
      id: Date.now() + Math.random(),
      x: canvas.width + 50,
      y: gameType === "runner" ? canvas.height - 140 : Math.random() * (canvas.height - 200) + 100,
      width: 30 + Math.random() * 20,
      height: 30 + Math.random() * 20,
      speed: 3 + level * 0.5,
      color: "#E74C3C"
    }

    gameState.current.obstacles.push(obstacle)
  }, [gameType, level, canvasRef])

  // Spawn collectibles
  const spawnCollectible = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const collectible = {
      id: Date.now() + Math.random(),
      x: canvas.width + 50,
      y: Math.random() * (canvas.height - 200) + 100,
      width: 20,
      height: 20,
      speed: 2 + level * 0.3,
      type: Math.random() > 0.7 ? "coin" : "powerup",
      color: "#F7931E",
      rotation: 0
    }

    gameState.current.collectibles.push(collectible)
  }, [level, canvasRef])

  // Spawn enemies (combat mode)
  const spawnEnemy = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || gameType !== "combat") return

    const enemy = {
      id: Date.now() + Math.random(),
      x: canvas.width + 50,
      y: Math.random() * (canvas.height - 200) + 100,
      width: 35,
      height: 35,
      speed: 2 + level * 0.4,
      health: 50,
      color: "#8E44AD",
      lastAttack: 0
    }

    gameState.current.enemies.push(enemy)
  }, [gameType, level, canvasRef])

  // Create particle
  const createParticle = useCallback((x, y, color = "#FF6B35", count = 5) => {
    for (let i = 0; i < count; i++) {
      gameState.current.particles.push({
        x,
        y,
        velocityX: (Math.random() - 0.5) * 8,
        velocityY: (Math.random() - 0.5) * 8 - 2,
        life: 1,
        decay: 0.02,
        color,
        size: Math.random() * 4 + 2
      })
    }
  }, [])

  // Update game entities
  const updateEntities = useCallback((deltaTime) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const entities = gameState.current.entities
    const player = entities.player
    const groundY = canvas.height - 100

    // Update player physics
    if (gameType === "runner") {
      // Jump logic
      if (gameState.current.inputState.jump && player.onGround) {
        player.velocityY = -player.jumpPower
        player.onGround = false
        createParticle(player.x, player.y + player.height, "#00D9FF", 3)
      }

      // Duck logic
      if (gameState.current.inputState.duck && player.onGround) {
        player.height = 20
        player.y = groundY - player.height
      } else if (!gameState.current.inputState.duck) {
        player.height = 40
        if (player.onGround) player.y = groundY - player.height
      }

      // Gravity
      player.velocityY += 0.8
      player.y += player.velocityY

      // Ground collision
      if (player.y + player.height >= groundY) {
        player.y = groundY - player.height
        player.velocityY = 0
        player.onGround = true
      }
    } else if (gameType === "combat") {
      // Combat movement
      const moveSpeed = player.speed
      
      if (gameState.current.inputState.up) player.velocityY = -moveSpeed
      else if (gameState.current.inputState.down) player.velocityY = moveSpeed
      else player.velocityY *= 0.8

      if (gameState.current.inputState.left) player.velocityX = -moveSpeed
      else if (gameState.current.inputState.right) player.velocityX = moveSpeed
      else player.velocityX *= 0.8

      player.x += player.velocityX
      player.y += player.velocityY

      // Boundary checks
      player.x = Math.max(0, Math.min(canvas.width - player.width, player.x))
      player.y = Math.max(0, Math.min(canvas.height - player.height, player.y))
    }

    // Update obstacles
    gameState.current.obstacles = gameState.current.obstacles.filter(obstacle => {
      obstacle.x -= obstacle.speed
      return obstacle.x + obstacle.width > -50
    })

    // Update collectibles
    gameState.current.collectibles = gameState.current.collectibles.filter(collectible => {
      collectible.x -= collectible.speed
      collectible.rotation += 0.1
      return collectible.x + collectible.width > -50
    })

    // Update enemies
    gameState.current.enemies = gameState.current.enemies.filter(enemy => {
      enemy.x -= enemy.speed
      
      // Simple AI - move towards player
      if (gameType === "combat") {
        const dx = player.x - enemy.x
        const dy = player.y - enemy.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 200) {
          enemy.x += (dx / distance) * 0.5
          enemy.y += (dy / distance) * 0.5
        }
      }
      
      return enemy.x + enemy.width > -50
    })

    // Update particles
    gameState.current.particles = gameState.current.particles.filter(particle => {
      particle.x += particle.velocityX
      particle.y += particle.velocityY
      particle.velocityY += 0.3 // gravity
      particle.life -= particle.decay
      return particle.life > 0
    })

    // Update background
    if (gameType === "runner") {
      gameState.current.background.x -= 2
      if (gameState.current.background.x <= -canvas.width) {
        gameState.current.background.x = 0
      }
    }

    // Spawn new entities
    if (Math.random() > 0.995) spawnObstacle()
    if (Math.random() > 0.997) spawnCollectible()
    if (gameType === "combat" && Math.random() > 0.997) spawnEnemy()
  }, [gameType, spawnObstacle, spawnCollectible, spawnEnemy, createParticle, canvasRef])

  // Collision detection
  const checkCollisions = useCallback(() => {
    const player = gameState.current.entities.player

    // Check obstacle collisions
    gameState.current.obstacles.forEach(obstacle => {
      if (player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          player.y < obstacle.y + obstacle.height &&
          player.y + player.height > obstacle.y) {
        
        createParticle(obstacle.x, obstacle.y, "#E74C3C", 8)
        dispatch({ type: "UPDATE_PLAYER", payload: { health: Math.max(0, player.health - 20) } })
        // Remove obstacle on hit
        gameState.current.obstacles = gameState.current.obstacles.filter(o => o.id !== obstacle.id)
        
        if (gameType === "runner") {
          dispatch({ type: "END_GAME", gameType })
        }
      }
    })

    // Check collectible collisions
    gameState.current.collectibles.forEach(collectible => {
      if (player.x < collectible.x + collectible.width &&
          player.x + player.width > collectible.x &&
          player.y < collectible.y + collectible.height &&
          player.y + player.height > collectible.y) {
        
        createParticle(collectible.x, collectible.y, collectible.color, 6)
        
        if (collectible.type === "coin") {
          dispatch({ type: "UPDATE_SCORE", payload: 100 })
          dispatch({ type: "UPDATE_COINS", payload: 1 })
        } else {
          dispatch({ type: "UPDATE_SCORE", payload: 200 })
        }
        
        gameState.current.collectibles = gameState.current.collectibles.filter(c => c.id !== collectible.id)
      }
    })

    // Check enemy collisions
    gameState.current.enemies.forEach(enemy => {
      if (player.x < enemy.x + enemy.width &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height &&
          player.y + player.height > enemy.y) {
        
        createParticle(enemy.x, enemy.y, enemy.color, 6)
        
        if (gameType === "combat") {
          dispatch({ type: "UPDATE_PLAYER", payload: { health: Math.max(0, player.health - 10) } })
        } else {
          dispatch({ type: "END_GAME", gameType })
        }
        
        gameState.current.enemies = gameState.current.enemies.filter(e => e.id !== enemy.id)
      }
    })
  }, [gameType, dispatch, createParticle])

  // Render game
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#1A252F')
    gradient.addColorStop(0.5, '#2C3E50')
    gradient.addColorStop(1, '#1A252F')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw animated background elements
    ctx.fillStyle = 'rgba(255, 107, 53, 0.1)'
    for (let i = 0; i < 5; i++) {
      const x = (gameState.current.background.x + i * 200) % (canvas.width + 100)
      const y = 50 + Math.sin(Date.now() * 0.001 + i) * 20
      ctx.beginPath()
      ctx.arc(x, y, 20, 0, Math.PI * 2)
      ctx.fill()
    }

    // Ground
    if (gameType === "runner") {
      const groundGradient = ctx.createLinearGradient(0, canvas.height - 100, 0, canvas.height)
      groundGradient.addColorStop(0, '#8B4513')
      groundGradient.addColorStop(1, '#654321')
      ctx.fillStyle = groundGradient
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100)
      
      // Ground details
      ctx.fillStyle = 'rgba(139, 69, 19, 0.5)'
      for (let i = 0; i < canvas.width; i += 50) {
        const x = (i + gameState.current.background.x) % canvas.width
        ctx.fillRect(x, canvas.height - 90, 30, 5)
      }
    }

    // Draw player with enhanced visuals
    const player = gameState.current.entities.player
    ctx.save()
    
    // Player shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(player.x + 5, player.y + player.height + 5, player.width, 8)
    
    // Player body with gradient
    const playerGradient = ctx.createRadialGradient(
      player.x + player.width/2, player.y + player.height/2, 0,
      player.x + player.width/2, player.y + player.height/2, player.width/2
    )
    playerGradient.addColorStop(0, player.color)
    playerGradient.addColorStop(1, '#CC5429')
    
    ctx.fillStyle = playerGradient
    ctx.fillRect(player.x, player.y, player.width, player.height)
    
    // Player details
    ctx.fillStyle = 'white'
    ctx.fillRect(player.x + 8, player.y + 8, 8, 8) // eye
    ctx.fillStyle = 'black'
    ctx.fillRect(player.x + 10, player.y + 10, 4, 4) // pupil
    
    ctx.restore()

    // Draw obstacles with enhanced visuals
    gameState.current.obstacles.forEach(obstacle => {
      ctx.save()
      
      // Obstacle shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(obstacle.x + 3, obstacle.y + obstacle.height + 3, obstacle.width, 6)
      
      // Obstacle with gradient
      const obstacleGradient = ctx.createRadialGradient(
        obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, 0,
        obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, obstacle.width/2
      )
      obstacleGradient.addColorStop(0, obstacle.color)
      obstacleGradient.addColorStop(1, '#C0392B')
      
      ctx.fillStyle = obstacleGradient
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      
      ctx.restore()
    })

    // Draw collectibles with rotation and glow
    gameState.current.collectibles.forEach(collectible => {
      ctx.save()
      ctx.translate(collectible.x + collectible.width/2, collectible.y + collectible.height/2)
      ctx.rotate(collectible.rotation)
      
      // Glow effect
      ctx.shadowColor = collectible.color
      ctx.shadowBlur = 15
      
      ctx.fillStyle = collectible.color
      ctx.fillRect(-collectible.width/2, -collectible.height/2, collectible.width, collectible.height)
      
      // Inner shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.fillRect(-collectible.width/4, -collectible.height/4, collectible.width/2, collectible.height/2)
      
      ctx.restore()
    })

    // Draw enemies
    gameState.current.enemies.forEach(enemy => {
      ctx.save()
      
      // Enemy shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(enemy.x + 3, enemy.y + enemy.height + 3, enemy.width, 6)
      
      // Enemy with pulsing effect
      const pulse = Math.sin(Date.now() * 0.005) * 0.1 + 1
      const enemyGradient = ctx.createRadialGradient(
        enemy.x + enemy.width/2, enemy.y + enemy.height/2, 0,
        enemy.x + enemy.width/2, enemy.y + enemy.height/2, (enemy.width/2) * pulse
      )
      enemyGradient.addColorStop(0, enemy.color)
      enemyGradient.addColorStop(1, '#6C3483')
      
      ctx.fillStyle = enemyGradient
      ctx.fillRect(enemy.x, enemy.y, enemy.width * pulse, enemy.height * pulse)
      
      ctx.restore()
    })

    // Draw particles
    gameState.current.particles.forEach(particle => {
      ctx.save()
      ctx.globalAlpha = particle.life
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })

    // Draw UI overlays
    if (gameType === "combat" && player.health < player.maxHealth) {
      // Damage overlay
      const damageAlpha = 1 - (player.health / player.maxHealth)
      ctx.fillStyle = `rgba(231, 76, 60, ${damageAlpha * 0.3})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [gameType, canvasRef])

  // Main game loop
  const gameLoop = useCallback((currentTime) => {
    if (!gameRunning || paused) {
      animationRef.current = requestAnimationFrame(gameLoop)
      return
    }

    const deltaTime = currentTime - lastTimeRef.current
    lastTimeRef.current = currentTime

    // Initialize if needed
    if (!gameState.current.initialized) {
      initGame()
    }

    // Update game state
    updateEntities(deltaTime)
    checkCollisions()

    // Render frame
    render()

    // Continue loop
    animationRef.current = requestAnimationFrame(gameLoop)
  }, [gameRunning, paused, initGame, updateEntities, checkCollisions, render])

  // Start/stop game loop
  useEffect(() => {
    if (gameRunning && !paused) {
      lastTimeRef.current = performance.now()
      animationRef.current = requestAnimationFrame(gameLoop)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameRunning, paused, gameLoop])

  // Initialize when game starts
  useEffect(() => {
    if (gameRunning) {
      initGame()
    }
  }, [gameRunning, initGame])

  const update = useCallback(() => {
    // This is now handled by the game loop
  }, [])

return useMemo(() => ({ update, render }), [update, render])
}