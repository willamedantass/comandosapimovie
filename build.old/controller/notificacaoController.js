"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificacaopix = void 0;
const userDB_1 = require("../data/userDB");
const sendMessage_1 = require("../util/sendMessage");
const jsonConverte_1 = require("../util/jsonConverte");
require('dotenv/config');
const notificacaopix = async (req, res) => {
    var _a;
    let payment_info;
    const dados = req.query;
    if (dados.hasOwnProperty('data.id') && dados.hasOwnProperty('type')) {
        console.info('Notificação descartada por parâmetros enviados.');
        return res.status(200).end();
    }
    if (!dados.hasOwnProperty('id') || !dados.hasOwnProperty('topic')) {
        console.error('Erro no envio dos parâmetros da notificação!');
        return res.status(400).end();
    }
    //faz a consulta na api para verificar os pagamentos
    if (dados.topic === 'payment') {
        try {
            var mercadopago = require('mercadopago');
            mercadopago.configurations.setAccessToken(process.env.MP_ACCESSTOKEN);
            payment_info = await mercadopago.payment.get(dados.id);
        }
        catch (error) {
            console.error('Erro ao consultar api do mercado pago!\n' + error);
            return res.status(400).end();
        }
    }
    else {
        return res.status(200).end();
    }
    //verifica se o pagamento está aprovado
    if (payment_info.body.status !== 'pending') {
        let details = payment_info.body.transaction_details.transaction_id;
        if (details && payment_info.body.status === 'approved') {
            let remoteJid = payment_info.body.external_reference.trim();
            let user = (0, userDB_1.searchUser)(remoteJid);
            if (user === undefined) {
                console.error('Usuário de pagamento não encontrado');
                return res.status(200).end();
            }
            //verifica se este pagamento já foi processado.
            let isPayment = (_a = user === null || user === void 0 ? void 0 : user.pgtos_id) === null || _a === void 0 ? void 0 : _a.includes(payment_info.body.id);
            if (isPayment === undefined) {
                isPayment = false;
                user.pgtos_id = [];
            }
            if (isPayment) {
                console.info('Pagamento já foi processado.');
                return res.status(200).end();
            }
            let credito = 0;
            if (user === null || user === void 0 ? void 0 : user.credito) {
                credito = user.credito;
            }
            credito += 1;
            user.pgtos_id.push(payment_info.body.id);
            user.credito = credito;
            (0, userDB_1.updateUser)(user);
            await (0, sendMessage_1.sendMessage)('', (0, jsonConverte_1.mensagem)('pix_aprovado'), remoteJid);
            await (0, sendMessage_1.sendMessage)('', `Seu novo saldo em crédito: ${user.credito}`, remoteJid);
        }
        else {
            console.info(`Pagamento de transação ${payment_info.body.id} ainda não foi aprovado.`);
        }
    }
    res.status(200).end();
};
exports.notificacaopix = notificacaopix;
