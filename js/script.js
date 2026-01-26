function goToScreen(screenId) {
  // 1. Remove a classe 'active' de todas as telas
  const screens = document.querySelectorAll('.card-screen');
  screens.forEach(screen => {
    screen.classList.remove('active');
    
    // Pequeno delay para resetar scroll quando sair da tela
    setTimeout(() => {
      const scrollContent = screen.querySelector('.scroll-content');
      if(scrollContent) scrollContent.scrollTop = 0;
    }, 500);
  });

  // 2. Adiciona a classe 'active' na tela desejada
  const targetScreen = document.getElementById(`screen-${screenId}`);
  if (targetScreen) {
    targetScreen.classList.add('active');
  }
}

const textos = ["Felipe Silva","Frontend Developer", "<LipDev/>"];
const el = document.getElementById("digitando");

let i = 0; // Índice da palavra atual
let j = 0; // Índice da letra atual
let apagando = false;
function digitar() {
  const palavraAtual = textos[i];
  // Define o texto na tela
  el.textContent = palavraAtual.substring(0, j);
  if (!apagando) {
    // ESTÁ ESCREVENDO
    if (j < palavraAtual.length) {
      j++;
      setTimeout(digitar, 130); // Velocidade de digitação
    } else {
      // Terminou de escrever a palavra, espera antes de apagar
      apagando = true;
      setTimeout(digitar, 1500); // Espera 1.5s com o nome na tela
    }
  } else {
    // ESTÁ APAGANDO
    if (j > 0) {
      j--;
      setTimeout(digitar, 100); // Velocidade de apagar (mais rápido)
    } else {
      // Terminou de apagar, passa para o próximo nome
      apagando = false;
      i++; 
      // Se chegou no último (3), volta para o primeiro (0)
      if (i >= textos.length) {
        i = 0;
      }
      setTimeout(digitar, 200); // Pequena pausa antes de começar o próximo
    }
  }
}

digitar();