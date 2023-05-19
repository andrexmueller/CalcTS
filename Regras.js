/*
				2019 	2020	2021	2022	2023
Art. 15: 
	Pontos: 	86/96	87/97	88/98	89/99	90/100 ... até 100/106
	TC:			30/35 ...
	
Art. 16:
	Idade		56/61 56.5/61.5 57/62 57.5/62.5 58/63... até 62/65
	TC:			30/35 ...
	
Art. 17:
	TC			Pedágio 50% 30/35 - TC em 13/11/2019
	TC em 13/11/2019 28/33
	
Art. 20:
	TC 			Pedágio 100% 30/35 - TC em 13/11/2019
	Idade em 13/11/2019 57/60
	

Art. 18 
	Idade:		60/65	60.5/	61/	61.5/	62	
*/

const MASCULINO = 'masculino'
const FEMININO = 'feminino'
const CARENCIA = 180
const BASE_PONTOS = new Periodo(86, 0, 0);
const BASE_TEMPO = new Periodo(30, 0, 0);
const BASE_IDADE = new Periodo(56, 0, 0);
const DATA_EC103 = Data.parseData('13/11/2019');
const DATA_EC20 = Data.parseData('16/12/1998');
const BASE_TEMPO_EC103 = new Periodo(28, 0, 0);
const BASE_IDADE_EC20 = new Periodo(48, 0, 0);
const BASE_TEMPO_EC20 = new Periodo(25, 0, 0);

class Segurado {
    
	constructor(sexo, nascimento, der) {
        this.sexo = sexo;
        this.nascimento = nascimento;
        this.der = der;
		this.extts = undefined;
    }
}


class Requisitos {
	
	constructor(ingresso, carencia, idade, tempo, pontos, tempoEC103) {
		this.ingresso = ingresso;
		this.carencia = carencia;
		this.idade = idade;
		this.tempo = tempo;
		this.pontos = pontos;
		this.tempoEC103 = tempoEC103;
	}

	static comparaRequisitos(r1, r2) {
		let comp = {
			ingresso: r1.ingresso.maiorIgual(r2.ingresso),
			carencia: r1.carencia <= r2.carencia,
			idade:  r1.idade.eMenorIgual(r2.idade),
			tempo:  r1.tempo.eMenorIgual(r2.tempo),
			pontos: r1.pontos.eMenorIgual(r2.pontos),
			tempoEC103: r1.tempoEC103.eMenorIgual(r2.tempoEC103)
		}
		return comp;
	}

}


function imprieRequisitos(regra, dataLimite) {
	
	let tab = [
		Object.values(regra.exigidoRegra(dataLimite)),
		Object.values(regra.obtidoRegra(dataLimite)),
		Object.values(Requisitos.comparaRequisitos(exigido, obtido)),
	];
	console.table(tab);


}


class Regras {

	constructor(segurado) {
		this.segurado = segurado;
		this.nomeRegra = "";
		this.pedagio = new Periodo(0, 0, 0)
	}

	obtidoRegra(dataLimite) {
		let ingresso = this.segurado.extts.listaVinculos[0].admissao;
		let idade = Data.periodo(this.segurado.nascimento, dataLimite);
		let [tempo, carencia] = [...this.segurado.extts.calculaTempoAteDataLimite(dataLimite)];
		let pontos = Periodo.soma(tempo, idade);
		let tempoEC103 = this.segurado.extts.calculaTempoAteDataLimite(DATA_EC103)[0];
		return new Requisitos(
			ingresso, 
			carencia, 
			idade, 
			Periodo.subtrai(tempo, this.pedagio),
			pontos,
			tempoEC103);
	}

	calculaPedagio(dataLimite, fator, base_tempo=BASE_TEMPO) {
		let ajustaSexo = this.segurado.sexo === MASCULINO ? new Periodo(5,0,0) : new Periodo(0,0,0);
		let tempoObtido = this.segurado.extts.calculaTempoAteDataLimite(dataLimite)[0];
		//let base = Periodo.soma(BASE_TEMPO, ajustaSexo);
		let base = Periodo.soma(base_tempo, ajustaSexo);
		if (tempoObtido.eMaiorIgual(base)) return new Periodo(0,0,0);
		return Periodo.subtrai(base, tempoObtido).produto(fator);
	}
}



class Art15 extends Regras {

	constructor(segurado) {
		super(segurado);
		this.nomeRegra = "Art. 15";
	}

