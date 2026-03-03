// ========================================
// SLITHER.IO STYLE SNAKE GAME
// ========================================

// Game Configuration
const CONFIG = {
  WORLD_WIDTH: 4000,
  WORLD_HEIGHT: 4000,
  INITIAL_SNAKE_LENGTH: 10,
  SEGMENT_SIZE: 8,
  FOOD_SIZE: 6,
  FOOD_COUNT: 300,
  AI_SNAKE_COUNT: 10,
  BASE_SPEED: 3,
  BOOST_SPEED: 6,
  BOOST_COST: 0.1,
  GROWTH_RATE: 1,
  COLORS: [
    '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', 
    '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'
  ]
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor() {
  return CONFIG.COLORS[randomInt(0, CONFIG.COLORS.length - 1)];
}

// ========================================
// FOOD CLASS
// ========================================

class Food {
  constructor(x, y) {
    this.x = x || randomRange(0, CONFIG.WORLD_WIDTH);
    this.y = y || randomRange(0, CONFIG.WORLD_HEIGHT);
    this.size = CONFIG.FOOD_SIZE;
    this.color = randomColor();
    this.glow = 0;
    this.glowDirection = 1;
  }

  update() {
    // Pulsing glow effect
    this.glow += this.glowDirection * 0.5;
    if (this.glow > 10) this.glowDirection = -1;
    if (this.glow < 0) this.glowDirection = 1;
  }

  draw(ctx, camera) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    ctx.save();
    ctx.shadowBlur = 10 + this.glow;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(screenX, screenY, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ========================================
// SNAKE CLASS
// ========================================

class Snake {
  constructor(x, y, isPlayer = false, name = 'AI') {
    this.x = x;
    this.y = y;
    this.segments = [];
    this.angle = Math.random() * Math.PI * 2;
    this.targetAngle = this.angle;
    this.speed = CONFIG.BASE_SPEED;
    this.color = randomColor();
    this.isPlayer = isPlayer;
    this.name = name;
    this.isDead = false;
    this.boosting = false;
    this.length = CONFIG.INITIAL_SNAKE_LENGTH;
    this.score = 0;

    // Initialize segments
    for (let i = 0; i < CONFIG.INITIAL_SNAKE_LENGTH; i++) {
      this.segments.push({
        x: this.x - i * CONFIG.SEGMENT_SIZE,
        y: this.y,
        angle: this.angle
      });
    }
  }

  setTarget(targetX, targetY) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    this.targetAngle = Math.atan2(dy, dx);
  }

  boost(active) {
    this.boosting = active;
    this.speed = active ? CONFIG.BOOST_SPEED : CONFIG.BASE_SPEED;
  }

  grow(amount = 1) {
    this.length += amount;
    this.score += amount;
  }

  update() {
    if (this.isDead) return;

    // Smooth angle interpolation
    let angleDiff = this.targetAngle - this.angle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    this.angle += angleDiff * 0.1;

    // Move head
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Keep within world bounds (wrap around)
    if (this.x < 0) this.x = CONFIG.WORLD_WIDTH;
    if (this.x > CONFIG.WORLD_WIDTH) this.x = 0;
    if (this.y < 0) this.y = CONFIG.WORLD_HEIGHT;
    if (this.y > CONFIG.WORLD_HEIGHT) this.y = 0;

    // Update segments (smooth following)
    this.segments[0] = { x: this.x, y: this.y, angle: this.angle };

    for (let i = 1; i < this.segments.length; i++) {
      const prev = this.segments[i - 1];
      const curr = this.segments[i];
      
      const dx = prev.x - curr.x;
      const dy = prev.y - curr.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > CONFIG.SEGMENT_SIZE) {
        const angle = Math.atan2(dy, dx);
        curr.x += Math.cos(angle) * (dist - CONFIG.SEGMENT_SIZE);
        curr.y += Math.sin(angle) * (dist - CONFIG.SEGMENT_SIZE);
        curr.angle = angle;
      }
    }

    // Add or remove segments based on length
    while (this.segments.length < this.length) {
      const last = this.segments[this.segments.length - 1];
      this.segments.push({ ...last });
    }
    while (this.segments.length > this.length) {
      this.segments.pop();
    }

    // Boost cost
    if (this.boosting && this.length > CONFIG.INITIAL_SNAKE_LENGTH) {
      this.length -= CONFIG.BOOST_COST;
    }
  }

  draw(ctx, camera) {
    if (this.isDead) return;

    ctx.save();
    
    // Draw body segments
    for (let i = this.segments.length - 1; i >= 0; i--) {
      const segment = this.segments[i];
      const screenX = segment.x - camera.x;
      const screenY = segment.y - camera.y;
      
      const alpha = i === 0 ? 1 : 0.7 + (i / this.segments.length) * 0.3;
      const size = i === 0 ? CONFIG.SEGMENT_SIZE * 1.2 : CONFIG.SEGMENT_SIZE;

      // Glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
      
      // Draw segment
      ctx.fillStyle = this.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
      ctx.fill();

      // Draw eyes on head
      if (i === 0) {
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        
        const eyeOffset = size * 0.5;
        const eyeSize = size * 0.3;
        const eyeAngle = segment.angle;
        
        // Left eye
        const leftX = screenX + Math.cos(eyeAngle + 0.5) * eyeOffset;
        const leftY = screenY + Math.sin(eyeAngle + 0.5) * eyeOffset;
        ctx.beginPath();
        ctx.arc(leftX, leftY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Right eye
        const rightX = screenX + Math.cos(eyeAngle - 0.5) * eyeOffset;
        const rightY = screenY + Math.sin(eyeAngle - 0.5) * eyeOffset;
        ctx.beginPath();
        ctx.arc(rightX, rightY, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();

    // Draw name above head
    if (this.segments.length > 0) {
      const head = this.segments[0];
      const screenX = head.x - camera.x;
      const screenY = head.y - camera.y - 20;
      
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 3;
      ctx.shadowColor = 'black';
      ctx.fillText(this.name, screenX, screenY);
      ctx.restore();
    }
  }

  checkCollision(otherSnake) {
    if (this.isDead || otherSnake.isDead) return false;
    
    const head = this.segments[0];
    
    // Check collision with other snake's body (skip head)
    for (let i = 3; i < otherSnake.segments.length; i++) {
      const segment = otherSnake.segments[i];
      const dist = distance(head.x, head.y, segment.x, segment.y);
      
      if (dist < CONFIG.SEGMENT_SIZE * 1.5) {
        return true;
      }
    }
    
    return false;
  }

  die() {
    this.isDead = true;
  }

  getScore() {
    return Math.floor(this.score);
  }
}

// ========================================
// AI SNAKE CLASS
// ========================================

class AISnake extends Snake {
  constructor(x, y) {
    super(x, y, false, `Bot ${randomInt(1, 999)}`);
    this.targetFood = null;
    this.wanderAngle = Math.random() * Math.PI * 2;
    this.wanderTimer = 0;
  }

  updateAI(foods, snakes) {
    if (this.isDead) return;

    // Find nearest food
    let nearestFood = null;
    let nearestDist = Infinity;

    for (const food of foods) {
      const dist = distance(this.x, this.y, food.x, food.y);
      if (dist < 300 && dist < nearestDist) {
        nearestFood = food;
        nearestDist = dist;
      }
    }

    // Chase food or wander
    if (nearestFood) {
      this.setTarget(nearestFood.x, nearestFood.y);
    } else {
      // Wander behavior
      this.wanderTimer--;
      if (this.wanderTimer <= 0) {
        this.wanderAngle += randomRange(-0.5, 0.5);
        this.wanderTimer = randomInt(30, 60);
      }
      
      const targetX = this.x + Math.cos(this.wanderAngle) * 100;
      const targetY = this.y + Math.sin(this.wanderAngle) * 100;
      this.setTarget(targetX, targetY);
    }

    // Avoid other snakes
    for (const snake of snakes) {
      if (snake === this || snake.isDead) continue;
      
      const dist = distance(this.x, this.y, snake.x, snake.y);
      if (dist < 100) {
        const avoidAngle = Math.atan2(this.y - snake.y, this.x - snake.x);
        this.targetAngle = avoidAngle;
      }
    }

    this.update();
  }
}

// ========================================
// GAME CLASS
// ========================================

class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.camera = { x: 0, y: 0 };
    this.player = null;
    this.snakes = [];
    this.foods = [];
    this.mouseX = this.canvas.width / 2;
    this.mouseY = this.canvas.height / 2;
    this.isRunning = false;
    this.username = 'Player';

    this.setupEventListeners();
    this.showStartScreen();
  }

  setupEventListeners() {
    // Mouse movement
    this.canvas.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Mouse boost
    this.canvas.addEventListener('mousedown', () => {
      if (this.player && !this.player.isDead) {
        this.player.boost(true);
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      if (this.player) {
        this.player.boost(false);
      }
    });

    // Keyboard boost
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.player && !this.player.isDead) {
        this.player.boost(true);
        e.preventDefault();
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.code === 'Space' && this.player) {
        this.player.boost(false);
      }
    });

    // Touch controls
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      this.mouseX = touch.clientX;
      this.mouseY = touch.clientY;
    }, { passive: false });

    // Mobile boost button
    const boostBtn = document.getElementById('boostButton');
    boostBtn.addEventListener('touchstart', () => {
      if (this.player && !this.player.isDead) {
        this.player.boost(true);
      }
    });
    boostBtn.addEventListener('touchend', () => {
      if (this.player) {
        this.player.boost(false);
      }
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });

    // Start button
    document.getElementById('playButton').addEventListener('click', () => {
      this.startGame();
    });

    // Restart button
    document.getElementById('restartButton').addEventListener('click', () => {
      this.startGame();
    });

    // Enter key on username input
    document.getElementById('usernameInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.startGame();
      }
    });
  }

  showStartScreen() {
    document.getElementById('startScreen').classList.remove('hidden');
    document.getElementById('gameOverScreen').classList.remove('show');
  }

  startGame() {
    // Get username
    const input = document.getElementById('usernameInput');
    this.username = input.value.trim() || 'Player';

    // Hide screens
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.remove('show');

    // Initialize game
    this.snakes = [];
    this.foods = [];

    // Create player
    this.player = new Snake(
      CONFIG.WORLD_WIDTH / 2,
      CONFIG.WORLD_HEIGHT / 2,
      true,
      this.username
    );
    this.snakes.push(this.player);

    // Create AI snakes
    for (let i = 0; i < CONFIG.AI_SNAKE_COUNT; i++) {
      const aiSnake = new AISnake(
        randomRange(0, CONFIG.WORLD_WIDTH),
        randomRange(0, CONFIG.WORLD_HEIGHT)
      );
      this.snakes.push(aiSnake);
    }

    // Create food
    for (let i = 0; i < CONFIG.FOOD_COUNT; i++) {
      this.foods.push(new Food());
    }

    this.isRunning = true;
    this.gameLoop();
  }

  gameLoop() {
    if (!this.isRunning) return;

    this.update();
    this.draw();

    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    // Update player
    if (this.player && !this.player.isDead) {
      const worldMouseX = this.mouseX + this.camera.x;
      const worldMouseY = this.mouseY + this.camera.y;
      this.player.setTarget(worldMouseX, worldMouseY);
      this.player.update();

      // Update camera to follow player
      this.camera.x = this.player.x - this.canvas.width / 2;
      this.camera.y = this.player.y - this.canvas.height / 2;
    }

    // Update AI snakes
    for (const snake of this.snakes) {
      if (snake instanceof AISnake) {
        snake.updateAI(this.foods, this.snakes);
      }
    }

    // Update food
    for (const food of this.foods) {
      food.update();
    }

    // Check food collision
    for (const snake of this.snakes) {
      if (snake.isDead) continue;

      for (let i = this.foods.length - 1; i >= 0; i--) {
        const food = this.foods[i];
        const dist = distance(snake.x, snake.y, food.x, food.y);

        if (dist < CONFIG.SEGMENT_SIZE + CONFIG.FOOD_SIZE) {
          snake.grow(CONFIG.GROWTH_RATE);
          this.foods.splice(i, 1);
          this.foods.push(new Food());
        }
      }
    }

    // Check snake collisions
    for (let i = 0; i < this.snakes.length; i++) {
      const snake1 = this.snakes[i];
      if (snake1.isDead) continue;

      for (let j = 0; j < this.snakes.length; j++) {
        if (i === j) continue;
        const snake2 = this.snakes[j];
        
        if (snake1.checkCollision(snake2)) {
          snake1.die();
          
          // Convert dead snake to food
          for (const segment of snake1.segments) {
            this.foods.push(new Food(segment.x, segment.y));
          }

          // Check if player died
          if (snake1.isPlayer) {
            this.gameOver();
          }

          // Respawn AI snake
          if (snake1 instanceof AISnake) {
            setTimeout(() => {
              const newSnake = new AISnake(
                randomRange(0, CONFIG.WORLD_WIDTH),
                randomRange(0, CONFIG.WORLD_HEIGHT)
              );
              this.snakes[i] = newSnake;
            }, 3000);
          }
        }
      }
    }

    // Update HUD
    if (this.player && !this.player.isDead) {
      document.getElementById('score').textContent = `Score: ${this.player.getScore()}`;
      document.getElementById('length').textContent = `Length: ${this.player.segments.length}`;
    }

    // Update leaderboard
    this.updateLeaderboard();
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#0a0e1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
    this.drawGrid();

    // Draw food
    for (const food of this.foods) {
      // Only draw food near camera
      if (Math.abs(food.x - this.camera.x - this.canvas.width / 2) < this.canvas.width &&
          Math.abs(food.y - this.camera.y - this.canvas.height / 2) < this.canvas.height) {
        food.draw(this.ctx, this.camera);
      }
    }

    // Draw snakes
    for (const snake of this.snakes) {
      snake.draw(this.ctx, this.camera);
    }
  }

  drawGrid() {
    const gridSize = 50;
    const startX = Math.floor(this.camera.x / gridSize) * gridSize;
    const startY = Math.floor(this.camera.y / gridSize) * gridSize;

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;

    for (let x = startX; x < this.camera.x + this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x - this.camera.x, 0);
      this.ctx.lineTo(x - this.camera.x, this.canvas.height);
      this.ctx.stroke();
    }

    for (let y = startY; y < this.camera.y + this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y - this.camera.y);
      this.ctx.lineTo(this.canvas.width, y - this.camera.y);
      this.ctx.stroke();
    }
  }

  updateLeaderboard() {
    const aliveSnakes = this.snakes.filter(s => !s.isDead);
    aliveSnakes.sort((a, b) => b.getScore() - a.getScore());

    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '';

    for (let i = 0; i < Math.min(5, aliveSnakes.length); i++) {
      const snake = aliveSnakes[i];
      const entry = document.createElement('div');
      entry.className = 'leaderboard-entry';
      if (snake.isPlayer) entry.classList.add('player');
      entry.textContent = `${i + 1}. ${snake.name} - ${snake.getScore()}`;
      leaderboardList.appendChild(entry);
    }
  }

  gameOver() {
    this.isRunning = false;
    
    setTimeout(() => {
      document.getElementById('finalScore').textContent = `Score: ${this.player.getScore()}`;
      document.getElementById('gameOverScreen').classList.add('show');
    }, 1000);
  }
}

// ========================================
// START GAME
// ========================================

window.addEventListener('load', () => {
  new Game();
});
