"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonConverte_1 = require("../util/jsonConverte");
const loginDB_1 = require("../data/loginDB");
exports.default = async ({ sendText, reply, owner }) => {
    if (owner) {
        const options = { timeZone: 'America/Sao_Paulo', hour12: false };
        let msg = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n';
        (0, loginDB_1.allLogins)().forEach((element, index) => {
            msg += `${index + 1} - ${element.user}\nVenc.: ${new Date(element.vencimento).toLocaleDateString('pt-br', options)}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`;
        });
        await sendText(true, msg);
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
