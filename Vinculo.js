class Vinculo {
    
    constructor(admissao, demissao, fator=1.0) {
        this.admissao = admissao;
        this.demissao = demissao;
        this.fator = fator;
        this.tempoNatural = Data.periodo(this.admissao, this.demissao);
        this.tempoAproveitado = [new Intervalo(this.admissao, this.demissao)];
        this.periodosCarencia = this.inicializaPeriodosCarencia();

    }

    resetTempoAproveitado() {
        this.tempoAproveitado = [new Intervalo(this.admissao, this.demissao)];        
    }

    
    tempoLiquido() {
        let liquido = new Periodo(0,0,0);
        let periodo;
        for (let ta of this.tempoAproveitado) {
            periodo = Data.periodo(ta.inicio, ta.final);
            liquido = Periodo.soma(liquido, periodo).produto(this.fator);   
        }
        return liquido;
    }
 
    inicializaPeriodosCarencia() {
        
        let inicio = new Data(); 
        let final = new Data();
        
        inicio.setDate(1);
        inicio.setMonth(this.admissao.getMonth());
        inicio.setFullYear(this.admissao.getFullYear());

        final.setDate(this.demissao.maxDiasMes());
        final.setMonth(this.demissao.getMonth());
        final.setFullYear(this.demissao.getFullYear());
        return [new Intervalo(inicio, final)];
    }
    
    
    resetPeriodosCarencia() {
        this.periodosCarencia = this.inicializaPeriodosCarencia();
    }

    carenciaLiquida() {
        let carencia = 0;
        for (let p of this.periodosCarencia) {
            let per = Data.periodo(p.inicio, p.final);
            carencia += per.anos * 12 + per.meses;
        }
        return carencia;
    }

    toString() {
        let str = '';
        str += `${this.admissao.toLocaleDateString('en-GB')}`;
        str += ` - ${this.demissao.toLocaleDateString('en-GB')}`;
        str += `  :  ${this.tempoNatural.toString()}`;
        str += `   |  ${this.tempoLiquido().toString()}`;
        str += `   <${this.carenciaLiquida()}>`
        return str;
    }

}
