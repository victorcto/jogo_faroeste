//VARIAVEIS
var i, t, v; //Variáveis de repetições
var jgd0; //Variável pra guardar a imagem do jogador
var ini0; //Variável pra guardar a imagem do inimigo
var x_jgd = 50; //Posição x do jogador
var y_jgd = 150; //Posição y do jogador
var raio_jgd = 20; //Raio do jogador
var x_dsp; //Posição x do disparo
var y_dsp; //Posição y do disparo
var raio_dsp = 5; //Raio do disparo
var x_ini = []; //Posição x do inimigo
var y_ini = []; //Posição y do inimigo
var raio_ini = 15; //Raio do inimigo
var qtMax = 6; //Quantidade máxima de inimigos
var qtAtual = 2; //Quantidade de inimigos por nível
var disparou = false; //Gatilho do disparo
var inimigo = []; //Efeito da explosão na hora da colisão
var explosao = []; //Efeito da explosão na hora da colisão
var estadoExplosao = false; //Gatilho da explosão
var explosaoX; //Efeito da explosão no eixo x
var explosaoY; //Efeito da explosão no eixo y
var contExp = 0; //Contador das imagens do inimigo
var tempo = 10; //Tempo de disparos
var vidas = 3; //Quantidade de vidas
var pontos = 0; //Quantidade de pontos
var fase = 1; //Nível
var barreiraScore = 500; //Pontos a serem atingidos para passar de nível
var tela = 1; //Valor da tela
var gameover = true; //Gatilho da musica de game over


function preload() {
    //IMAGENS
    telainicial = loadImage("assets/menu.jpg");
    fundo = loadImage("assets/fundo.jpg");
    jogador = loadImage("assets/atirador.png");
    tiro = loadImage("assets/bala.png");
    inimigo = loadImage("assets/inimigo.png");

    //SONS
    musicaprincipal = loadSound("assets/sound/musica.mp3");
    musicagameover = loadSound("assets/sound/defeat.wav");

    //LOCALIZAR AS IMAGENS DA EXPLOSÃO
    for (v = 0; v <= 9; v++) {
        explosao[v] = loadImage("assets/explosoes/explosao" + v + ".png");
    }
}

function setup() {
    createCanvas(400, 400);
    for (t = 0; t < qtMax; t++) {
        x_ini[t] = random(500, 400);
        y_ini[t] = random(0, 400);
    }
}

function mousePressed() {
    if (musicaprincipal.isPlaying()) {
        musicaprincipal.stop();
        background(0);
    } else {
        musicaprincipal.play();
        background(255)
    }
}

