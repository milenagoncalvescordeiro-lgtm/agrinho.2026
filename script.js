// Variáveis do Jogo
let droneX, droneY;
let droneVel = 5;
let pontos = 0;
let energia = 100;
let estadoJogo = "JOGAR"; // JOGAR, FIM

// Itens Sustentáveis (Nutrientes / Água)
let itemX, itemY;
let itemTipo; // "agua" ou "organico"

// Obstáculos (Pragas)
let pragaX, pragaY;
let pragaVel = 4;

function setup() {
  createCanvas(800, 500);
  resetarJogo();
}

function draw() {
  background('#E3F2FD'); // Céu limpo

  if (estadoJogo === "JOGAR") {
    atualizarJogo();
    desenharCenario();
    desenharElementos();
    desenharPainel();
  } else if (estadoJogo === "FIM") {
    desenharTelaFim();
  }
}

// Inicializa ou reinicia as posições do jogo
function resetarJogo() {
  droneX = width / 2;
  droneY = 150;
  pontos = 0;
  energia = 100;
  estadoJogo = "JOGAR";
  spawnarItem();
  spawnarPraga();
}

// Lógica de movimentação e colisões
function atualizarJogo() {
  // Controle do Drone por Setas do Teclado
  if (keyIsDown(LEFT_ARROW))  droneX -= droneVel;
  if (keyIsDown(RIGHT_ARROW)) droneX += droneVel;
  if (keyIsDown(UP_ARROW))    droneY -= droneVel;
  if (keyIsDown(DOWN_ARROW))  droneY += droneVel;

  // Restringir drone dentro da tela de voo (não entra na terra profunda)
  droneX = constrain(droneX, 20, width - 20);
  droneY = constrain(droneY, 20, 360);

  // Movimentação da Praga (Inimigo)
  pragaX -= pragaVel;
  if (pragaX < -30) {
    spawnarPraga();
    pontos += 5; // Bônus por manejar a lavoura sem veneno
  }

  // Detecção de Colisão: Drone pega Item Sustentável
  let distItem = dist(droneX, droneY, itemX, itemY);
  if (distItem < 30) {
    if (itemTipo === "agua") {
      energia = min(energia + 20, 100); // Recupera energia/água da fazenda
    } else {
      pontos += 10; // Ganha pontos de sustentabilidade
    }
    spawnarItem();
  }

  // Detecção de Colisão: Drone bate na Praga
  let distPraga = dist(droneX, droneY, pragaX, pragaY);
  if (distPraga < 35) {
    energia -= 25;
    spawnarPraga();
    if (energia <= 0) {
      estadoJogo = "FIM";
    }
  }
}

// Spawna os itens ecológicos em posições aleatórias na lavoura
function spawnarItem() {
  itemX = random(50, width - 50);
  itemY = random(200, 350);
  itemTipo = random(["agua", "organico"]);
}

// Spawna as pragas biológicas vindo da direita
function spawnarPraga() {
  pragaX = width + 50;
  pragaY = random(180, 350);
}

// Arte do Cenário (Terra e Plantação)
function desenharCenario() {
  // Solo fértil
  fill('#4E342E'); 
  rect(0, 380, width, 120);

  // Linhas de plantio sustentável (Verde Forte)
  fill('#2E7D32');
  for (let i = 0; i < 4; i++) {
    rect(0, 395 + i * 25, width, 10);
  }
}

// Desenha o Drone, Itens e Pragas usando formas geométricas limpas
function elementosGraficos() {
  // --- DESENHAR DRONE ---
  push();
  translate(droneX, droneY);
  // Feixe de varredura bio-tecnológica
  stroke(0, 230, 118, 40);
  strokeWeight(3);
  line(0, 0, -30, 380 - droneY);
  line(0, 0, 30, 380 - droneY);

  // Corpo do Drone (Branco e Verde - Tecnologia Limpa)
  noStroke();
  fill('#FFFFFF');
  rect(-25, -6, 50, 12, 4);
  fill('#00E676');
  ellipse(0, 0, 16, 16);
  // Hélices
  fill('#37474F');
  ellipse(-25, -6, 25, 4);
  ellipse(25, -6, 25, 4);
  pop();

  // --- DESENHAR ITEM SUSTENTÁVEL ---
  if (itemTipo === "agua") {
    fill('#29B6F6'); // Azul Água de Reuso
    ellipse(itemX, itemY, 20, 20);
    fill(255);
    textSize(10);
    text("H2O", itemX - 9, itemY + 4);
  } else {
    fill('#8D6E63'); // Adubo Orgânico/Nutriente
    rect(itemX - 10, itemY - 10, 20, 20, 3);
    fill('#FFF');
    textSize(12);
    text("🌱", itemX - 7, itemY + 5);
  }

  // --- DESENHAR PRAGA ---
  fill('#D32F2F'); // Inseto/Praga Vermelho
  ellipse(pragaX, pragaY, 25, 18);
  fill('#1A1A1A');
  ellipse(pragaX - 8, pragaY - 2, 6, 6); // Olho do inseto
}

// Interface gráfica e placar
function desenharPainel() {
  // Barra de status
  fill('#1A237E');
  rect(0, 0, width, 50);

  // Textos do Painel
  fill(255);
  textSize(16);
  textStyle(BOLD);
  text("AGRO SUSTENTÁVEL INTERATIVO", 20, 31);

  textStyle(NORMAL);
  textSize(14);
  text(`Sustentabilidade: ${pontos} pts`, 400, 31);
  
  // Barra de Energia/Saúde da Lavoura
  text("Eficiência do Solo:", 580, 31);
  fill('#37474F');
  rect(700, 18, 80, 15, 3);
  if (energia > 40) fill('#00E676'); // Verde se estiver bom
  else fill('#FF1744'); // Vermelho se estiver crítico
  rect(700, 18, map(energia, 0, 100, 0, 80), 15, 3);
}

// Tela de Game Over estilizada
function desenharTelaFim() {
  background('#1A237E');
  
  fill(255);
  textAlign(CENTER);
  textSize(32);
  textStyle(BOLD);
  text("CICLO DE MANEJO CONCLUÍDO", width / 2, height / 2 - 40);
  
  textSize(20);
  textStyle(NORMAL);
  fill('#00E676');
  text(`Pontuação de Sustentabilidade: ${pontos} pontos`, width / 2, height / 2 + 10);
  
  fill(255);
  textSize(14);
  text("Pressione [ESPAÇO] para iniciar um novo manejo tecnológico", width / 2, height / 2 + 60);
  textAlign(LEFT); // Reseta alinhamento
}

// Detecta cliques de teclas específicas (Espaço para reiniciar)
function keyPressed() {
  if (key === ' ' && estadoJogo === "FIM") {
    resetarJogo();
  }
}

// Renomeando para chamada correta de renderização interna
function desenharElementos() {
  elementosGraficos();
}
