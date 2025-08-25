import { useCallback, useRef, useEffect } from "react"
import { useGameContext } from "@/hooks/useGameContext"

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

  const gameState = useRef({
    lastTime: 0,
    gameSpeed: 1,
    scrollOffset: 0,
    inputState: {},
    particles: [],
    camera: { x: 0, y: 0 }
  })

  const entities = useRef({
    player: {
      x: 100,
      y: 300,
      width: 40,
      height: 40,
      velocityY: 0,
      grounded: false,
      jumping: false,
      ducking: false,
      health: 100,
      maxHealth: 100
    },
    obstacles: [],
    enemies: [],
    collectibles: [],
    projectiles: []
  })

  // Input handling
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

  const spawnObstacle = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const obstacle = {
      id: Date.now(),
      x: canvas.width,
      y: Math.random() > 0.5 ? 300 : 350, // Ground or elevated
      width: 30 + Math.random() * 20,
      height: 30 + Math.random() * 40,
      type: Math.random() > 0.7 ? "spike" : "rock",
      speed: 3 + level * 0.5
    }

    entities.current.obstacles.push(obstacle)
  }, [level])

  const spawnEnemy = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const enemy = {
      id: Date.now(),
      x: canvas.width,
      y: 200 + Math.random() * 200,
      width: 35,
      height: 35,
      health: 50 + level * 10,
      maxHealth: 50 + level * 10,
      speed: 1 + Math.random() * 2,
      type: Math.random() > 0.5 ? "flyer" : "walker",
      ai: {
        state: "patrol",
        lastAction: 0,
        direction: -1
      }
    }

    entities.current.enemies.push(enemy)
  }, [level])

  const spawnCollectible = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const collectible = {
      id: Date.now(),
      x: canvas.width,
      y: 200 + Math.random() * 200,
      width: 20,
      height: 20,
      type: Math.random() > 0.8 ? "powerup" : "coin",
      value: Math.random() > 0.8 ? 50 : 10,
      bounce: 0
    }

    entities.current.collectibles.push(collectible)
  }, [])

  const updatePhysics = useCallback((deltaTime) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gravity = 800
    const groundY = canvas.height - 100

    // Update player physics
    if (gameType === "runner") {
      // Jumping
      if (gameState.current.inputState.jump && entities.current.player.grounded) {
        entities.current.player.velocityY = -400
        entities.current.player.grounded = false
        entities.current.player.jumping = true
      }

      // Apply gravity
      if (!entities.current.player.grounded) {
        entities.current.player.velocityY += gravity * deltaTime
      }

      // Update position
      entities.current.player.y += entities.current.player.velocityY * deltaTime

      // Ground collision
      if (entities.current.player.y >= groundY - entities.current.player.height) {
        entities.current.player.y = groundY - entities.current.player.height
        entities.current.player.velocityY = 0
        entities.current.player.grounded = true
        entities.current.player.jumping = false
      }

      // Ducking
      entities.current.player.ducking = gameState.current.inputState.duck
      entities.current.player.height = entities.current.player.ducking ? 20 : 40

    } else if (gameType === "combat") {
      // Combat movement
      const moveSpeed = 200
      
      if (gameState.current.inputState.up) {
        entities.current.player.y = Math.max(50, entities.current.player.y - moveSpeed * deltaTime)
      }
      if (gameState.current.inputState.down) {
        entities.current.player.y = Math.min(canvas.height - 100, entities.current.player.y + moveSpeed * deltaTime)
      }
      if (gameState.current.inputState.left) {
        entities.current.player.x = Math.max(20, entities.current.player.x - moveSpeed * deltaTime)
      }
      if (gameState.current.inputState.right) {
        entities.current.player.x = Math.min(canvas.width - 100, entities.current.player.x + moveSpeed * deltaTime)
      }

      // Attacking
      if (gameState.current.inputState.attack) {
        // Create projectile or melee attack
        if (Math.random() > 0.9) { // Rate limit
          entities.current.projectiles.push({
            id: Date.now(),
            x: entities.current.player.x + 40,
            y: entities.current.player.y + 20,
            width: 8,
            height: 8,
            velocityX: 300,
            velocityY: 0,
            damage: 25,
            lifetime: 2000
          })
        }
      }
    }

    // Update game objects
    gameState.current.scrollOffset += (2 + level * 0.5) * deltaTime

    // Update obstacles
    entities.current.obstacles = entities.current.obstacles.filter(obstacle => {
      if (gameType === "runner") {
        obstacle.x -= obstacle.speed
      }
      return obstacle.x + obstacle.width > -50
    })

    // Update enemies
    entities.current.enemies = entities.current.enemies.filter(enemy => {
      if (gameType === "runner") {
        enemy.x -= 2 + level * 0.3
      } else {
        // AI behavior
        const now = Date.now()
        if (now - enemy.ai.lastAction > 1000) {
          enemy.ai.lastAction = now
          if (Math.random() > 0.5) {
            enemy.ai.direction *= -1
          }
        }
        enemy.x += enemy.ai.direction * enemy.speed
        enemy.y += Math.sin(now * 0.003) * 0.5
      }
      return enemy.x + enemy.width > -50 && enemy.health > 0
    })

    // Update collectibles
    entities.current.collectibles = entities.current.collectibles.filter(collectible => {
      if (gameType === "runner") {
        collectible.x -= 3
      }
      collectible.bounce += deltaTime * 5
      collectible.y += Math.sin(collectible.bounce) * 0.5
      return collectible.x + collectible.width > -50
    })

    // Update projectiles
    entities.current.projectiles = entities.current.projectiles.filter(projectile => {
      projectile.x += projectile.velocityX * deltaTime
      projectile.y += projectile.velocityY * deltaTime
      projectile.lifetime -= deltaTime * 1000
      return projectile.lifetime > 0 && projectile.x < canvas.width + 50
    })

    // Spawn new entities
    if (Math.random() > 0.995) spawnObstacle()
    if (Math.random() > 0.998) spawnCollectible()
    if (gameType === "combat" && Math.random() > 0.997) spawnEnemy()

  }, [gameType, level, spawnObstacle, spawnCollectible, spawnEnemy])

  const checkCollisions = useCallback(() => {
    const playerRect = {
      x: entities.current.player.x,
      y: entities.current.player.y,
      width: entities.current.player.width,
      height: entities.current.player.height
    }

    // Check obstacle collisions
    entities.current.obstacles.forEach(obstacle => {
      if (isColliding(playerRect, obstacle)) {
        dispatch({ type: "UPDATE_PLAYER", payload: { health: Math.max(0, entities.current.player.health - 20) } })
        // Remove obstacle on hit
        entities.current.obstacles = entities.current.obstacles.filter(o => o.id !== obstacle.id)
        
        if (entities.current.player.health <= 0) {
          dispatch({ type: "END_GAME", gameType })
        }
      }
    })

    // Check enemy collisions
    entities.current.enemies.forEach(enemy => {
      if (isColliding(playerRect, enemy)) {
        if (gameType === "combat") {
          dispatch({ type: "UPDATE_PLAYER", payload: { health: Math.max(0, entities.current.player.health - 10) } })
        } else {
          dispatch({ type: "END_GAME", gameType })
        }
      }
    })

    // Check collectible collisions
    entities.current.collectibles = entities.current.collectibles.filter(collectible => {
      if (isColliding(playerRect, collectible)) {
        dispatch({ type: "UPDATE_COINS", payload: collectible.value })
        dispatch({ type: "UPDATE_SCORE", payload: collectible.value * 10 })
        return false
      }
      return true
    })

    // Check projectile-enemy collisions
    entities.current.projectiles.forEach(projectile => {
      entities.current.enemies.forEach(enemy => {
        if (isColliding(projectile, enemy)) {
          enemy.health -= projectile.damage
          entities.current.projectiles = entities.current.projectiles.filter(p => p.id !== projectile.id)
          
          if (enemy.health <= 0) {
            dispatch({ type: "UPDATE_SCORE", payload: 100 })
            dispatch({ type: "UPDATE_COINS", payload: 5 })
          }
        }
      })
    })

  }, [gameType, dispatch])

  const isColliding = (rect1, rect2) => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y
  }

  const update = useCallback((timestamp) => {
    if (!gameRunning || paused) return

    const deltaTime = Math.min((timestamp - gameState.current.lastTime) / 1000, 0.016)
    gameState.current.lastTime = timestamp

    updatePhysics(deltaTime)
    checkCollisions()

    // Update score over time
    if (gameType === "runner") {
      dispatch({ type: "UPDATE_SCORE", payload: Math.floor(deltaTime * 10) })
    }

  }, [gameRunning, paused, updatePhysics, checkCollisions, gameType, dispatch])

  const render = useCallback((ctx) => {
    if (!ctx || !canvasRef.current) return

    const canvas = canvasRef.current
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    if (gameType === "runner") {
      gradient.addColorStop(0, "#87CEEB")
      gradient.addColorStop(0.7, "#98FB98")
      gradient.addColorStop(1, "#90EE90")
    } else {
      gradient.addColorStop(0, "#1A252F")
      gradient.addColorStop(0.5, "#2C3E50")
      gradient.addColorStop(1, "#34495E")
    }
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Ground
    if (gameType === "runner") {
      ctx.fillStyle = "#8B4513"
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100)
    }

    // Render player
    ctx.fillStyle = "#FF6B35"
    ctx.fillRect(
      entities.current.player.x,
      entities.current.player.y,
      entities.current.player.width,
      entities.current.player.height
    )

    // Player details
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(entities.current.player.x + 5, entities.current.player.y + 5, 6, 6) // Eye
    ctx.fillRect(entities.current.player.x + 15, entities.current.player.y + 5, 6, 6) // Eye

    // Render obstacles
    ctx.fillStyle = "#8B4513"
    entities.current.obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      
      if (obstacle.type === "spike") {
        ctx.fillStyle = "#FF4444"
        ctx.beginPath()
        ctx.moveTo(obstacle.x, obstacle.y + obstacle.height)
        ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y)
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height)
        ctx.fill()
        ctx.fillStyle = "#8B4513"
      }
    })

    // Render enemies
    ctx.fillStyle = "#FF4444"
    entities.current.enemies.forEach(enemy => {
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
      
      // Health bar
      if (gameType === "combat") {
        const healthPercent = enemy.health / enemy.maxHealth
        ctx.fillStyle = "#FF0000"
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 4)
        ctx.fillStyle = "#00FF00"
        ctx.fillRect(enemy.x, enemy.y - 10, enemy.width * healthPercent, 4)
        ctx.fillStyle = "#FF4444"
      }
    })

    // Render collectibles
    entities.current.collectibles.forEach(collectible => {
      if (collectible.type === "coin") {
        ctx.fillStyle = "#F7931E"
        ctx.beginPath()
        ctx.arc(
          collectible.x + collectible.width / 2,
          collectible.y + collectible.height / 2,
          collectible.width / 2,
          0,
          Math.PI * 2
        )
        ctx.fill()
        
        ctx.fillStyle = "#FFD700"
        ctx.beginPath()
        ctx.arc(
          collectible.x + collectible.width / 2,
          collectible.y + collectible.height / 2,
          collectible.width / 4,
          0,
          Math.PI * 2
        )
        ctx.fill()
      } else {
        ctx.fillStyle = "#00D9FF"
        ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height)
      }
    })

    // Render projectiles
    ctx.fillStyle = "#FFFF00"
    entities.current.projectiles.forEach(projectile => {
      ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height)
    })

  }, [gameType])

  return { update, render }
}