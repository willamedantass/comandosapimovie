import { LoginTituloType } from "../type/login";

interface MensagemParams {
    nome?: string;
    dias?: string;
}

const getHeaderMessage = (loginType: LoginTituloType): string => {
    switch (loginType) {
        case LoginTituloType.teste:
            return "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n            ✅ *TESTE CRIADO* ✅\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
        case LoginTituloType.login:
            return "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n         ✅ *DETALHES LOGIN* ✅\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
        case LoginTituloType.renovacao:
            return "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n         📺🌟 *MOVNOW* 🌟📺 \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n\n";
        default:
            return "";
    }
};

const getFooterMessage = (loginType: LoginTituloType): string => {
    if (loginType === LoginTituloType.teste) {
        return "😍 GOSTOU? DIGITE #PIX PARA ATIVAR";
    }
    return "";
};

export const getMensagemAudioBooks = (username: string, password: string, vencimento: Date, loginType: LoginTituloType): string => {
    let msg = getHeaderMessage(loginType);

    const options = { timeZone: 'America/Sao_Paulo', hour12: false };

    if (loginType === LoginTituloType.renovacao) {
        msg += `Login *${username}* renovado com sucesso!\nNovo vencimento: ${vencimento.toLocaleString('pt-br', options)}`;
    } else {
        msg += `
        \n💻 *Servidor* : ${process.env.URL_AUDIOBOOKS_WEB}     
        \n👤 *USUARIO:* ${username} 
        \n🔐 *SENHA:* ${password} 
        \n⏰ *Expira:* ${new Date(vencimento).toLocaleDateString('pt-br', options)} 
        \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
        \nAplicativo Android: https://play.google.com/store/apps/details?id=com.audiobookshelf.app
        \nAplicativo IOS: https://testflight.apple.com/join/wiic7QIW
        \n${getFooterMessage(loginType)}
        `;
    }
    return msg.trim(); // Remove espaços em branco no início e no final da string
};
