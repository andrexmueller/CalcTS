class Vinculo {
    
    constructor(admissao, demissao, fator=1.0) {
        this.admissao = admissao;
        this.demissao = demissao;
        this.fator = fator;
        this.tempoNatural = Data.periodo(this.admissao, this.demissao);
        this.tempoAproveitado = [new Intervalo(this.admissao, this.demissao)];        
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

    toString() {
        let str = '';
        str += `${this.admissao.toLocaleDateString('en-GB')}`;
        str += ` - ${this.demissao.toLocaleDateString('en-GB')}`;
        str += `  :  ${this.tempoNatural.toString()}`;
        str += `   |  ${this.tempoLiquido().toString()}`;
        return str;
    }

}
