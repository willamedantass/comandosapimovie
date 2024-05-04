"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fluxoAcessoDB_1 = require("../data/fluxoAcessoDB");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ reply, owner }) => {
    if (owner) {
        const today = new Date();
        today.setMinutes(today.getMinutes() - 5);
        const users = (0, fluxoAcessoDB_1.readUserFluxo)();
        let online = '';
        users.forEach(user => {
            if (new Date(user.data) > today) {
                online += (`\n${user.user.toUpperCase()}`);
            }
        });
        return await reply(`**Clientes Online** ${online}`);
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
