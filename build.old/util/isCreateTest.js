"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCriarTeste = void 0;
const isCriarTeste = (dataTeste) => {
    if (dataTeste) {
        try {
            var data = new Date(dataTeste);
            //calcula diferenca entre duas datas e retorna em dias.            
            return Math.floor((new Date().getTime() - data.getTime()) / (1000 * 60 * 60 * 24)) > 3;
        }
        catch (error) {
            console.error('Erro ao tentar converter data.');
        }
    }
    else {
        return true;
    }
};
exports.isCriarTeste = isCriarTeste;
