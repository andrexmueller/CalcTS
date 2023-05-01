class Intervalo {

    constructor(data1, data2) {
        if (data2 < data1) {
            [data1, data2] = [data2, data1]
        }
        this.inicio = data1;
        this.final = data2;
    }

    contemData(data) {
        if (data.maiorIgual(this.inicio) && data.menorIgual(this.final)) {
            return true
        }
        return false;
    }

    disjunto(that) {
        if (this.inicio < that.inicio && this.final < that.inicio) return true;
        if (that.inicio < this.inicio && that.final < this.inicio) return true;
        return false;
    }
    
    concomitancia(that) {
        if (this.disjunto(that)) return null;
        if (this.contemData(that.inicio)) {
            if (this.contemData(that.final)) {
                return new Intervalo(that.inicio, that.final);
            } else {
                return new Intervalo(that.inicio, this.final);
            }
        } else {
            if (this.contemData(that.final)) {
                return new Intervalo(this.inicio, that.final);
            } else {
                return new Intervalo(this.inicio, this.final);
            }
        }
    }

    subtraiConcomitancia(that) {
        // Retira a concomitancia, se houver, alterando as datas do próprio objeto
        // Se não há concomitancia retorna -1
        // Se todo o periodo for concomintante, retorna 0
        // Se apenas parte do periodo for concomitante, retorna 1
        // Se o periodo for dividido ao meio pela concomitancia, altera a primeira parte e retorna a segunda
        
        let conc = this.concomitancia(that);
        if (!conc) return -1;
        if (conc) {
            if (conc.inicio.eIgual(this.inicio)) {
                if (conc.final.eIgual(this.final)) {
                    this.inicio = null;
                    this.final = null;
                    return 0;
                } else {
                    this.inicio = conc.final.diaSeguinte();
                }
            } else if (conc.final.eIgual(this.final)) {
                this.final = conc.inicio.diaAnterior();
            } else {
                let sobraInicio = conc.final.diaSeguinte();
                
                let sobraFinal = this.final
                let sobra = new Intervalo(sobraInicio, sobraFinal);
                this.final = conc.inicio.diaAnterior();
                return sobra;
            }
        }
        return 1;
    }
    
    imprime() {
    
        console.log('[ ', this.inicio.toLocaleDateString('pt-br'), ', ', this.final.toLocaleDateString('pt-br'), ' ]\n')
    }
}

// class Intervalo {

//     constructor(data1, data2) {
//         if (data2 < data1) {
//             [data1, data2] = [data2, data1]
//         }
//         this.inicio = data1;
//         this.final = data2;
//     }

//     contemData(data) {
//         if (data.maiorIgual(this.inicio) && data.menorIgual(this.final)) {
//             return true
//         }
//         return false;
//     }

//     disjunto(that) {
//         if (this.inicio < that.inicio && this.final < that.inicio) return true;
//         if (that.inicio < this.inicio && that.final < this.inicio) return true;
//         return false;
//     }
    
//     concomitancia(that) {
//         if (this.disjunto(that)) return null;
//         if (this.contemData(that.inicio)) {
//             if (this.contemData(that.final)) {
//                 return new Intervalo(that.inicio, that.final);
//             } else {
//                 return new Intervalo(that.inicio, this.final);
//             }
//         } else {
//             if (this.contemData(that.final)) {
//                 return new Intervalo(this.inicio, that.final);
//             } else {
//                 return new Intervalo(this.inicio, this.final);
//             }
//         }
//     }

//     subtraiConcomitancia(that) {
//         // Retira a concomitancia, se houver, alterando as datas do próprio objeto
//         // Se não há concomitancia retorna -1
//         // Se todo o periodo for concomintante, retorna 0
//         // Se apenas parte do periodo for concomitante, retorna 1
//         // Se o periodo for dividido ao meio pela concomitancia, altera a primeira parte e retorna a segunda
        
//         let conc = this.concomitancia(that);
//         if (!conc) return -1;
//         if (conc) {
//             if (conc.inicio.eIgual(this.inicio)) {
//                 if (conc.final.eIgual(this.final)) {
//                     this.inicio = null;
//                     this.final = null;
//                     return 0;
//                 } else {
//                     this.inicio = conc.final.diaSeguinte();
//                 }
//             } else if (conc.final.eIgual(this.final)) {
//                 this.final = conc.inicio.diaAnterior();
//             } else {
//                 let sobraInicio = conc.final.diaSeguinte();
                
//                 let sobraFinal = this.final
//                 let sobra = new Intervalo(sobraInicio, sobraFinal);
//                 this.final = conc.inicio.diaAnterior();
//                 return sobra;
//             }
//         }
//         return 1;
//     }
    
//     imprime() {
    
//         console.log('[ ', this.inicio.toLocaleDateString('pt-br'), ', ', this.final.toLocaleDateString('pt-br'), ' ]\n')
//     }
// }
