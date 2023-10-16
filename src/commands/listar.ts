import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/jsonConverte";

import { Login } from "../type/login";
import { allLogins } from "../data/loginDB";

export default async ({ sendText, reply, owner }: IBotData) => {
    if (owner) {
        const options = { timeZone: 'America/Sao_Paulo', hour12: false };
        let msg: string = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n';
        allLogins().forEach((element, index) => {
            msg += `${index + 1} - ${element.user}\nVenc.: ${new Date(element.vencimento).toLocaleDateString('pt-br', options)}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`
        });
        await sendText(true, msg);
    } else {
        await reply(mensagem('acessoNegado'));
    }
};