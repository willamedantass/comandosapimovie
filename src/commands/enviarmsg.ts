import path from "path";
import { IBotData } from "../Interface/IBotData";
import { enviarMensagem } from "../bot";
import { readJSON } from "../util/jsonConverte";
import { StringsMsg } from "../util/stringsMsg";

export default async ({ reply, owner }: IBotData) => {
    if (owner) {
        const contato ='8588199556';
        const mensagens = readJSON(path.join(__dirname,'..','..','cache','mensagens.json'));
        await enviarMensagem(contato, mensagens.vencimento);
    } else {
        reply(StringsMsg.acessoNegado);
    }
};