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
 * - Built-in Interactive Cyber Terminal CLI
 * - Avatar Rotator (Photo / Gif / Banner)
 * - Category Filter Engine for Skills & Projects
 * - Clipboard Copy & Cyber Toast Notifications
 * ============================================================================
 */

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
    } else {
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
}

const soundEngine = new CyberAudioEngine();

// --- 2. MULTI-THEME NEON ENGINE ---
const themes = ['emerald', 'cyan', 'violet', 'amber'];
let currentThemeIndex = 0;

function initTheme() {
  const savedTheme = localStorage.getItem('lip_theme') || 'emerald';
  const foundIdx = themes.indexOf(savedTheme);
  currentThemeIndex = foundIdx >= 0 ? foundIdx : 0;
  applyTheme(themes[currentThemeIndex], false);
}

function cycleTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  const nextTheme = themes[currentThemeIndex];
  applyTheme(nextTheme, true);
}

function applyTheme(themeName, notify = false) {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('lip_theme', themeName);

  if (notify) {
    soundEngine.playSuccess();
    const names = {
      emerald: 'Emerald Matrix',
      cyan: 'Cyber Cyan',
      violet: 'Neon Synthwave',
      amber: 'Solar Gold',
    };
    showToast(`Tema: ${names[themeName]}`, 'fa-palette');
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

  soundEngine.playSwitch();
}

// Make goToScreen globally accessible for HTML onclick attributes
window.goToScreen = goToScreen;

// --- 6. STABLE CARD POSITIONING (Sem tremores) ---
function init3DTilt() {
  // Desativado para manter o card 100% fixo, estável e elegante sem tremer
}

// --- 7. AVATAR CYCLER EASTER EGG ---
const avatars = ['img/perfil.jpg', 'img/lipe.gif', 'img/banner-lipe.png'];
let avatarIdx = 0;

function cycleAvatar() {
  const avatarImg = document.getElementById('profileAvatarImg');
  if (!avatarImg) return;
  avatarIdx = (avatarIdx + 1) % avatars.length;
  avatarImg.src = avatars[avatarIdx];
  soundEngine.playSuccess();
  showToast('Avatar Alternado!', 'fa-arrows-rotate');
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
        if (pcat === 'all' || card.getAttribute('data-pcat') === pcat) {
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

// --- 9. INTERACTIVE CYBER TERMINAL CLI ---
function initTerminal() {
  const form = document.getElementById('terminalForm');
  const input = document.getElementById('terminalInput');
  const output = document.getElementById('terminalOutput');
  const clearBtn = document.getElementById('btnTerminalClear');
  const chips = document.querySelectorAll('.t-chip');

  if (!form || !input || !output) return;

  function appendLine(text, type = 'text') {
    const line = document.createElement('div');
    line.className = `t-line ${type}`;
    line.innerHTML = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function handleCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    soundEngine.playClick();
    appendLine(`felipe@cyberdeck:~$ ${cmd}`, 'cmd');

    switch (cmd) {
      case 'help':
        appendLine(
          `⚡ COMANDOS DISPONÍVEIS:<br>` +
          `• <strong>whoami</strong>: Informações sobre Felipe Silva<br>` +
          `• <strong>skills</strong>: Resumo das principais habilidades<br>` +
          `• <strong>projects</strong>: Lista de projetos desenvolvidos<br>` +
          `• <strong>contact</strong>: Abrir canais de comunicação<br>` +
          `• <strong>theme</strong>: Alternar paleta neon do card<br>` +
          `• <strong>matrix</strong>: Executar sequência visual Matrix<br>` +
          `• <strong>clear</strong>: Limpar a tela do terminal`,
          'info'
        );
        break;

      case 'whoami':
        appendLine(
          `👤 <strong>Felipe Silva</strong> (@LipDev)<br>` +
          `Graduando em Ciência da Computação (Estácio) | Técnico em ADS (EEEP).<br>` +
          `Desenvolvedor focado em interfaces elegantes e tecnologia inovadora.`,
          'res'
        );
        break;

      case 'skills':
        appendLine(
          `💻 <strong>STACK PRINCIPAL:</strong><br>` +
          `Frontend: HTML5, CSS3, JavaScript (ES6+), UX/UI Design<br>` +
          `Backend: PHP, Node.js, Python, Java POO, C/C++<br>` +
          `Dados & Ferramentas: MySQL, Streamlit, Git/GitHub, GenAI`,
          'res'
        );
        break;

      case 'projects':
        appendLine(
          `🚀 <strong>PROJETOS PUBLICADOS (Mais Recentes no Topo):</strong><br>` +
          `1. FinnBot AI (Python & IA Financeira - 2026)<br>` +
          `2. Jogos de Matemática (Plataforma Gamificada - 2025)<br>` +
          `3. Delicious Burger (Delivery & Cardápio Digital - 2025)<br>` +
          `4. MedClinic (Sistema de Agendamento Clínico V1 & V2 - 2024)<br>` +
          `5. CandyDreams (E-commerce de Confeitaria - 2024)`,
          'res'
        );
        break;

      case 'contact':
        appendLine(`📡 Abrindo painel de conexões diretas...`, 'info');
        openModal('contactModal');
        break;

      case 'theme':
        cycleTheme();
        appendLine(`🎨 Tema visual alterado com sucesso!`, 'info');
        break;

      case 'matrix':
        appendLine(`🟢 01000110 01000101 01001100 01001001 01010000 01000101`, 'info');
        appendLine(`🟢 ACESSO CONCEDIDO: A MATRIX RECONHECE O TALENTO.`, 'info');
        break;

      case 'clear':
        output.innerHTML = '';
        appendLine(`⚡ Terminal limpo. Digite <strong>help</strong> para comandos.`, 'info');
        break;

      case 'sudo':
        appendLine(`👑 Acesso Root Irrestrito: Felipe Silva é o arquiteto do seu futuro.`, 'info');
        break;

      default:
        appendLine(`Comando '${cmd}' não reconhecido. Digite <strong>help</strong>.`, 'warn');
        break;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value;
    input.value = '';
    handleCommand(val);
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) handleCommand(cmd);
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      output.innerHTML = '';
      appendLine(`⚡ Terminal limpo. Digite <strong>help</strong> para comandos.`, 'info');
      soundEngine.playClick();
    });
  }
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

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('contactModal');
      closeModal('shareModal');
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
  initTerminal();
  initModals();
  initCyberCanvas();

  // Avatar switch click
  const avatarBox = document.getElementById('avatarBox');
  if (avatarBox) avatarBox.addEventListener('click', cycleAvatar);

  // Audio button click
  const soundBtn = document.getElementById('btnSoundToggle');
  if (soundBtn) soundBtn.addEventListener('click', () => soundEngine.toggleSound());

  // Theme button click
  const themeBtn = document.getElementById('btnThemeToggle');
  if (themeBtn) themeBtn.addEventListener('click', cycleTheme);
});