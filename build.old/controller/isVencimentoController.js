"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVencimentoController = void 0;
const sendMessage_1 = require("../util/sendMessage");
const jsonConverte_1 = require("../util/jsonConverte");
const loginDB_1 = require("../data/loginDB");
const async_mutex_1 = require("async-mutex");
const mutex = new async_mutex_1.Mutex();
const isVencimentoController = async (login) => {
    return await mutex.runExclusive(async () => {
        const agora = new Date();
        const vencimento = new Date(login.vencimento);
        const dataMensagem = new Date((login === null || login === void 0 ? void 0 : login.data_msg_vencimento) || '');
        if (agora > vencimento) {
            if (dataMensagem.getDay() !== agora.getDay()) {
                const contato = (login === null || login === void 0 ? void 0 : login.contato) ? login.contato : '8588199556';
                await (0, sendMessage_1.sendMessage)(contato, (0, jsonConverte_1.mensagem)('vencimento', login.user));
                login.data_msg_vencimento = new Date().toISOString();
                (0, loginDB_1.updateLogin)(login);
            }
            console.info(`Login expirado! Usuário: ${login.user}`);
            return true;
        }
        const dias = Math.floor((vencimento.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        if (dias <= 3 && dias > 0 && dataMensagem.getDay() !== agora.getDay()) {
            const contato = (login === null || login === void 0 ? void 0 : login.contato) ? login.contato : '8588199556';
            const msg = `Olá, ${login.user}\n\nEstamos passando para lembrar que sua assinatura vencerá em apenas ${dias === 1 ? '1 dia' : dias + ' dias'}!\n\n\Não deixe para a última hora, renove agora mesmo e continue aproveitando nossos serviços de qualidade, é só digitar *Menu* - opção 3.`;
            await (0, sendMessage_1.sendMessage)(contato, msg);
            login.data_msg_vencimento = new Date().toISOString();
            (0, loginDB_1.updateLogin)(login);
        }
        return false;
    });
};
exports.isVencimentoController = isVencimentoController;
