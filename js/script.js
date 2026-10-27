/**
 * ============================================================================
 * FELIPE SILVA // CYBERDECK v3.0 - CORE ENGINE
 * Features:
 * - 3D Card Tilt & Holographic Specular Glare
 * - Pure Web Audio API Sound Synthesizer (Zero-dependency)
 * - Interactive Particle & Cyber Constellation Background Canvas
 * - Real-time HUD Clock (BRT)
 * - Dynamic Role Typer with Matrix Glyphs
 * - Multi-Theme Neon Engine (Emerald, Cyan, Violet, Amber)
 * - Built-in Cyber Snake Arcade Game (2026)
 * - Avatar Rotator (Photo / Gif / Banner)
 * - Category Filter Engine for Skills & Projects
 * - Clipboard Copy & Cyber Toast Notifications
 * ============================================================================
 */

// --- 0. ALTURA REAL DA TELA (corrige menu escondido em navegadores mobile) ---
function setAppHeight() {
  const h = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
  document.documentElement.style.setProperty('--app-height', `${Math.round(h)}px`);
}
setAppHeight();
window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', () => setTimeout(setAppHeight, 250));
if (window.visualViewport) window.visualViewport.addEventListener('resize', setAppHeight);
window.addEventListener('load', setAppHeight);

// --- 1. AUDIO SYNTHESIS ENGINE (Web Audio API) ---
class CyberAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('lip_sound_enabled') !== 'true'; // Default muted until activated
    this.updateSoundIcon();
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.initContext();
    this.muted = !this.muted;
    localStorage.setItem('lip_sound_enabled', (!this.muted).toString());
    this.updateSoundIcon();
    if (!this.muted) {
      this.playBeep(880, 'sine', 0.1, 0.08);
      showToast('Áudio Cyberdeck Ativado!', 'fa-volume-high');
      if (typeof window.checkSnakeAudioResume === 'function') {
        window.checkSnakeAudioResume();
      }
    } else {
      this.stopArcadeMusic();
      showToast('Áudio Desativado', 'fa-volume-xmark');
    }
  }

  updateSoundIcon() {
    const icon = document.getElementById('soundIcon');
    const btn = document.getElementById('btnSoundToggle');
    if (icon && btn) {
      if (this.muted) {
        icon.className = 'fa-solid fa-volume-xmark';
        btn.classList.remove('active-sound');
      } else {
        icon.className = 'fa-solid fa-volume-high';
        btn.classList.add('active-sound');
      }
    }
  }

  playBeep(freq = 600, type = 'sine', duration = 0.08, vol = 0.05) {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio not allowed yet', e);
    }
  }

  playClick() {
    this.playBeep(1200, 'triangle', 0.04, 0.04);
  }

  playSwitch() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playSuccess() {
    if (this.muted) return;
    this.playBeep(523.25, 'triangle', 0.1, 0.04);
    setTimeout(() => this.playBeep(659.25, 'triangle', 0.15, 0.04), 80);
  }

  startArcadeMusic() {
    if (this.muted) return;
    if (this.arcadeMusicInterval) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // 16-step retro 8-bit cyber arcade bassline & synth melody
      const notes = [
        130.81, 261.63, 196.00, 311.13,
        130.81, 261.63, 196.00, 392.00,
        116.54, 233.08, 174.61, 293.66,
        103.83, 207.65, 155.56, 261.63
      ];
      let step = 0;
      this.arcadeMusicRunning = true;

      this.arcadeMusicInterval = setInterval(() => {
        if (this.muted || !this.arcadeMusicRunning) {
          this.stopArcadeMusic();
          return;
        }
        try {
          if (!this.ctx || this.ctx.state !== 'running') return;
          const now = this.ctx.currentTime;
          const freq = notes[step % notes.length];
          step++;

          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = (step % 2 === 0) ? 'triangle' : 'square';
          osc.frequency.setValueAtTime(freq, now);

          const vol = 0.024;
          gain.gain.setValueAtTime(vol, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now);
          osc.stop(now + 0.12);
        } catch (e) {}
      }, 135);
    } catch (e) {
      console.warn('Arcade audio error', e);
    }
  }

  stopArcadeMusic() {
    this.arcadeMusicRunning = false;
    if (this.arcadeMusicInterval) {
      clearInterval(this.arcadeMusicInterval);
      this.arcadeMusicInterval = null;
    }
  }

  playEatFood() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.12);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  playGameOver() {
    if (this.muted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.32);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {}
  }
}

