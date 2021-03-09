const Genius = {
  nomeDasCores: ["green", "red", "yellow", "blue"],
  notas: [261.6, 293.7, 329.6, 392.0],

  sequencia: [],
  sequenciaDoJogador: [],
  gameOver: true,
  contagemDeRodadas: 0,
  limiteDeRodadas: 6,

  titulo: document.querySelector("#controls > h1"),
  botaoDePlay: document.querySelector("#controls > button"),

  comecarJogo() {
    this.contagemDeRodadas = 0;
    this.gameOver = false;
    this.sequencia = [];
    this.botaoDePlay.innerHTML = "Recomeçar";
    this.escrever("Genius!");
    this.habilitarBotoes();
    this.novaRodada();
  },

  novaRodada() {
    this.contagemDeRodadas++;
    this.sequenciaDoJogador = [];
    this.gerarToque();
    setTimeout(() => { this.tocarSequencia() }, 1000)
  },

  jogar(indiceDaCor) {
    this.tocarNota(indiceDaCor);

    if (this.gameOver) return;

    this.sequenciaDoJogador.push(indiceDaCor);

    this.sequenciaDoJogador.forEach((jogada, index) => {
      if (jogada != this.sequencia[index]) {
        this.finalizarJogo("Você Perdeu!");
      }
    });

    if (this.gameOver) return;

    if (this.sequenciaDoJogador.length == this.sequencia.length) {
      if (this.contagemDeRodadas >= this.limiteDeRodadas) {
        this.finalizarJogo("Você Ganhou!");
      } else {
        this.novaRodada();
      }
    }
  },

  gerarToque() {
    const randomInt = this.gerarNumeroAleatorio();
    this.sequencia.push(randomInt);
  },

  gerarNumeroAleatorio() {
    return Math.floor(Math.random() * 4);
  },

  tocarSequencia() {
    this.desabilitarBotoes();

    let iteradorDaSequencia = 0;
    let devoClarear = true;

    const velocidade = 500;

    const intervalo = setInterval(() => {
      const indiceDaSequencia = this.sequencia[iteradorDaSequencia];
      const cor = this.nomeDasCores[indiceDaSequencia];
      const botaoDeCor = document.getElementById(cor);

      if (devoClarear) {
        botaoDeCor.classList.add('active')
        this.tocarNota(indiceDaSequencia);
      } else {
        botaoDeCor.classList.remove('active')
        iteradorDaSequencia++;
      }

      if (iteradorDaSequencia >= this.sequencia.length) {
        clearInterval(intervalo);
        this.habilitarBotoes();
      }

      devoClarear = !devoClarear;
    }, velocidade);
  },

  habilitarBotoes() {
    const botoes = document.querySelectorAll("#buttons > button");
    botoes.forEach((botao) => {
      botao.removeAttribute("disabled");
    });
  },

  desabilitarBotoes() {
    const botoes = document.querySelectorAll("#buttons > button");
    botoes.forEach((botao) => {
      botao.setAttribute("disabled", "disabled");
    });
  },

  finalizarJogo(mensagem) {
    this.gameOver = true;
    this.escrever(mensagem);
    this.desabilitarBotoes();
  },

  escrever(texto) {
    this.titulo.innerHTML = texto;
  },

  tocarNota(indiceDaNota) {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(this.notas[indiceDaNota], "8n");
  },
};

document.querySelector("#controls button").onclick = () => {
  Genius.comecarJogo();
};
document.querySelectorAll("#buttons > button").forEach((botao, index) => {
  botao.onclick = () => {
    Genius.jogar(index);
  };
});
