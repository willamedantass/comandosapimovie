import { searchLoginPorUsername, updateLogin } from "../data/loginDB";
import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { Login } from "../type/login";

export default async ({ reply, args }: IBotData) => {
    const login: Login | undefined = searchLoginPorUsername(StringClean(args));
    if (login) {
        if (login?.isClubtv) {
            login.isClubtv = false;
            await updateLogin(login);
            await reply("✅ Acesso aos canais clubtv removido!");
        } else {
            login.isClubtv = true;
            await updateLogin(login);
            await reply("❎ Acesso aos canais clubtv liberado!");
        }
    } else {
        reply('Usuário informado não existe!')
    }
};