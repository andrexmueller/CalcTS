

const segurado = new Segurado()
const extrato = new Extrato();
const nascimento = document.querySelector("#nascimento");
const der = document.querySelector("#der");
const sexo = document.querySelector('input[name="sexo"]:checked');
console.log(">>>>> ", sexo)

const extts = document.querySelector("#extts");
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

    

    //let totaltempo = document.querySelector("#totaltempo");
    document.querySelector("#totaltempo").textContent = extrato.calculaTempoLiquido().toString();
    document.querySelector("#totalcarencia").textContent = extrato.calculaCarenciaLiquida();
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
    let fator = document.createElement("td");
    fator.textContent = vinculo.fator;
    let car = document.createElement("td");
    car.textContent = vinculo.carenciaLiquida();
    
    
    let botaoRemover = document.createElement("button");
    botaoRemover.textContent = " - "
    botaoRemover.setAttribute("class", "botaoremover")
    botaoRemover.onclick = () => { 
        extrato.deletaVinculo(idx-1);
        imprimeExtrato()
    }
    tabelaExtrato.appendChild(novalinha);
    novalinha.appendChild(ordem);
    novalinha.appendChild(admissao);
    novalinha.appendChild(demissao);
    novalinha.appendChild(periodo);
    novalinha.appendChild(fator);
    novalinha.appendChild(liquido);
    novalinha.appendChild(car);
    novalinha.appendChild(botaoRemover);
    tabelaExtrato.appendChild(novalinha);
   
}



const botaoInicia = document.querySelector("#simulacao");
botaoInicia.onclick = () => {
    segurado.der = Data.parseData(der.value);
    segurado.nascimento = Data.parseData(nascimento.value);
    segurado.sexo = sexo.value;
    extts.style.display = 'inline';

    console.log(segurado)


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

    document.querySelector("#inicio").focus();

}
