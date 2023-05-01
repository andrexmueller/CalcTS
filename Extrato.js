class Extrato {
    constructor() {
        this.listaVinculos = [];
        
    }

    insereVinculo(vinculo) {
        this.listaVinculos.push(vinculo);
        
        this.listaVinculos.sort((a, b) => a.admissao - b.admissao);
        for (let v of this.listaVinculos) {
            v.resetTempoAproveitado();
            v.resetPeriodosCarencia();
        }

        for (let i = 0; i < this.listaVinculos.length-1; i++) {
            for (let j = i+1; j < this.listaVinculos.length; j++) {
                retiraConcomitancia(this.listaVinculos[i], this.listaVinculos[j]);
                retiraConcomitanciaCarencia(this.listaVinculos[i], this.listaVinculos[j]);
            }
        }
        
        this.listaVinculos.sort((a, b) => a.admissao - b.admissao);
        
        

    }

    deletaVinculo(idx) {
        this.listaVinculos.splice(idx, 1);
        this.listaVinculos.sort((a, b) => a.admissao - b.admissao);
        for (let v of this.listaVinculos) {
            v.resetTempoAproveitado();
        }
        for (let i = 0; i < this.listaVinculos.length-1; i++) {
            for (let j = i+1; j < this.listaVinculos.length; j++) {
                retiraConcomitancia(this.listaVinculos[i], this.listaVinculos[j]);
                retiraConcomitancia(this.listaVinculos[i], this.listaVinculos[j], true);

            }
        }
        this.listaVinculos.sort((a, b) => b.admissao.menorIgual(a.admissao));
        this.listaVinculos.sort((a, b) => a.admissao - b.admissao);
    }

    calculaTempoLiquido() {
        let liquidoTotal = new Periodo(0, 0, 0);
        for (let v of this.listaVinculos) {
            liquidoTotal = Periodo.soma(liquidoTotal, v.tempoLiquido())
        }
        return liquidoTotal;
    }
    
    calculaCarenciaLiquida() {
        let carenciaLiquida = 0;
        
        for (let v of this.listaVinculos) {
            carenciaLiquida += v.carenciaLiquida();
        }
        return carenciaLiquida;
    }

    imprimeExtrato() {
        console.log("===========================================================")
        
        
        for (let v of this.listaVinculos) {
            
            console.log("  ", v.toString())
        }
        console.log("===========================================================")
        console.log("Tempo Liquido   ", this.calculaTempoLiquido())
    }
}


function retiraConcomitancia(v1, v2) {
    if (v1.fator < v2.fator) {
        return retiraConcomitancia(v2, v1);
    }

    if (v1.admissao >= v2.admissao && v1.fator < v2.fator) {
        return retiraConcomitancia(v2, v1);
    }
    
    let newV2 = [];

    for (let t2 of v2.tempoAproveitado) {
        for (let t1 of v1.tempoAproveitado) {
            let conc = t2.subtraiConcomitancia(t1);
        
            if (typeof(conc) == 'object') {
                newV2.push(conc);
            } 
        }
    }
    for (let t of v2.tempoAproveitado) {
        if (t.inicio && t.final) { 
            newV2.push(t)
        }
    }
    
    v2.tempoAproveitado = newV2;
    v2.tempoAproveitado.sort((a, b) => a.inicio.menorIgual(b.inicio));
}


function retiraConcomitanciaCarencia(v1, v2) {
    if (v1.fator < v2.fator) {
        return retiraConcomitanciaCarencia(v2, v1);
    }

    if (v1.admissao >= v2.admissao && v1.fator < v2.fator) {
        return retiraConcomitanciaCarencia(v2, v1);
    }
    
    let newV2 = [];

    for (let t2 of v2.periodosCarencia) {
        for (let t1 of v1.periodosCarencia) {
            let conc = t2.subtraiConcomitancia(t1);
        
            if (typeof(conc) == 'object') {
                newV2.push(conc);
            } 
        }
    }

    for (let t of v2.periodosCarencia) {
        if (t.inicio && t.final) {
            newV2.push(t)
        }
    }
    v2.periodosCarencia = newV2;
    v2.periodosCarencia.sort((a, b) => a.inicio.menorIgual(b.inicio));    
}

