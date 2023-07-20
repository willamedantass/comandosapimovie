import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import { createLoginAPI } from "../controller/LoginsWebOPainelController";

export default async ({ reply, owner }: IBotData) => {
    if (owner) {
        const result = await createLoginAPI();
        result ? await reply(`Logins criados com sucesso!`) : await reply('Não foi possível criar os logins'); 
    } else {
        reply(StringsMsg.acessoNegado);
    }
};