const soundEngine = new CyberAudioEngine();

// --- 2. MULTI-THEME NEON & LIGHT ENGINE ---
const themes = [
  'emerald',
  'cyan',
  'violet',
  'amber',
  'light-emerald',
  'light-cyan',
  'light-violet',
  'light-amber',
];
let currentThemeIndex = 0;

const themeNames = {
  emerald: 'Emerald Matrix (Escuro)',
  cyan: 'Cyber Cyan (Escuro)',
  violet: 'Neon Synthwave (Escuro)',
  amber: 'Solar Gold (Escuro)',
  'light-emerald': 'Branco Esmeralda (Claro)',
  'light-cyan': 'Branco Azure (Claro)',
  'light-violet': 'Branco Lavanda (Claro)',
  'light-amber': 'Branco Sunset (Claro)',
  light: 'Branco Esmeralda (Claro)',
};

function initTheme() {
  const savedTheme = localStorage.getItem('lip_theme') || 'emerald';
  const foundIdx = themes.indexOf(savedTheme);
  currentThemeIndex = foundIdx >= 0 ? foundIdx : 0;
  applyTheme(themes[currentThemeIndex], false);

  // Setup click listeners on theme modal option cards
  const themeCards = document.querySelectorAll('.theme-option-card');
  themeCards.forEach((card) => {
    card.addEventListener('click', () => {
      const themeId = card.getAttribute('data-theme-id');
      if (themeId) {
        applyTheme(themeId, true);
        const found = themes.indexOf(themeId);
        if (found >= 0) currentThemeIndex = found;
      }
    });
  });
}

function cycleTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  const nextTheme = themes[currentThemeIndex];
  applyTheme(nextTheme, true);
}

function applyTheme(themeName, notify = false) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('lip_theme', themeName);

  // Update active state in theme modal cards
  const themeCards = document.querySelectorAll('.theme-option-card');
  themeCards.forEach((card) => {
    const id = card.getAttribute('data-theme-id');
    if (id === themeName || (themeName === 'light' && id === 'light-emerald')) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });

  if (notify) {
    soundEngine.playSuccess();
    const label = themeNames[themeName] || themeName;
    showToast(`Tema: ${label}`, 'fa-palette');
  }
}

// --- 3. REAL-TIME HUD CLOCK (BRT) ---
function updateHudClock() {
  const clockEl = document.getElementById('hudClock');
  if (!clockEl) return;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('pt-BR', { hour12: false });
  clockEl.textContent = `${timeStr} BRT`;
}
setInterval(updateHudClock, 1000);
updateHudClock();

// --- 4. DYNAMIC ROLE TYPER ---
const roles = [
  'Felipe Silva',
  'Desenvolvedor Web',
  'Ciência da Computação',
  'Interfaces de Alto Impacto',
  '<LipDev />',
];
const typerEl = document.getElementById('digitando');
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;

