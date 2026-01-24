const textos = ["Felipe Silva", "Frontend Developer"];
const elementoDestaque = document.getElementById("digitando");
let textoIndex = 0;
let charIndex = 0;
let isApagando = false;

function digitar() {
  const textoAtual = textos[textoIndex];
  
  if (isApagando) {
    elementoDestaque.textContent = textoAtual.substring(0, charIndex - 1);
    charIndex--;
  } else {
    elementoDestaque.textContent = textoAtual.substring(0, charIndex + 1);
    charIndex++;
  }

  let velocidade = isApagando ? 50 : 150;

  if (!isApagando && charIndex === textoAtual.length) {
    isApagando = true;
    velocidade = 2000;
  } else if (isApagando && charIndex === 0) {
    isApagando = false;
    textoIndex = (textoIndex + 1) % textos.length;
    velocidade = 500;
  }
  setTimeout(digitar, velocidade);
}

function goToScreen(screenId) {
  const screens = document.querySelectorAll('.card-screen');
  screens.forEach(s => s.classList.remove('active'));

  const target = document.getElementById(`screen-${screenId}`);
  if (target) {
    target.classList.add('active');
    
    // Ativa o reveal dos elementos internos
    const revealElements = target.querySelectorAll('.reveal');
    revealElements.forEach(el => {
      el.classList.remove('active');
      setTimeout(() => el.classList.add('active'), 100);
    });
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  digitar();
  // Ativa reveal da primeira tela
  setTimeout(() => {
    document.querySelectorAll('#screen-home .reveal').forEach(el => el.classList.add('active'));
  }, 200);
});