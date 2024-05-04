"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fluxoAcessoDB_1 = require("../data/fluxoAcessoDB");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ sendText, reply, owner }) => {
    if (owner) {
        const users = (0, fluxoAcessoDB_1.readUserFluxo)();
        let online = '';
        const options = { timeZone: 'America/Sao_Paulo', hour12: false };
        if (!users.length) {
            return await reply('Nenhum usuário conectado.');
        }
        users.forEach(user => {
            online += (`\n
            ${user.user.toUpperCase()} - 
            Acesso: ${new Date(user.data).toLocaleString('pt-br', options)}`);
        });
        await sendText(true, `   **Clientes Online** ${online}`);
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