function typeLoop() {
  if (!typerEl) return;
  const currentRole = roles[roleIdx];

  if (!isDeleting) {
    typerEl.textContent = currentRole.substring(0, charIdx + 1);
    charIdx++;

    if (charIdx === currentRole.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
    setTimeout(typeLoop, 110);
  } else {
    typerEl.textContent = currentRole.substring(0, charIdx - 1);
    charIdx--;

    if (charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(typeLoop, 300);
      return;
    }
    setTimeout(typeLoop, 55);
  }
}
setTimeout(typeLoop, 500);

// --- 5. SCREEN NAVIGATION & DOCK ENGINE ---
function goToScreen(screenId) {
  // Aliases support
  if (screenId === 'menu') screenId = 'skills';
  if (screenId === 'terminal' || screenId === 'gamer' || screenId === 'game') screenId = 'snake';

  const screens = document.querySelectorAll('.card-screen');
  let targetScreen = document.getElementById(`screen-${screenId}`);

  if (!targetScreen) {
    screenId = 'home';
    targetScreen = document.getElementById('screen-home');
  }

  // Deactivate all
  screens.forEach((screen) => {
    screen.classList.remove('active');
    setTimeout(() => {
      const scrollable = screen.querySelector('.screen-scrollable');
      if (scrollable) scrollable.scrollTop = 0;
    }, 400);
  });

  // Activate target screen
  targetScreen.classList.add('active');

  // Update Dock buttons
  const dockItems = document.querySelectorAll('.dock-item');
  dockItems.forEach((btn) => {
    if (btn.getAttribute('data-screen') === screenId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (screenId === 'snake') {
    if (typeof window.checkSnakeAudioResume === 'function') {
      window.checkSnakeAudioResume();
    }
  } else {
    soundEngine.stopArcadeMusic();
  }

  soundEngine.playSwitch();
}

// Make goToScreen globally accessible for HTML onclick attributes
window.goToScreen = goToScreen;

// --- 6. STABLE CARD POSITIONING (Sem tremores) ---
function init3DTilt() {
  // Desativado para manter o card 100% fixo, estável e elegante sem tremer
}

// --- 7. AVATAR (Foto Principal Fixa: lipe.jpg) ---
function cycleAvatar() {
  soundEngine.playSuccess();
  showToast('Felipe Silva // Perfil Oficial', 'fa-circle-check');
}

// --- 8. SKILLS & PROJECTS FILTERING ---
function initFilters() {
  // Skills filter
  const skillChips = document.querySelectorAll('[data-filter]');
  const skillTiles = document.querySelectorAll('.skill-tile');

  skillChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      soundEngine.playClick();
      skillChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      const cat = chip.getAttribute('data-filter');
      skillTiles.forEach((tile) => {
        if (cat === 'all' || tile.getAttribute('data-cat') === cat) {
          tile.style.display = 'flex';
          tile.style.opacity = '1';
        } else {
          tile.style.display = 'none';
          tile.style.opacity = '0';
        }
      });
    });
  });

  // Projects filter
  const pChips = document.querySelectorAll('[data-pfilter]');
  const pCards = document.querySelectorAll('.cyber-project-card');

  pChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      soundEngine.playClick();
      pChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      const pcat = chip.getAttribute('data-pfilter');
      pCards.forEach((card) => {
        const cardCats = (card.getAttribute('data-pcat') || '').split(/\s+/);
        if (pcat === 'all' || cardCats.includes(pcat)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

// --- 9. CYBER SNAKE ARCADE MINI-GAME ---
function initSnakeGame() {
  const canvas = document.getElementById('snakeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const scoreEl = document.getElementById('snakeScore');
  const highScoreEl = document.getElementById('snakeHighScore');
  const btnAction = document.getElementById('btnSnakeAction');
  const btnFullscreen = document.getElementById('btnSnakeFullscreen');
  const fsIcon = document.getElementById('snakeFsIcon');
  const gameContainer = document.querySelector('.snake-game-container');
  const overlay = document.getElementById('snakeOverlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayDesc = document.getElementById('overlayDesc');
  const btnOverlayStart = document.getElementById('btnOverlayStart');

  const dpadUp = document.getElementById('dpadUp');
  const dpadDown = document.getElementById('dpadDown');
  const dpadLeft = document.getElementById('dpadLeft');
  const dpadRight = document.getElementById('dpadRight');

  const GRID_SIZE = 14;
  const CELL_SIZE = 20; // 14 * 20 = 280px

  const START_SPEED = 200; // Começa devagar (200ms)
  const MIN_SPEED = 65;    // Limite máximo arcade
  let currentSpeed = START_SPEED;

  let snake = [];
  let dir = { x: 0, y: -1 };
  let nextDir = { x: 0, y: -1 };
  let food = { x: 7, y: 4 };
  let score = 0;
  let highScore = parseInt(localStorage.getItem('lip_snake_record') || '0', 10);
  let isRunning = false;
  let gameInterval = null;
  let foodPulse = 0;

  if (highScoreEl) highScoreEl.textContent = highScore.toString();

  function getThemeColors() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'emerald';
    switch (currentTheme) {
      case 'cyan':
        return { primary: '#00f0ff', glow: 'rgba(0, 240, 255, 0.45)', body: '#0284c7' };
      case 'violet':
        return { primary: '#c084fc', glow: 'rgba(192, 132, 252, 0.45)', body: '#9333ea' };
      case 'amber':
        return { primary: '#fbbf24', glow: 'rgba(251, 191, 36, 0.45)', body: '#d97706' };
      case 'light-emerald':
      case 'light':
        return { primary: '#059669', glow: 'rgba(5, 150, 105, 0.45)', body: '#10b981' };
      case 'light-cyan':
        return { primary: '#0284c7', glow: 'rgba(2, 132, 199, 0.45)', body: '#0ea5e9' };
      case 'light-violet':
        return { primary: '#7c3aed', glow: 'rgba(124, 58, 237, 0.45)', body: '#a855f7' };
      case 'light-amber':
        return { primary: '#d97706', glow: 'rgba(217, 119, 6, 0.45)', body: '#f59e0b' };
      default:
        return { primary: '#00ff87', glow: 'rgba(0, 255, 135, 0.45)', body: '#10b981' };
    }
  }

  function spawnFood() {
    let validPos = false;
    let newFood = { x: 0, y: 0 };
    let attempts = 0;
    while (!validPos && attempts < 200) {
      attempts++;
      newFood.x = Math.floor(Math.random() * GRID_SIZE);
      newFood.y = Math.floor(Math.random() * GRID_SIZE);
      validPos = !snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y);
    }
    food = newFood;
  }

  function resetGame() {
    snake = [
      { x: 7, y: 8 },
      { x: 7, y: 9 },
      { x: 7, y: 10 },
    ];
    dir = { x: 0, y: -1 };
    nextDir = { x: 0, y: -1 };
    score = 0;
    if (scoreEl) scoreEl.textContent = '0';
    spawnFood();
  }

  function draw() {
    const colors = getThemeColors();
    foodPulse = (foodPulse + 0.12) % (Math.PI * 2);

    // Clear background
    ctx.fillStyle = '#060910';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw Food (Pulsing glowing cyber orb)
    const foodCenterX = food.x * CELL_SIZE + CELL_SIZE / 2;
    const foodCenterY = food.y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 3 + Math.sin(foodPulse) * 1.5;

    ctx.save();
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#f59e0b';
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(foodCenterX, foodCenterY, Math.max(3, radius), 0, Math.PI * 2);
    ctx.fill();

    // Inner bright core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(foodCenterX, foodCenterY, Math.max(1.5, radius * 0.45), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw Snake Body
    for (let i = snake.length - 1; i >= 0; i--) {
      const seg = snake[i];
      const isHead = i === 0;
      const px = seg.x * CELL_SIZE + 1.5;
      const py = seg.y * CELL_SIZE + 1.5;
      const size = CELL_SIZE - 3;
      const cornerRadius = isHead ? 6 : 4;

      ctx.save();
      if (isHead) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = colors.primary;
        ctx.fillStyle = colors.primary;
      } else {
        const alpha = Math.max(0.4, 1 - (i / snake.length) * 0.55);
        ctx.fillStyle = colors.body;
        ctx.globalAlpha = alpha;
      }

      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(px, py, size, size, cornerRadius);
      } else {
        ctx.rect(px, py, size, size);
      }
      ctx.fill();

      // If head, draw small cyber eyes
      if (isHead) {
        ctx.fillStyle = '#060910';
        let eye1X, eye1Y, eye2X, eye2Y;
        if (dir.x === 1) {
          eye1X = px + size - 4; eye1Y = py + 4;
          eye2X = px + size - 4; eye2Y = py + size - 4;
        } else if (dir.x === -1) {
          eye1X = px + 4; eye1Y = py + 4;
          eye2X = px + 4; eye2Y = py + size - 4;
        } else if (dir.y === 1) {
          eye1X = px + 4; eye1Y = py + size - 4;
          eye2X = px + size - 4; eye2Y = py + size - 4;
        } else {
          eye1X = px + 4; eye1Y = py + 4;
          eye2X = px + size - 4; eye2Y = py + 4;
        }
        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, 1.8, 0, Math.PI * 2);
        ctx.arc(eye2X, eye2Y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  function step() {
    dir = { ...nextDir };
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Collision with walls
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      gameOver();
      return;
    }

    // Collision with self
    if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      gameOver();
      return;
    }

    // Move forward
    snake.unshift(head);

    // Check if food eaten
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      if (scoreEl) scoreEl.textContent = score.toString();
      soundEngine.playEatFood();

      // New high score check
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('lip_snake_record', highScore.toString());
        if (highScoreEl) highScoreEl.textContent = highScore.toString();
      }

      spawnFood();
      speedUp();
    } else {
      snake.pop();
    }

    draw();
  }

  function speedUp() {
    clearInterval(gameInterval);
    // Começa devagar e acelera a cada ponto/comida capturada (+10 pts)
    const pointsEaten = Math.floor(score / 10);
    currentSpeed = Math.max(MIN_SPEED, START_SPEED - (pointsEaten * 6));
    gameInterval = setInterval(step, currentSpeed);
  }

  function startGame() {
    clearInterval(gameInterval);
    resetGame();
    currentSpeed = START_SPEED;
    isRunning = true;
    if (overlay) overlay.classList.add('hidden');
    if (btnAction) {
      btnAction.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Reiniciar';
    }
    soundEngine.playSwitch();
    soundEngine.startArcadeMusic();
    draw();
    gameInterval = setInterval(step, currentSpeed);
  }

  function gameOver() {
    isRunning = false;
    clearInterval(gameInterval);
    soundEngine.stopArcadeMusic();
    soundEngine.playGameOver();

    if (overlayTitle) {
      overlayTitle.textContent = 'GAME OVER';
      overlayTitle.className = 'game-over-title';
    }
    if (overlayDesc) {
      overlayDesc.innerHTML = `Pontuação: <strong>${score}</strong> | Recorde: <strong>${highScore}</strong><br>Pressione o botão para tentar novamente!`;
    }
    if (btnOverlayStart) {
      btnOverlayStart.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Jogar Novamente';
    }
    if (btnAction) {
      btnAction.innerHTML = '<i class="fa-solid fa-play"></i> Iniciar';
    }
    if (overlay) overlay.classList.remove('hidden');
  }

  function changeDirection(newDir) {
    // Prevent 180 degree turns
    if (newDir.x !== 0 && dir.x !== 0) return;
    if (newDir.y !== 0 && dir.y !== 0) return;
    nextDir = newDir;
    soundEngine.playClick();
  }

  // Key listeners
  window.addEventListener('keydown', (e) => {
    // Only capture keys if snake screen is active
    const snakeScreen = document.getElementById('screen-snake');
    if (!snakeScreen || !snakeScreen.classList.contains('active')) return;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        changeDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        changeDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        e.preventDefault();
        changeDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        e.preventDefault();
        changeDirection({ x: 1, y: 0 });
        break;
      case ' ':
        e.preventDefault();
        if (!isRunning) startGame();
        break;
    }
  });

  // D-Pad Touch / Pointer listeners
  function setupDpadBtn(btn, direction) {
    if (!btn) return;
    const trigger = (e) => {
      e.preventDefault();
      if (!isRunning) {
        startGame();
      }
      changeDirection(direction);
    };
    btn.addEventListener('pointerdown', trigger);
  }

  setupDpadBtn(dpadUp, { x: 0, y: -1 });
  setupDpadBtn(dpadDown, { x: 0, y: 1 });
  setupDpadBtn(dpadLeft, { x: -1, y: 0 });
  setupDpadBtn(dpadRight, { x: 1, y: 0 });

  // Touch Swipe on Canvas for Mobile
  let touchStartX = 0;
  let touchStartY = 0;
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  canvas.addEventListener('touchend', (e) => {
    if (e.changedTouches.length > 0) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 20) {
        if (!isRunning) startGame();
        if (absDx > absDy) {
          if (dx > 0) changeDirection({ x: 1, y: 0 });
          else changeDirection({ x: -1, y: 0 });
        } else {
          if (dy > 0) changeDirection({ x: 0, y: 1 });
          else changeDirection({ x: 0, y: -1 });
        }
      }
    }
  }, { passive: true });

  // Buttons
  if (btnAction) {
    btnAction.addEventListener('click', () => {
      startGame();
    });
  }
  if (btnOverlayStart) {
    btnOverlayStart.addEventListener('click', () => {
      startGame();
    });
  }

  // Fullscreen toggle logic
  function toggleFullscreen() {
    if (!gameContainer) return;
    const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement || gameContainer.classList.contains('fullscreen-mode'));

    if (!isFs) {
      if (gameContainer.requestFullscreen) {
        gameContainer.requestFullscreen().catch(() => {});
      } else if (gameContainer.webkitRequestFullscreen) {
        gameContainer.webkitRequestFullscreen();
      }
      gameContainer.classList.add('fullscreen-mode');
      if (fsIcon) fsIcon.className = 'fa-solid fa-compress';
      soundEngine.playSwitch();
      showToast('Modo Tela Cheia Ativado', 'fa-expand');
    } else {
      if (document.exitFullscreen && (document.fullscreenElement || document.webkitFullscreenElement)) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen && (document.fullscreenElement || document.webkitFullscreenElement)) {
        document.webkitExitFullscreen();
      }
      gameContainer.classList.remove('fullscreen-mode');
      if (fsIcon) fsIcon.className = 'fa-solid fa-expand';
      soundEngine.playClick();
      showToast('Modo Padrão', 'fa-compress');
    }
  }

  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', toggleFullscreen);
  }

  document.addEventListener('fullscreenchange', () => {
    const isFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
    if (!isFs) {
      if (gameContainer) gameContainer.classList.remove('fullscreen-mode');
      if (fsIcon) fsIcon.className = 'fa-solid fa-expand';
    } else {
      if (gameContainer) gameContainer.classList.add('fullscreen-mode');
      if (fsIcon) fsIcon.className = 'fa-solid fa-compress';
    }
  });

  // Initial draw of starting board
  resetGame();
  draw();

  // Audio Hook: chamado quando o som do site é ativado/desativado pelo botão HUD
  window.checkSnakeAudioResume = () => {
    const snakeScreen = document.getElementById('screen-snake');
    if (snakeScreen && snakeScreen.classList.contains('active')) {
      if (isRunning && !soundEngine.muted) {
        soundEngine.startArcadeMusic();
      }
    }
  };
}

