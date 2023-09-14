import { buscarLogin, updateLogin } from "../data/loginDB";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { mensagem } from "../util/jsonConverte";
import { Login } from "../type/login";

export default async ({ reply, args, owner }: IBotData) => {
    if (owner) {
        const login: Login | undefined = buscarLogin(StringClean(args));
        if (login) {
            if (login.isLive) {
                login.isLive = false;
                updateLogin(login);
                await reply("✅ Acesso live removido!");
            } else {
                login.isLive = true;
                updateLogin(login);
                await reply("❎ Acesso live liberado!");
            }
        } else {
            await reply('Usuário informado não existe!')
        }
    } else {
        await reply(mensagem('acessoNegado'));
    }
};