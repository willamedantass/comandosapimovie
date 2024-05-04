"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loginDB_1 = require("../data/loginDB");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ reply, args, owner }) => {
    if (owner) {
        const comandos = args.split('@');
        if (comandos.length < 1) {
            return await reply('Infome o usuário e o contato separando por @.');
        }
        let login = (0, loginDB_1.searchLoginPorUsername)(comandos[0].trim());
        if (login) {
            let contato = comandos[1];
            if (contato.startsWith('+55')) {
                contato = contato.replace('+55', '');
            }
            contato = contato.replace(/[\s-]/g, '');
            login.contato = contato;
            login.data_msg_vencimento = '';
            await (0, loginDB_1.updateLogin)(login);
            await reply('Login atualizado!');
        }
        else {
            await reply('Usuário informado não existe!');
        }
    }
    else {
        await reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
