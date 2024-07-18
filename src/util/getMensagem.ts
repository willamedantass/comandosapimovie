import { LoginTituloType } from "../type/login";
import { gemini } from "./gemini";
import path from "path";
import fs from 'fs';
require('dotenv/config');

interface MensagemParams {
    nome?: string;
    dias?: string;
}

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


export const mensagem = (key: string, nome?: string) => {
    try {
        const pathFileJson = path.join(__dirname, '..', '..', 'cache', 'mensagens.json');
        const mensagens = JSON.parse(fs.readFileSync(pathFileJson, 'utf-8'));
        let msg = mensagens[key];
        msg = nome ? msg = msg.replace(/\*\*\*/g, nome) : msg.replace(/\*\*\*/g, '');
        return msg;
    } catch (error) {
        console.error('Erro ao gerar mensagem.', error.message);
    }
}


export const gerarMensagemIa = async (tipo: 'vencido' | 'vai_vencer' | 'verificar_nome', params: MensagemParams = {}): Promise<any> => {
    let msg: any = '';
    try {
        const pathFileJson = path.join(__dirname, '..', '..', 'cache', 'mensagens.json');
        const mensagens = JSON.parse(fs.readFileSync(pathFileJson, 'utf-8'));
        const base = mensagens[tipo];
        let { prompt_solicitacao, prompt_instrucoes, prompt_info, prompt_negativo, defaultMessage } = base;

        // Substituir placeholders nos prompts com parâmetros fornecidos
        if (params.nome) {
            prompt_solicitacao = prompt_solicitacao.replace(/%NOME%/g, params.nome);
            defaultMessage = defaultMessage.replace(/%NOME%/g, params.nome);
        }
        if (params.dias) {
            prompt_solicitacao = prompt_solicitacao.replace(/%DIAS%/g, params.dias);
            defaultMessage = defaultMessage.replace(/%DIAS%/g, params.nome);
        }

        // Executar gemini e obter resultado
        const result = await gemini(prompt_solicitacao, prompt_instrucoes, prompt_info, prompt_negativo);
        msg = result ? result : defaultMessage;
    } catch (error) {
        console.error(`Erro ao gerar mensagem ${tipo}.`, error.message);
    }
    return msg;
}

// export const mensagemEstaVencido = async (nome: string): Promise<string> => {
//     let msg: string = '';
//     try {
//         const pathFileJson = path.join(__dirname, '..', '..', 'cache', 'mensagens.json');
//         const mensagens = JSON.parse(fs.readFileSync(pathFileJson, 'utf-8'));
//         let base = mensagens['vencido'];
//         base.prompt_solicitacao = base.prompt_solicitacao.replace(/\*\*\*/g, nome);
//         base.default = base.default.replace(/\*\*\*/g, nome);
//         const { prompt_solicitacao, prompt_instrucoes, prompt_info, prompt_negativo, default: defaultMessage } = base;
//         const result = await gemini(prompt_solicitacao, prompt_instrucoes, prompt_info, prompt_negativo);
//         msg = result ? result : defaultMessage;
//     } catch (error) {
//         console.error('Erro ao gerar mensagemEstaVencido.', error.message);
//     }
//     return msg;
// }

// export const mensagemVaiVencer = async (nome: string, dias: string): Promise<string> => {
//     let msg: string = '';
//     try {
//         const pathFileJson = path.join(__dirname, '..', '..', 'cache', 'mensagens.json');
//         const mensagens = JSON.parse(fs.readFileSync(pathFileJson, 'utf-8'));
//         let base = mensagens['vai_vencer'];
//         base.prompt_solicitacao = base.prompt_solicitacao.replace(/\*\*\*/g, nome || 'cliente').replace(/\*\*\*/g, dias)
//         const { prompt_solicitacao, prompt_instrucoes, prompt_info, prompt_negativo, default: defaultMessage } = base;
//         const result = await gemini(prompt_solicitacao, prompt_instrucoes, prompt_info, prompt_negativo);
//         msg = result ? result : defaultMessage;
//         msg = msg.replace(/\*\*\*/g, nome || 'cliente').replace(/\*\*\*/g, dias);
//     } catch (error) {
//         console.error('Erro ao gerar mensagemVaiVencer.', error.message);
//     }
//     return msg;
// }