import { readJSON, writeJSON } from "../util/jsonConverte";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { StringsMsg } from "../util/stringsMsg";
import path from "path";

export default async ({ reply, args, owner }: IBotData) => {
    if (owner) {
        if (args.length < 8) {
            return await reply(StringsMsg.errorLoginSize);
        }
        let user = StringClean(args);
        const pathLogin = path.join(__dirname, "..", "..", "cache", "login.json");
        let logins = readJSON(pathLogin);
        const index = logins.findIndex((login) => login.user === user);
        if(!index){
            return await reply('Usuário informado não existe!')
        }
        logins.splice(index, 1);
        writeJSON(pathLogin, logins);
        reply('Usuário excluído com sucesso!');
    } else {
        reply(StringsMsg.acessoNegado);
    }
}