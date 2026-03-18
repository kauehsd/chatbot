let dados = {};
let ensinando = false;
let ultimaPergunta = "";

// carregar JSON externo
fetch("dados.json")
    .then(res => res.json())
    .then(json => {
        // mistura JSON com localStorage (se tiver)
        let local = JSON.parse(localStorage.getItem("chatbot")) || {};
        dados = { ...json, ...local };
    });

function addMsg(texto, classe) {
    let chat = document.getElementById("chatBox");
    chat.innerHTML += `<div class="msg ${classe}">${texto}</div>`;
    chat.scrollTop = chat.scrollHeight;
}

function enviar() {
    let input = document.getElementById("msg");
    let msg = input.value.toLowerCase();
    input.value = "";

    addMsg("Você: " + msg, "user");

    if (ensinando) {
        dados[ultimaPergunta] = msg;
        localStorage.setItem("chatbot", JSON.stringify(dados));
        addMsg("Bot: Aprendi algo novo 😎", "bot");
        ensinando = false;
        return;
    }

    let encontrou = false;

    for (let chave in dados) {
        if (msg.split(" ").some(p => chave.includes(p) || p.includes(chave))) {
            addMsg("Bot: " + dados[chave], "bot");
            encontrou = true;
            break;
        }
    }

    if (!encontrou) {
        addMsg("Bot: Não sei responder 😢 Quer me ensinar?", "bot");
        ultimaPergunta = msg;
        ensinando = true;
    }
}