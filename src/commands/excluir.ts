import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/jsonConverte";
import { removeLogin } from "../data/loginDB";

export default async ({ reply, args, owner }: IBotData) => {
    if (owner) {
        if (args.length < 8) {
            return await reply(mensagem('errorLoginSize'));
        }
        const username = StringClean(args);
        const msg = await removeLogin(username);
        await reply(msg);
    } else {
        await reply(mensagem('acessoNegado'));
    }
}