// --- 10. MODAL MANAGEMENT & CLIPBOARD TOAST ---
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    soundEngine.playSwitch();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    soundEngine.playClick();
  }
}

function initModals() {
  // Contact Modal
  const openContactBtn = document.getElementById('btnOpenContact');
  const closeContactBtn = document.getElementById('btnCloseContact');
  const contactModal = document.getElementById('contactModal');

  if (openContactBtn) openContactBtn.addEventListener('click', () => openModal('contactModal'));
  if (closeContactBtn) closeContactBtn.addEventListener('click', () => closeModal('contactModal'));
  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeModal('contactModal');
    });
  }

  // Share / QR Modal
  const openShareBtn = document.getElementById('btnShareModal');
  const closeShareBtn = document.getElementById('btnCloseShare');
  const shareModal = document.getElementById('shareModal');

  if (openShareBtn) openShareBtn.addEventListener('click', () => openModal('shareModal'));
  if (closeShareBtn) closeShareBtn.addEventListener('click', () => closeModal('shareModal'));
  if (shareModal) {
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) closeModal('shareModal');
    });
  }

  // Theme Selector Modal
  const openThemeBtn = document.getElementById('btnThemeToggle');
  const closeThemeBtn = document.getElementById('btnCloseTheme');
  const themeModal = document.getElementById('themeModal');

  if (openThemeBtn) openThemeBtn.addEventListener('click', () => openModal('themeModal'));
  if (closeThemeBtn) closeThemeBtn.addEventListener('click', () => closeModal('themeModal'));
  if (themeModal) {
    themeModal.addEventListener('click', (e) => {
      if (e.target === themeModal) closeModal('themeModal');
    });
  }

  // Copy Email
  const copyEmailCard = document.getElementById('btnCopyEmail');
  if (copyEmailCard) {
    copyEmailCard.addEventListener('click', () => {
      const email = 'felipe125dev@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        soundEngine.playSuccess();
        showToast('E-mail copiado para a área de transferência!', 'fa-copy');
      });
    });
  }

  // Copy Page Link
  const copyLinkBtn = document.getElementById('btnCopyPageLink');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        soundEngine.playSuccess();
        showToast('Link do perfil copiado com sucesso!', 'fa-link');
      });
    });
  }

  // Download CV Feedback
  const downloadCvBtn = document.getElementById('btnDownloadCV');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', () => {
      soundEngine.playSuccess();
      showToast('Baixando currículo de Felipe Silva...', 'fa-file-arrow-down');
    });
  }

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('contactModal');
      closeModal('shareModal');
      closeModal('themeModal');
    }
  });
}

