"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toStringDate = void 0;
const toStringDate = (dateString) => {
    const dateParts = dateString.split(/[\s/:]+/);
    // Obtém os valores de ano, mês, dia, horas, minutos e segundos da string
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Os meses em JavaScript são baseados em zero (0 - 11)
    const year = parseInt(dateParts[2], 10);
    const hours = parseInt(dateParts[3], 10);
    const minutes = parseInt(dateParts[4], 10);
    const seconds = parseInt(dateParts[5], 10);
    // Cria o objeto Date com os valores obtidos
    return new Date(year, month, day, hours, minutes, seconds);
};
exports.toStringDate = toStringDate;
