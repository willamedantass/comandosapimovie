import { userFluxoAcesso } from "../type/userFluxoAcesso";
import { readUserFluxo } from "../data/fluxoAcessoDB";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";

export default async ({ sendText, reply, owner }: IBotData) => {
    if (owner) {
        const users: userFluxoAcesso[] = readUserFluxo();
        let online: string = '';
        const options = { timeZone: 'America/Sao_Paulo', hour12: false }

        if(!users.length){
            return await reply('Nenhum usuário conectado.');
        }

        users.forEach(user => {
            online += (`\n
            ${user.user.toUpperCase()} - 
            Acesso: ${new Date(user.data).toLocaleString('pt-br', options)}`);
        });
        
        await sendText(true, `   **Clientes Online** ${online}`);
    } else {
        reply(StringsMsg.acessoNegado);
    }
};