function draw() {
    //COMANDOS DE DESENHOS
    if (tela == 1) {
        background(255);
        image(telainicial, 0, 0, 400, 400);
        fill('#633110');
        textSize(10);
        textFont('RioGrande');
        text('Clique na tela para ativar o som', 225, 15);
        fill('#633110');
        textSize(32);
        textFont('RioGrande');
        text('Old Town Road', 70, 160);
        fill('#a57936');
        textSize(15);
        textFont('ruster');
        text('Pressione enter para iniciar', 105, 190);
        if (keyIsDown(ENTER)) {
            tela = 2;
        }
    }
    if (tela == 2) {
        background(255);
        image(fundo, 0, 0);
        imageMode(CENTER);

        //JOGADOR:
        noFill('#6eb7ad');
        noStroke('#67dbd1');
        ellipse(x_jgd, y_jgd, 2 * raio_jgd, 2 * raio_jgd);
        image(jogador, x_jgd, y_jgd);
        imageMode(CENTER);

        //INIMIGO:
        for (t = 0; t < qtAtual; t++) {
            noFill(0);
            noStroke(0);
            ellipse(x_ini[t], y_ini[t], raio_ini, raio_ini);
            image(inimigo, x_ini[t], y_ini[t]);
            imageMode(CENTER);
        }

        //ANIMAÇÃO DA EXPLOSÃO
        if (estadoExplosao == true) {
            imageMode(CENTER);
            image(explosao[contExp], explosaoX, explosaoY, 50, 50);
            contExp++;
            if (contExp > 9) {
                estadoExplosao = false;
                contExp = 0;
            }
        }

        // COMANDOS DE MOVIMENTAÇÕES
        if (keyIsDown(LEFT_ARROW)) {
            x_jgd -= 5;
        }

        if (keyIsDown(RIGHT_ARROW)) {
            x_jgd += 5;
        }

        if (keyIsDown(UP_ARROW)) {
            y_jgd -= 5;
        }

        if (keyIsDown(DOWN_ARROW)) {
            y_jgd += 5;
        }

        // COMANDOS DE RESTRIÇÕES AO MOVIEMNTO DO JOGADOR
        if (x_jgd > 400) {
            x_jgd = -random(400);
        }
        if ((y_jgd + 30) >= width) {
            y_jgd -= 5;
        }
        if ((y_jgd - 30) <= 0) {
            y_jgd += 5;
        }
        if ((x_jgd - 30) <= 0) {
            x_jgd += 5;
        }

        //MOVIMENTAÇÃO DOS INIMIGOS
        for (t = 0; t < qtAtual; t++) {
            x_ini[t] -= 2;
            if (x_ini[t] <= 0) {
                y_ini[t] = random(0, 350);
                x_ini[t] = 500;
            }
        }

        // COMANDOS DE DISPAROS
        if (keyIsDown(32) || disparou) {
            if (!disparou) {
                y_dsp = y_jgd;
            }
            disparou = true;
            noFill('#ff0101');
            noStroke('#930505');
            ellipse(x_dsp + 12, y_dsp + 11, raio_dsp, raio_dsp);
            image(tiro, x_dsp + 12, y_dsp + 11);
            if (x_dsp < width) {
                x_dsp += 10;
            } else {
                disparou = false;
                x_dsp = x_jgd;
            }
        }

        //COMANDOS DE INFORMAÇÕES
        fill('#633110');
        textSize(22);
        textFont('ruster');
        text('Vidas: ' + vidas, 19, 30);
        text('Pontos: ' + pontos, 140, 30);
        text('Fase: ' + fase, 300, 30);

        //COMANDOS DE COLISÕES
        for (t = 0; t < qtAtual; t++) {
            //COLISÃO COM O INIMIGO
            if (dist(x_jgd, y_jgd, x_ini[t], y_ini[t]) < (raio_jgd + raio_ini)) {
                x_jgd = 50;
                y_jgd = 150;
                vidas -= 1;

            }
            //COLISÃO DO DISPARO COM O INIMIGO
            if (dist(x_dsp+12, y_dsp +11, x_ini[t], y_ini[t]) < (raio_dsp + raio_ini) && disparou == true) {
                disparou = false;
                pontos += 50;
                y_ini[t] = -random(100, 500);
                x_ini[t] = random(50, 450);
                estadoExplosao = true;
                explosaoX = x_dsp + 12;
                explosaoY = y_dsp + 11;
                x_dsp = x_jgd + 9;
                y_dsp = y_jgd;
            }
        }

        //COMANDOS DE DIFICULDADES DO JOGO
        if (pontos > barreiraScore) {
            barreiraScore = barreiraScore + 600;
            fase++;
        }
        if (fase == 2) {
            qtAtual = 4;
        }
        if (fase == 3) {
            qtAtual = 6;
        }

        if (vidas <= 0) {
            tela = 3;
        }
    }
    if (tela == 3) {
        musicaprincipal.setVolume(0);
        musicagameover.setVolume(0.5);
        if (gameover == true) {
            musicagameover.play();
            gameover = false;
        }
        background(0);
        image(fundo, 0, 0);
        imageMode(CENTER);
        textSize(40);
        textFont('Eastwood');
        fill('#fff');
        text('Game Over', 80, 160);
        fill('#633110');
        textSize(20);
        text('Pontos: ' + pontos, 130, 200);
        textSize(24);
        text('Pressione ENTER para reiniciar', 20, 230);
        if (keyIsDown(ENTER)) {
            gameover = true;
            musicaprincipal.setVolume(0.5);
            tela = 2;
            vidas = 3;
            pontos = 0;
            fase = 1;
            x_jgd = 50;
            y_jgd = 150;
            for (t = 0; t < qtAtual; t++) {
                y_ini[t] = random(0, 350);
                x_ini[t] = 500;
            }
        }
    }
}