"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoginsWebOPainelController_1 = require("../controller/LoginsWebOPainelController");
const jsonConverte_1 = require("../util/jsonConverte");
exports.default = async ({ reply, owner }) => {
    if (owner) {
        await criarLoginsComIntervalo(0, reply);
    }
    else {
        reply((0, jsonConverte_1.mensagem)('acessoNegado'));
    }
};
const criarLoginsComIntervalo = async (iteracao, reply) => {
    if (iteracao < 5) {
        const tempoDeEspera = Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000;
        setTimeout(async () => {
            const result = await (0, LoginsWebOPainelController_1.createLoginAPI)();
            result ? await reply(`Login criado com sucesso!`) : await reply('Não foi possível criar o login de teste!');
            criarLoginsComIntervalo(iteracao + 1, reply); // Chama a próxima iteração
        }, tempoDeEspera);
    }
    else {
        await reply('Processo de criação de logins finalizado!');
    }
};
