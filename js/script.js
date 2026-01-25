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


const textos = ["Felipe Silva","Frontend Developer"];
const el = document.getElementById("digitando");

let i=0,j=0,apagando=false;

function digitar(){
  el.textContent = textos[i].substring(0,j);
  if(!apagando){
    if(j < textos[i].length) j++;
    else setTimeout(()=>apagando=true,1500);
  }else{
    if(j>0) j--;
    else{
      apagando=false;
      i=(i+1)%textos.length;
    }
  }
  setTimeout(digitar,apagando?80:120);
}
digitar();