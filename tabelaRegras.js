function imprimeEntradaTabela(componente, data, criterios, exigido, obtido, resultado) {
    
    let linha1 = document.createElement('tr');
    let linha2 = document.createElement('tr');
    let col1 = document.createElement('td');
    col1.setAttribute('rowspan', '2');
    col1.textContent = data.toLocaleDateString('pt-br');
    linha1.appendChild(col1);

    let col2_1 = document.createElement('td');
    col2_1.textContent = criterios[0];
    linha1.appendChild(col2_1);
    let col2_2 = document.createElement('td');
    col2_2.textContent = criterios[1];
    linha2.appendChild(col2_2);

    let col3_1 = document.createElement('td');
    col3_1.textContent = exigido[0];
    linha1.appendChild(col3_1);
    let col3_2 = document.createElement('td');
    col3_2.textContent = exigido[1];
    linha2.appendChild(col3_2);
    
    let col4_1 = document.createElement('td');
    col4_1.textContent = obtido[0];
    linha1.appendChild(col4_1);
    let col4_2 = document.createElement('td');
    col4_2.textContent = obtido[1];
    linha2.appendChild(col4_2);

    let col5 = document.createElement('td');
    col5.setAttribute('rowspan', '2');
    col5.textContent = Object.values(resultado).reduce((a, b)=>a&&b) ? "Sim" : "Não";
    linha1.appendChild(col5);

    componente.appendChild(linha1)
    componente.appendChild(linha2)

}


function criaTabela(ancora, nome) {
    let tabela = document.createElement('table');
    tabela.setAttribute('class', 'tabelaRegra');
    ancora.appendChild(tabela);
    let cabeca = document.createElement('thead');
    tabela.appendChild(cabeca);
    let linha1 = document.createElement('tr');
    cabeca.appendChild(linha1);
    let th_ = document.createElement('th');
    th_.setAttribute('colspan', '5');
    th_.textContent = nome;
    linha1.appendChild(th_);
    let linha2 = document.createElement('tr');
    cabeca.appendChild(linha2);
    let td_1 = document.createElement('td');
    td_1.setAttribute('colspan', '2');
    td_1.textContent = 'Critérios'
    linha2.appendChild(td_1);
    let td_2 = document.createElement('td');
    td_2.textContent = 'Exigido';
    linha2.appendChild(td_2);
    let td_3 = document.createElement('td');
    td_3.textContent = 'Obtido';
    linha2.appendChild(td_3);
    let td_4 = document.createElement('td');
    td_4.textContent = 'Implementa?';
    linha2.appendChild(td_4);
    let corpo = document.createElement('tbody');
    tabela.appendChild(corpo);
    tabela.setAttribute('class', "matrizTabela");
    return tabela;
}


function imprimeTabelaArt(ancora, regra, criterios) {

   
    let criteriosPrincipais = {
        'Art. 15': ['pontos', 'tempo'],
        'Art. 16': ['idade', 'tempo'],
        'Art. 17': ['tempo', 'tempoEC103'],
        'Art. 20': ['tempo', 'idade'],
        'Integral': ['tempo', null],
        'Proporcional': ['tempo', 'idade']
    }

    let datas = [
        regra.segurado.der,
        Data.parseData('31/12/2022'),
        Data.parseData('31/12/2021'),
        Data.parseData('31/12/2020'), 
        Data.parseData('31/12/2019'),
        DATA_EC103 
    ]
    
    if (regra.nomeRegra === 'Art. 17' || regra.nomeRegra === 'Art. 20') {
        datas = datas.slice(0,1);
    }
    
    if (regra.nomeRegra === 'Integral' || regra.nomeRegra === 'Proporcional') {
        datas = [DATA_EC103, DATA_EC20];
    }


    let exigido, obtido, resultado;
    let crit0 = criteriosPrincipais[regra.nomeRegra][0];
    let crit1 = criteriosPrincipais[regra.nomeRegra][1];
    

    for (let data of datas) {
        exigido = regra.exigidoRegra(data);
        obtido = regra.obtidoRegra(data);
        resultado = Requisitos.comparaRequisitos(exigido, obtido);
        imprimeEntradaTabela(
            ancora,
            data,
            criterios,
            [exigido[crit0], exigido[crit1]],
            [obtido[crit0], obtido[crit1]],
            resultado
        )
    }

    if (regra.nomeRegra === 'Art. 17' || regra.nomeRegra === 'Art. 20' || regra.nomeRegra === 'Proporcional') {
        let _tr = document.createElement('tr');
        ancora.appendChild(_tr);
        let _td = document.createElement('td');
        _td.setAttribute('colspan', '5');
        _td.textContent = `OBS: Pedágio para a Regra ${regra.nomeRegra} = ${regra.pedagio}`
        _tr.appendChild(_td)
    }


}

