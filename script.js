const Prioridades = {
  ALTA: 0,
  MEDIA: 1,
  BAIXA: 2,
};

class Fila {
  constructor(algoritmo, tipoProcesso, prioridade, listaDeProcessos) {
    this.algoritmo = algoritmo;
    this.tipoProcesso = tipoProcesso;
    this.prioridade = prioridade;
    this.listaDeProcessos = listaDeProcessos;
  }
}

class Processo {
  constructor(tempoTotal, tempoExecutado) {
    this.tempoTotal = tempoTotal;
    this.tempoExecutado = tempoExecutado;
  }
}

var filas = [
  new Fila("FIFO", "Sistema", "Alta", []),
  new Fila("Circular", "Iterativo", "Média", []),
  new Fila("Round Robin", "Batch", "Baixa", []),
];

let tempoTotalDeExecucaoDaCPU = 0;

function adicionarProcesso(filaIndex, tempoTotal, tempoExecutado) {
  if (filaIndex >= 0 && filaIndex < filas.length) {
    const novoProcesso = new Processo(tempoTotal, tempoExecutado);
    filas[filaIndex].listaDeProcessos.push(novoProcesso);
    console.log(`Processo adicionado à fila ${filaIndex}:`);
    console.log("Tempo Total:", tempoTotal);
    console.log("Tempo Executado:", tempoExecutado);
    adicionarSpinner(filaIndex);
  } else {
    console.error("Índice de fila inválido.");
  }
}



function adicionarSpinner(prioridade) {
  var idDaDiv;
  var corSpinner;

  switch (prioridade) {
    case Prioridades.ALTA:
      idDaDiv = "filaAltaPrioridade";
      corSpinner = "text-danger";
      break;
    case Prioridades.MEDIA:
      idDaDiv = "filaMediaPrioridade";
      corSpinner = "text-warning";
      break;
    case Prioridades.BAIXA:
      idDaDiv = "filaBaixaPrioridade";
      corSpinner = "text-success";
      break;

    default:
      break;
  }

  // Obtém a referência para a div com o ID "filaAltaPrioridade"
  const filaAltaPrioridadeDiv = document.getElementById(idDaDiv);

  if (filaAltaPrioridadeDiv) {
    // Cria uma nova div
    const spinnerDiv = document.createElement("div");

    // Adiciona classes à nova div
    spinnerDiv.classList.add("spinner-grow", corSpinner);

    // Adiciona a nova div à div "filaAltaPrioridade"
    filaAltaPrioridadeDiv.appendChild(spinnerDiv);
  } else {
    console.error('Div com o ID "filaAltaPrioridade" não encontrada.');
  }
}

function criarFila(algoritmo, tipoProcesso, prioridade, listaDeProcessos) {
  filas.push(new Fila(algoritmo, tipoProcesso, prioridade, listaDeProcessos));
}

function verificarProcessosNaFilaAlta() {
  return filas[Prioridades.ALTA].listaDeProcessos.length > 0;
}

function verificarProcessosNaFilaMedia() {
  return filas[Prioridades.MEDIA].listaDeProcessos.length > 0;
}

function verificarProcessosNaFilaBaixa() {
  return filas[Prioridades.BAIXA].listaDeProcessos.length > 0;
}

function executarUnidadeDoProcesso(prioridade) {
  // Os dois comandos fazem a mesma coisa, adicionam 1 no tempoExecutado
  // filas[prioridade].listaDeProcessos[0].tempoExecutado = filas[prioridade].listaDeProcessos[0].tempoExecutado + 1;
  filas[prioridade].listaDeProcessos[0].tempoExecutado += 1;
}

function removerProcessoFinalizadoDaFila(prioridade) {
  if (
    filas[prioridade].listaDeProcessos[0].tempoExecutado >=
    filas[prioridade].listaDeProcessos[0].tempoTotal
  ) {
    // o shift por padrão sempre removerá o primeiro item da lista 
    filas[prioridade].listaDeProcessos.shift();
    removerDivPorPrioridade(prioridade)
  }
}

function selecionarProcessoParaExecucao() {
  switch (true) {
    case verificarProcessosNaFilaAlta():
      executarUnidadeDoProcesso(Prioridades.ALTA);
      removerProcessoFinalizadoDaFila(Prioridades.ALTA);
      break;
    case verificarProcessosNaFilaMedia():
      executarUnidadeDoProcesso(Prioridades.MEDIA);
      removerProcessoFinalizadoDaFila(Prioridades.MEDIA);
      break;
    case verificarProcessosNaFilaBaixa():
      executarUnidadeDoProcesso(Prioridades.BAIXA);
      removerProcessoFinalizadoDaFila(Prioridades.BAIXA);
      break;
    default:
      console.log("Nenhum processo para ser executado!");
      break;
  }
}

function removerDivPorPrioridade(prioridade) {
    var classe;
    
    switch (prioridade) {
        case Prioridades.ALTA:
          classe = "spinner-grow text-danger";
          break;
        case Prioridades.MEDIA:
          classe = "spinner-grow text-warning"
          break;
        case Prioridades.BAIXA:
            classe = "spinner-grow text-success"
          break;
    
        default:
          break;
      }
    // Encontra a primeira div com a classe especificada
    const divParaRemover = document.getElementsByClassName(`${classe}`);
  
    if (divParaRemover.length > 0) {
      // Remove a div encontrada
     divParaRemover[0].parentNode.removeChild(divParaRemover[0]);
    } else {
      console.error(`Nenhuma div encontrada com a classe "${classe}".`);
    }
  }

function iniciarContador() {
  
  setInterval(function () {
    tempoTotalDeExecucaoDaCPU++;
    const contador = document.getElementById('contador')
    contador.textContent =tempoTotalDeExecucaoDaCPU;

    selecionarProcessoParaExecucao();
  }, 1000); // 1000 milissegundos = 1 segundo
}

iniciarContador();

