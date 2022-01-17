//Variáveis de ambiente
let seuVotoPara = document.querySelector(".d-1-1 span");
let cargo = document.querySelector(".d-1-2 span");
let descricao = document.querySelector(".d-1-4");
let aviso = document.querySelector(".d-2");
let lateral = document.querySelector(".d-1-right");
let numeros = document.querySelector(".d-1-3");

//Variáveis de controle
let etapaAtual = 0;
let numero = "";
let votoBranco = false;
let votos = [];

function comecarEtapa() {
  let etapa = etapas[etapaAtual];
  let numeroHtml = "";
  numero = "";

  for (let i = 0; i < etapa.numeros; i++) {
    i === 0 ? (numeroHtml += '<div class="numero pisca"></div>') : (numeroHtml += '<div class="numero"></div>');
  }

  //Setando as condições iniciais da urna
  seuVotoPara.style.display = "none";
  cargo.innerHTML = etapa.titulo;
  descricao.innerHTML = "";
  aviso.style.display = "none";
  lateral.innerHTML = "";
  numeros.innerHTML = numeroHtml;
}

function atualizaInterface() {
  let etapa = etapas[etapaAtual];

  //Busca o candidato digitado no JSON de candidatos
  let candidato = etapa.candidatos.filter((item) => {
    if (item.numero === numero) {
      return true;
    } else {
      return false;
    }
  });

  //Se candidato > 0, mostra as informações na tela
  if (candidato.length > 0) {
    candidato = candidato[0];
    seuVotoPara.style.display = "block";
    descricao.innerHTML = `Nome: ${candidato.nome}<br>Partido: ${candidato.partido}`;
    aviso.style.display = "block";

    let fotosHtml = "";

    for (let i in candidato.fotos) {
      if (candidato.fotos.small) {
        fotosHtml += `<div class="d-1-image small"><img src="./images/${candidato.fotos[i].url}" alt="">${candidato.fotos[i].legenda}</div>`;
      } else {
        fotosHtml += `<div class="d-1-image"><img src="./images/${candidato.fotos[i].url}" alt="">${candidato.fotos[i].legenda}</div>`;
      }
    }

    lateral.innerHTML = fotosHtml;
  } else {
    seuVotoPara.style.display = "block";
    aviso.style.display = "block";
    descricao.innerHTML = '<div class="aviso--grande pisca">VOTO NULO</div>';
  }
}

function clicou(n) {
  efeitoSonoro("botao");
  let elNumero = document.querySelector(".numero.pisca");

  if (elNumero != null) {
    elNumero.innerHTML = n;
    numero = `${numero}${n}`;

    elNumero.classList.remove("pisca");
    elNumero.nextElementSibling !== null ? elNumero.nextElementSibling.classList.add("pisca") : atualizaInterface();
  }
}

//Limpa a tela e mostra o aviso de voto em branco
function branco(n) {
  efeitoSonoro("botao");
  if (numero === "") {
    votoBranco = true;
    seuVotoPara.style.display = "block";
    aviso.style.display = "block";
    numeros.innerHTML = "";
    descricao.innerHTML = '<div class="aviso--grande pisca">VOTO EM BRANCO</div>';
    lateral.innerHTML = "";
  } else {
    alert("Não é permitido votar em BRANCO se já tiver digitado algum número!");
  }
}

//Limpa a tela e reinicia o processo de voto
function corrige(n) {
  efeitoSonoro("botao");
  comecarEtapa();
}

function confirma(n) {
  efeitoSonoro("botao");
  let etapa = etapas[etapaAtual];
  let votoConfirmado = false;

  if (votoBranco === true) {
    votoConfirmado = true;

    votos.push({
      etapa: etapas[etapaAtual].titulo,
      voto: "branco",
    });
  } else if (numero.length === etapa.numeros) {
    votoConfirmado = true;

    votos.push({
      etapa: etapas[etapaAtual].titulo,
      voto: numero,
    });
  }

  if (votoConfirmado) {
    etapaAtual++;
    if (etapas[etapaAtual] !== undefined) {
      comecarEtapa();
    } else {
      document.querySelector(".tela").innerHTML = '<div class="aviso--gigante pisca">FIM</div>';
      efeitoSonoro("fim");
      console.log(votos);
    }
  }
}

function efeitoSonoro(som) {
  let audio = new Audio(`./audio/${som}.mp3`);
  audio.play();
}

comecarEtapa();
