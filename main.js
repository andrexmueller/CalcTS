


extrato = new Extrato();
const tabelaExtrato = document.querySelector("#extrato");


function imprimeExtrato() {
    

    for (let i=tabelaExtrato.children.length-1; i>=0; i--) {
        tabelaExtrato.children[i].remove();
    }
    
    
    extrato.listaVinculos.sort((a, b) => a.admissao - b.admissao);
    extrato.imprimeExtrato()
    
    let i = 1;
    extrato.listaVinculos.forEach(
        vinculo => imprimeVinculo(vinculo, i++)
    );

    let tempoTotal = document.querySelector("#tempoTotal");
    tempoTotal.textContent = extrato.calculaTempoLiquido().toString();
}

function imprimeVinculo(vinculo, idx) {
    const novalinha = document.createElement("tr");
    const ordem = document.createElement("td");
    ordem.textContent = idx;
    const admissao = document.createElement("td");
    admissao.textContent = vinculo.admissao.toLocaleDateString("pt-BR");
    const demissao = document.createElement("td");
    demissao.textContent = vinculo.demissao.toLocaleDateString("pt-BR");
    const periodo = document.createElement("td");
    periodo.textContent = vinculo.tempoNatural;
    const liquido = document.createElement("td");
    liquido.textContent = vinculo.tempoLiquido();
    tabelaExtrato.appendChild(novalinha);
    novalinha.appendChild(ordem);
    novalinha.appendChild(admissao);
    novalinha.appendChild(demissao);
    novalinha.appendChild(periodo);
    novalinha.appendChild(liquido);

}





const botaoInsere = document.querySelector("#insere");
botaoInsere.onclick = () => {
    let datastr1 = document.querySelector("#inicio");
    let datastr2 = document.querySelector("#final");
    let fator = document.querySelector("#fator");
    let data1 = Data.parseData(datastr1.value);
    let data2 = Data.parseData(datastr2.value);
    if (datastr1.value==='' && datastr2.value==='') return;

    let vinculo = new Vinculo(data1, data2, +fator.value);
    extrato.insereVinculo(vinculo);
    console.log(extrato)

    datastr1.value = '';
    datastr2.value = '';
    fator.value = 1.0;

    
    imprimeExtrato()
    // tempoTotalvar = Periodo.soma(tempoTotalvar, vinculo.tempoNatural);
    // tempoTotal.textContent = tempoTotalvar.toString();    
    return;

}



