"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginDB_1 = require("../data/loginDB");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ reply, args, owner }) => {
    if (owner) {
        const comandos = args.split(' ');
        const login = (0, loginDB_1.searchLoginPorUsername)(comandos[0]);
        if (login) {
            let vencimento = new Date();
            const dias = parseInt(comandos[1]);
            if (dias) {
                vencimento.setDate(vencimento.getDate() + dias);
                vencimento.setHours(23, 59, 59, 998);
                login.vencimento = vencimento.toISOString();
                (0, loginDB_1.updateLogin)(login);
                const options = { timeZone: 'America/Sao_Paulo', hour12: false };
                return await reply(`✅ Novo vencimento: ${vencimento.toLocaleString('pt-br', options)}.`);
            }
            await reply('Não foi possível fazer o desbloqueio, comando contém erros.');
        }
        else {
            await reply('Usuário informado não existe!');
        }
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
