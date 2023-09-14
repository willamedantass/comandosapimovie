import { IBotData } from "../Interface/IBotData";
import { readLogins } from "../data/loginDB";
import { Login } from "../type/login";
import { mensagem } from "../util/jsonConverte";

export default async ({ sendText, reply, owner }: IBotData) => {
    if (owner) {
        const options = { timeZone: 'America/Sao_Paulo', hour12: false };
        const hoje = new Date();
        let login: Login[] = readLogins();
        let msg: string = '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n'
        login.forEach((element, index) => {
            if (new Date(element.vencimento) < hoje) {
                msg += `${element.user}\nVenc.: ${new Date(element.vencimento).toLocaleDateString('pt-br', options)}\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n`
            }
        });
        await sendText(true, msg);
    } else {
        await reply(mensagem('acessoNegado'));
    }
};