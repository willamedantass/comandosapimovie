"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMensagemPix = exports.getMensagemLogin = void 0;
const login_1 = require("../type/login");
const getMensagemLogin = (user, password, vencimento, loginType) => {
    let msg = '';
    switch (loginType) {
        case login_1.LoginTituloType.teste:
            msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n            ✅ *TESTE CRIADO* ✅\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
            break;
        case login_1.LoginTituloType.info:
            msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n         ✅ *DETALHES LOGIN* ✅\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
            break;
        case login_1.LoginTituloType.login:
            msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n            ✅ *MOVNOW 30D* ✅\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
            break;
        case login_1.LoginTituloType.renovacao:
            msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n         📺🌟 *MOVNOW* 🌟📺 \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n";
            break;
        default:
            break;
    }
    const options = { timeZone: 'America/Sao_Paulo', hour12: false };
    if (loginType === login_1.LoginTituloType.renovacao) {
        msg += `Login *${user}* renovado com sucesso!\nNovo vencimento: ${new Date(vencimento).toLocaleString('pt-br', options)}`;
    }
    else {
        msg += `👤 *USUARIO:* ${user} \n`;
        msg += `🔐 *SENHA:* ${password} \n`;
        msg += `⏰ *Expira:* ${new Date(vencimento).toLocaleDateString('pt-br', options)} \n`;
        msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
        msg += "             ℹ️ *XTREAM CODE* \n";
        msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
        msg += "SMARTERS OU DUPLECAST\n";
        msg += "*1 -* movnow\n";
        msg += `*2 -* ${user} \n`;
        msg += `*3 -* ${password}\n`;
        msg += `*4 -* http://${process.env.SERVER_PROXY_DNS}\n`;
        // msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
        // msg += "*DNS SAMSUNG/LG*\n";
        // msg += `${process.env.SERVER_STB_IP}\n`;
        msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
        loginType === login_1.LoginTituloType.teste ? msg += "😍 GOSTOU? DIGITE #PIX PARA ATIVAR" : '';
    }
    return msg;
};
exports.getMensagemLogin = getMensagemLogin;
const getMensagemPix = (transacao, valor) => {
    var numero = parseFloat(valor);
    var moedaFormatada = numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    let msg = '';
    msg += '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n📌 *DETALHES DA COMPRA* 📌\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n';
    msg += '🛍️ *Produto:* MOVNOW 30D\n';
    msg += `🏦 *Transação:* ${transacao} \n`;
    msg += `💰 *Valor:* R$ ${moedaFormatada}\n`;
    msg += '📅 *Validade:* 30 Dias\n';
    msg += '🔰 *Método de Pagamento:* Pix Cópia e Cola';
    return msg;
};
exports.getMensagemPix = getMensagemPix;
