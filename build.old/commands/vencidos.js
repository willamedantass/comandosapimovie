"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonConverte_1 = require("../util/jsonConverte");
const loginDB_1 = require("../data/loginDB");
exports.default = async ({ sendText, reply, owner }) => {
    if (owner) {
        const options = { timeZone: 'America/Sao_Paulo', hour12: false };
        const hoje = new Date();
        let login = (0, loginDB_1.allLogins)();
        let msg = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n';
        login.forEach((element, index) => {
            if (new Date(element.vencimento) < hoje) {
                msg += `${element.user}\nVenc.: ${new Date(element.vencimento).toLocaleDateString('pt-br', options)}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`;
            }
        });
        await sendText(true, msg);
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
