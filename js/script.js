let cmpCidade = document.getElementById("cidade");
let eltMensagem = document.getElementById("mensagem");
let eltCidades = document.getElementById("cidades");
let eltPrevisao = document.getElementById("previsao");

cmpCidade.addEventListener("keydown", function(chave) {
    if(chave.key == "Enter") {
        buscarCidades();
    }
});

async function buscarCidades() {
    let nmCidade = cmpCidade.value.trim();

    if(nmCidade == "") {
        eltMensagem.textContent = "Digite o nome de uma cidade";
    }else {
        eltMensagem.textContent = "Buscando cidades...";
        eltCidades.innerHTML = "";
        eltPrevisao.innerHTML = "";
        let valor = await fetch(`https://brasilapi.com.br/api/cptec/v1/cidade/${nmCidade}`);
        let dados = await valor.json();
        if(valor.ok) {
            for(let i = 0; i < dados.length; i++) {
                let eltCidade = document.createElement("button");
                eltCidade.type = "type";
                eltCidade.textContent = `${dados[i].nome} - ${dados[i].estado}`;
                eltCidade.classList.add("cidade");
                eltCidade.addEventListener("click", function() {
                    buscarPrevisao(dados[i].id);
                });
                eltCidades.appendChild(eltCidade);
            }
            eltMensagem.textContent = `${dados.length} cidade(s) encontradas(s)`;
        }else {
            eltMensagem.textContent = "Nenhuma cidade localizada.";
        }
    }    
}

async function buscarPrevisao(previsoes) {
    eltPrevisao.textContent = "Buscando previsão do tempo...";
    let valor = await fetch(`https://brasilapi.com.br/api/cptec/v1/clima/previsao/${previsoes}`);
    let dados = await valor.json();
    if(valor.ok) {
        let dias = `
            <article class="dia">
                <p class="data">Data: ${fmtData(dados.clima[0].data)}</p>
                <p>${dados.clima[0].condicao_desc}</p>
                <div class="temperaturas">
                    <span><strong>${dados.clima[0].min}°</strong>Mínima</span>
                    <span><strong>${dados.clima[0].min}°</strong>Máxima</span>
                </div>
                <p>Indice UV: ${dados.clima[0].indice_uv}</p>
            </article>
        `;
        eltPrevisao.innerHTML = `
            <h2>${dados.cidade} - ${dados.estado}</h2>
            <div class="dias">${dias}</div>
        `;
        eltCidades.innerHTML = "";
        eltMensagem.textContent = "";
    }else {
        eltPrevisao.textContent = dados.message;
    }
}

function fmtData(data) {
    let nros = data.split("-");
    return `${nros[2]}/${nros[1]}/${nros[0]}`;
}