	exigidoRegra(dataLimite) {

		let ajusteAno = dataLimite.getFullYear() - DATA_EC103.getFullYear();
		let ajusteSexo = segurado.sexo === MASCULINO ? new Periodo(10,0,0) : new Periodo(0,0,0);
		let base_pontos = Periodo.soma(BASE_PONTOS, ajusteSexo);
		let pontos = Periodo.soma(base_pontos, new Periodo(1,0,0).produto(ajusteAno));
		let limite = this.segurado.sexo === MASCULINO ? new Periodo(106,0,0) : new Periodo(100,0,0);
		pontos = pontos.eMaior(limite) ? limite : pontos;
		let tempo = Periodo.soma(BASE_TEMPO, new Periodo(5,0,0));

		return new Requisitos(
			DATA_EC103, 
			CARENCIA, 
			new Periodo(0, 0 ,0),
			tempo,
			pontos,
			new Periodo(0, 0 ,0)); 
	}

}


class Art16 extends Regras {

	constructor(segurado) {
		super(segurado);
		this.nomeRegra = "Art. 16";
	}

	exigidoRegra(dataLimite) {
		
		let ajusteAno = dataLimite.getFullYear() - DATA_EC103.getFullYear();
		let ajusteSexo = segurado.sexo === MASCULINO ? new Periodo(5,0,0) : new Periodo(0,0,0);
		let base_idade = Periodo.soma(BASE_IDADE, ajusteSexo);
		let idade  = Periodo.soma(base_idade, new Periodo(0,6,0).produto(ajusteAno)); 		
		let limite = this.segurado.sexo === MASCULINO ? new Periodo(65,0,0) : new Periodo(62,0,0);
		idade = idade.eMaior(limite) ? limite : idade;
		let tempo = Periodo.soma(BASE_TEMPO, ajusteSexo);

		return new Requisitos(
			DATA_EC103, 
			CARENCIA, 
			idade, 
			tempo, 
			new Periodo(0, 0 ,0),
			new Periodo(0, 0 ,0))
	}
}


class Art17 extends Regras {

	constructor(segurado) {
		super(segurado);
		this.nomeRegra = "Art. 17";
		this.pedagio = this.calculaPedagio(DATA_EC103, 0.5);
	}

	exigidoRegra(dataLimite) {
		let ajusteSexo = segurado.sexo === MASCULINO ? new Periodo(5,0,0) : new Periodo(0,0,0);
		let tempo = Periodo.soma(BASE_TEMPO, ajusteSexo);
		let tempoEC103 = Periodo.soma(BASE_TEMPO_EC103, ajusteSexo);
		
		return new Requisitos(
			DATA_EC103, 
			CARENCIA, 
			new Periodo(0, 0 ,0),
			tempo, 
			new Periodo(0, 0 ,0),
			tempoEC103)
	}	
}


class Art20 extends Regras {
	
	constructor(segurado) {
		super(segurado);
		this.nomeRegra = "Art. 20";
		this.pedagio = this.calculaPedagio(DATA_EC103, 1.0);
	}

	exigidoRegra(dataLimite) {
		let ajusteSexo = segurado.sexo === MASCULINO ? new Periodo(5,0,0) : new Periodo(0,0,0);
		let tempo = Periodo.soma(BASE_TEMPO, ajusteSexo);
		let idade = segurado.sexo === MASCULINO ? new Periodo(60,0,0) : new Periodo(57,0,0); 
		
		return new Requisitos(
			DATA_EC103, 
			CARENCIA, 
			idade,
			tempo, 
			new Periodo(0, 0 ,0),
			new Periodo(0, 0 ,0)
			)
		}	
}

class Integral extends Regras {

	constructor(segurado) {
		super(segurado);
		this.nomeRegra = "Integral";
	}

	exigidoRegra(dataLimite) {
		let ajusteSexo = segurado.sexo === MASCULINO ? new Periodo(5,0,0) : new Periodo(0,0,0);
		let tempo = Periodo.soma(BASE_TEMPO, ajusteSexo);
		
		return new Requisitos(
			DATA_EC103, 
			CARENCIA, 
			new Periodo(0, 0 ,0),
			tempo, 
			new Periodo(0, 0 ,0),
			new Periodo(0, 0 ,0)
			)
		}	
}



class Proporcional extends Regras {
	
	constructor(segurado) {
		super(segurado);
		this.nomeRegra = "Proporcional";
		this.pedagio = this.calculaPedagio(DATA_EC20, 0.4, BASE_TEMPO_EC20);
	}

	exigidoRegra(dataLimite) {
		let tempo = segurado.sexo === MASCULINO ? new Periodo(30,0,0) : new Periodo(25,0,0); 
		let idade = segurado.sexo === MASCULINO ? new Periodo(53,0,0) : new Periodo(48,0,0); 
		
		return new Requisitos(
			DATA_EC103, 
			CARENCIA, 
			idade,
			tempo, 
			new Periodo(0, 0 ,0),
			new Periodo(0, 0 ,0)
			)
		}
}


