let inputTexto = document.querySelector(".input-texto");
let idioma = document.querySelector(".idioma");
let traducaoTexto = document.querySelector(".traducao");

// Mapeamento dos idiomas do select para os códigos da API MyMemory
const codigosIdiomas = {
    "Inglês": "en",
    "Alemão": "de",
    "Japonês": "ja"
};

async function traduzir() {
    let textoDigitado = inputTexto.value.trim();

    if (!textoDigitado) {
        traducaoTexto.textContent = "Digite algo para traduzir...";
        return;
    }

    // Pega o idioma selecionado e converte para o código da API
    let idiomaSelecionado = idioma.value;
    let codigoIdioma = codigosIdiomas[idiomaSelecionado];

    // Mostra feedback de loading
    traducaoTexto.textContent = "Traduzindo...";

    try {
        let endereco = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(textoDigitado) + "&langpair=pt-BR|" + codigoIdioma;

        let resposta = await fetch(endereco);
        let dados = await resposta.json();

        // Exibe a tradução na tela
        traducaoTexto.textContent = dados.responseData.translatedText;
    } catch (erro) {
        traducaoTexto.textContent = "Erro ao traduzir. Tente novamente.";
        console.error("Erro na tradução:", erro);
    }
}

// ===== Funcionalidade do Microfone (Speech Recognition) =====
let botaoMicrofone = document.querySelector(".controle button:last-child");
let gravando = false;
let reconhecimento = null;

// Verifica se o navegador suporta reconhecimento de voz
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    reconhecimento = new SpeechRecognition();
    reconhecimento.lang = "pt-BR";
    reconhecimento.continuous = false;
    reconhecimento.interimResults = false;

    reconhecimento.onresult = function (evento) {
        let textoFalado = evento.results[0][0].transcript;
        inputTexto.value = textoFalado;
        // Traduz automaticamente após capturar a fala
        traduzir();
    };

    reconhecimento.onend = function () {
        gravando = false;
        botaoMicrofone.style.backgroundColor = "#ffffff1a";
    };

    reconhecimento.onerror = function (evento) {
        gravando = false;
        botaoMicrofone.style.backgroundColor = "#ffffff1a";
        console.error("Erro no reconhecimento de voz:", evento.error);
    };
}

botaoMicrofone.addEventListener("click", function () {
    if (!reconhecimento) {
        alert("Seu navegador não suporta reconhecimento de voz.");
        return;
    }

    if (gravando) {
        reconhecimento.stop();
        gravando = false;
        botaoMicrofone.style.backgroundColor = "#ffffff1a";
    } else {
        reconhecimento.start();
        gravando = true;
        // Feedback visual — botão fica vermelho enquanto grava
        botaoMicrofone.style.backgroundColor = "#ff4444aa";
    }
});