// Toast Function
let toastTimer;
function showToast(message, iconClass = 'fa-circle-check') {
  const toast = document.getElementById('cyberToast');
  const msgEl = document.getElementById('toastMsg');
  const iconEl = toast ? toast.querySelector('.toast-icon') : null;

  if (!toast || !msgEl) return;

  if (iconEl) iconEl.className = `fa-solid ${iconClass} toast-icon`;
  msgEl.textContent = message;

  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// --- 11. BACKGROUND CYBER CANVAS ANIMATION ---
function initCyberCanvas() {
  const canvas = document.getElementById('cyber-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 24), 60);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      size: Math.random() * 2 + 1,
    });
  }

  function getThemeColor() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'emerald';
    switch (currentTheme) {
      case 'cyan': return '0, 240, 255';
      case 'violet': return '192, 132, 252';
      case 'amber': return '251, 191, 36';
      case 'light-emerald':
      case 'light': return '5, 150, 105';
      case 'light-cyan': return '2, 132, 199';
      case 'light-violet': return '124, 58, 237';
      case 'light-amber': return '217, 119, 6';
      default: return '0, 255, 135';
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    const colorRGB = getThemeColor();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colorRGB}, 0.5)`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${colorRGB}, ${(1 - dist / 110) * 0.18})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

// --- 12. INITIALIZATION ON DOM READY ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  init3DTilt();
  initFilters();
  initSnakeGame();
  initModals();
  initCyberCanvas();

  // Avatar switch click
  const avatarBox = document.getElementById('avatarBox');
  if (avatarBox) avatarBox.addEventListener('click', cycleAvatar);

  // Audio button click
  const soundBtn = document.getElementById('btnSoundToggle');
  if (soundBtn) soundBtn.addEventListener('click', () => soundEngine.toggleSound());
});