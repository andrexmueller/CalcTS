

const segurado = new Segurado()
const extrato = new Extrato();
const nascimento = document.querySelector("#nascimento");
const der = document.querySelector("#der");
const sexo = document.querySelector('input[name="sexo"]:checked');


const extts = document.querySelector("#extts");
const tabelaExtrato = document.querySelector("#extrato");

const texto = document.querySelector('#texto');
const processatexto = document.querySelector('#processatexto');
const caixatexto = document.querySelector('#caixatexto');
const botaoProcessaTexto = document.querySelector('#processatexto')

const padrao1 = /[0-9]{2}\/[0-9]{2}\/[0-9]{4} [0-9]{2}\/[0-9]{2}\/[0-9]{4}/g;
const padrao2 = /[0-9]{2}\/[0-9]{2}\/[0-9]{4} [0-9]{2}\/[0-9]{4}/g;


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

    let botaoAlterar = document.createElement("button");
    botaoAlterar.textContent = " * "
    botaoAlterar.setAttribute("class", "botaoalterar")
    botaoAlterar.onclick = () => { 
        document.querySelector("#inicio").value = extrato.listaVinculos[idx-1].admissao.toLocaleDateString("fr-CA");
        document.querySelector("#final").value = extrato.listaVinculos[idx-1].demissao.toLocaleDateString("fr-CA");
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
    novalinha.appendChild(botaoAlterar);
    tabelaExtrato.appendChild(novalinha);
   
}



const botaoInicia = document.querySelector("#simulacao");
botaoInicia.onclick = () => {
    segurado.der = Data.parseData(der.value);
    segurado.nascimento = Data.parseData(nascimento.value);
    segurado.sexo = sexo.value;
    extts.style.display = 'inline';
    caixatexto.style.display = 'block';

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

    console.log(datastr1.value, datastr2.value)
    let vinculo = new Vinculo(data1, data2, +fator.value);
    extrato.insereVinculo(vinculo);
    console.log(extrato)

    datastr1.value = '';
    datastr2.value = '';
    fator.value = 1.0;

    imprimeExtrato()

    document.querySelector("#inicio").focus();

}

botaoProcessaTexto.onclick = () => {
    const str = texto.value;
    const datas1 = [...str.matchAll(padrao1)];
    const datas2 = [...str.matchAll(padrao2)];

    let adm, dem, vinculo;
    for (let p of datas1) {
        console.log(p[0].split(' '))
        adm = Data.parseData(p[0].split(' ')[0]);
        dem = Data.parseData(p[0].split(' ')[1]);
        vinculo = new Vinculo(adm, dem);
        extrato.insereVinculo(vinculo);
    }
    let mes;
    for (let p of datas2) {
        console.log(p)
        mes = p[0].split(' ')[1].slice(0, 2);        
        adm = Data.parseData(p[0].split(' ')[0]);
        dem = Data.parseData('01/'+p[0].split(' ')[1])
        dem.setDate(dem.maxDiasMes());
        vinculo = new Vinculo(adm, dem);
        extrato.insereVinculo(vinculo);
    }

    texto.value = '';
    imprimeExtrato();
}

