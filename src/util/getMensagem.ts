import { LoginTituloType } from "../type/login";

export const getMensagemLogin = (user: string, password: string, vencimento: string, loginType: string) => {
    let msg = '';
    switch (loginType) {
        case LoginTituloType.teste:
            msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n            ✅ *TESTE CRIADO* ✅\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
            break;
        case LoginTituloType.info:
            msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n         ✅ *DETALHES LOGIN* ✅\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
            break;
        case LoginTituloType.login:
            msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n            ✅ *MOVNOW 30D* ✅\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
            break;
        case LoginTituloType.renovacao:
            msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n         📺🌟 *MOVNOW* 🌟📺 \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n";
            break;
        default:
            break;
    }

    const options = {timeZone: 'America/Sao_Paulo',hour12: false}

    if(loginType === LoginTituloType.renovacao) {
        msg += `Login *${user}* renovado com sucesso!\nNovo vencimento: ${new Date(vencimento).toLocaleString('pt-br', options)}`;
    } else {
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
        loginType === LoginTituloType.teste ? msg += "😍 GOSTOU? DIGITE #PIX PARA ATIVAR" : '';
    }
    return msg;
}

export const getMensagemPix = (transacao: string, valor: string) => {
    var numero = parseFloat(valor);
    var moedaFormatada = numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    let msg = '';
    msg += '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n📌 *DETALHES DA COMPRA* 📌\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n';
    msg += '🛍️ *Produto:* MOVNOW 30D\n';
    msg += `🏦 *Transação:* ${transacao} \n`
    msg += `💰 *Valor:* R$ ${moedaFormatada}\n`
    msg += '📅 *Validade:* 30 Dias\n'
    msg += '🔰 *Método de Pagamento:* Pix Cópia e Cola'
    return msg;
}