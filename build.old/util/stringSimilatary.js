"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringSimilatary = void 0;
const stringSimilatary = (stringBuscado, arrayStrings) => {
    if (!stringBuscado) {
        console.error(`Não foi possível comparar os titulos. String de busca:${stringBuscado}`);
        return null;
    }
    const Similarity = require('string-similarity');
    for (const [indice, valor] of arrayStrings.entries()) {
        const similarity = Similarity.compareTwoStrings(stringBuscado, valor);
        if (similarity >= 0.8) {
            return indice + 1;
        }
    }
    return null;
};
exports.stringSimilatary = stringSimilatary;
