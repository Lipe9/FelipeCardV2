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