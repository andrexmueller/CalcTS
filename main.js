

// inicializa o segurado
const segurado = new Segurado()
// inicializo o extrato e associa o extrato ao segurado
const extrato = new Extrato();
segurado.extts = extrato;




// inicializa elementos do DOM para manipulação
const nascimento = document.querySelector("#nascimento");
const der = document.querySelector("#der");

const extts = document.querySelector("#extts");
const tabelaExtrato = document.querySelector("#extrato");

const texto = document.querySelector('#texto');
const processaperiodos = document.querySelector('#processaperiodos');
const caixatexto = document.querySelector('#caixatexto');

// pradros para regex - parsing o copia/cola do cnis
const padrao1 = /[0-9]{2}\/[0-9]{2}\/[0-9]{4} {1,}[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g;
const padrao2 = /[0-9]{2}\/[0-9]{2}\/[0-9]{4} {1,}[0-9]{2}\/[0-9]{4}/g;



function imprimeExtrato() {
    for (let i=tabelaExtrato.children.length-1; i>=0; i--) {
        tabelaExtrato.children[i].remove(); 
    }
    extrato.listaVinculos.sort((a, b) => a.admissao - b.admissao);
    //extrato.imprimeExtrato()
    
    let i = 1;
    extrato.listaVinculos.forEach(
        vinculo => imprimeVinculo(vinculo, i++)
    );

    document.querySelector("#totaltempoDER").textContent = extrato.calculaTempoLiquido().toString();
    document.querySelector("#totalcarenciaDER").textContent = extrato.calculaCarenciaLiquida();
    
    document.querySelector("#totaltempoEC").textContent = extrato.calculaTempoAteDataLimite(DATA_EC103)[0].toString();
    document.querySelector("#totalcarenciaEC").textContent = extrato.calculaTempoAteDataLimite(DATA_EC103)[1].toString();
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
    segurado.sexo = document.querySelector('input[name="sexo"]:checked').value;
    // extts.style.display = 'inline';
    // caixatexto.style.display = 'block';

    console.log(segurado);
    
    //let matriz = document.getElementById('matriz');

    let r15 = new Art15(segurado);
    let a15 = document.getElementById('tabela15');
    let t15 = criaTabela(a15, ' Art. 15 - EC 103/2019');
    imprimeTabelaArt(t15, r15, ['Pontos', 'Tempo Cont.']);
    
    let r16 = new Art16(segurado);
    let a16 = document.getElementById('tabela16');
    let t16 = criaTabela(a16, ' Art. 16 - EC 103/2019');
    imprimeTabelaArt(t16, r16, ['Idade', 'Tempo Cont.']);
    
    let r17 = new Art17(segurado);
    let a17 = document.getElementById('tabela17');
    let t17 = criaTabela(a17, ' Art. 17 - EC 103/2019');
    imprimeTabelaArt(t17, r17, ['Tempo Cont.', 'TC na EC103']);

    let r20 = new Art20(segurado);
    let a20 = document.getElementById('tabela20');
    let t20 = criaTabela(a20, ' Art. 20 - EC 103/2019');
    imprimeTabelaArt(t20, r20, ['Tempo Cont.', 'Idade']);
    
    let rInt = new Integral(segurado);
    let aInt = document.getElementById('tabelaInt');
    let tInt = criaTabela(aInt, ' Integral - Lei 8.213/91');
    imprimeTabelaArt(tInt, rInt, ['Tempo Cont.']);
    
    let rPro = new Proporcional(segurado);
    let aPro = document.getElementById('tabelaPro');
    let tPro = criaTabela(aPro, ' Proporcional - Lei 8.213/91');
    imprimeTabelaArt(tPro, rPro, ['Tempo Cont.', 'Idade']);




}





const botaoInsere = document.querySelector("#insere");
botaoInsere.onclick = () => {
    let datastr1 = document.querySelector("#inicio");
    let datastr2 = document.querySelector("#final");
    let fator = document.querySelector("#fator");
    let data1 = Data.parseData(datastr1.value);
    let data2 = Data.parseData(datastr2.value);
    if (datastr1.value==='' && datastr2.value==='') return;

    //console.log(datastr1.value, datastr2.value)
    let vinculo = new Vinculo(data1, data2, +fator.value);
    extrato.insereVinculo(vinculo);
    //console.log(extrato)

    datastr1.value = '';
    datastr2.value = '';
    fator.value = 1.0;

    imprimeExtrato()

    document.querySelector("#inicio").focus();

}

processaperiodos.onclick = () => {
    let str = texto.value;
    const datas1 = [...str.matchAll(padrao1)];
    str = str.replace(padrao1, '');
    const datas2 = [...str.matchAll(padrao2)];

    let adm, dem, vinculo;
    for (let p of datas1) {
        adm = Data.parseData(p[0].split(' ')[0]);
        dem = Data.parseData(p[0].split(' ').slice(-1)[0]);
        //console.log(adm, dem)
        vinculo = new Vinculo(adm, dem);
        extrato.insereVinculo(vinculo);
    }
    let mes;
    for (let p of datas2) {      
        mes = p[0].split(' ').slice(-1)[0].slice(0, 2)
        adm = Data.parseData(p[0].split(' ')[0]);
        dem = Data.parseData('01/' + p[0].split(' ').slice(-1)[0])
        dem.setDate(dem.maxDiasMes());
        vinculo = new Vinculo(adm, dem);
        extrato.insereVinculo(vinculo);
    }

    texto.value = '';
    imprimeExtrato();
}



function test_() {
    console.log("==========================================")

    let datas = ['06/01/2023']
    for (let d of datas) {
        console.log('==========',  d, '========')
        let data = Data.parseData(d)
        let r = new Art15(segurado)
        let e = r.exigidoRegra(data)
        let o = r.obtidoRegra(data)
        console.log(r.pedagio)
        console.log(e)
        console.log(o)
        console.log(Requisitos.comparaRequisitos(e, o))
    }
    // let art16 = new Art16(segurado)
    // console.log(art16.exigidoRegra(segurado.der))
    // let art17 = new Art17(segurado)
    // console.log(art17.exigidoRegra(segurado.der))
    // let art20 = new Art20(segurado)
    // console.log(art20.exigidoRegra(segurado.der))
    

    console.log("==========================================")

}


