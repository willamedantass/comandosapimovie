import { LoginTituloType } from "../type/login";


export const getMensagemLogin = (user: string, password: string, vencimento: string, loginType : string ) =>{
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
    
        default:
            break;
    }

    let options = {
        timeZone: 'America/Sao_Paulo',
        hour12: false
    }
    msg += `👤 *USUARIO:* ${user} \n`;
    msg += `🔐 *SENHA:* ${password} \n`;
    msg += `⏰ *Expira:* ${new Date(vencimento).toLocaleString('pt-br', options)} \n`;
    msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
    msg += "             ℹ️ INFORMAÇÃO \n";
    msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
    msg += "*SMARTERS API XTREAM*\n";
    msg += "*1 -* movnow\n";
    msg += `*2 -* ${user} \n`;
    msg += `*3 -* ${password}\n`;
    msg += `*4 -* http://${process.env.SERVER_PROXY_DNS}\n`;
    msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
    msg += "*DNS SAMSUNG/LG*\n";
    msg += `${process.env.SERVER_STB_IP}\n`;
    msg += "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n";
    msg += "😍 GOSTOU? DIGITE #PIX PARA PAGAR";

    return msg;
}