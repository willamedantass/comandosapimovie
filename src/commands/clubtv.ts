import { StringClean } from "../util/stringClean";
import { IBotData } from "../Interface/IBotData";
import { ILogin } from "../type/login.model";
import { loginFindByUser, loginUpdate } from "../data/login.service";

export default async ({ reply, args }: IBotData) => {
    const login: ILogin | null = await loginFindByUser(StringClean(args));
    if (login) {
        if (login?.isClubtv) {
            login.isClubtv = false;
            await loginUpdate(login);
            await reply("✅ Acesso aos canais clubtv removido!");
        } else {
            login.isClubtv = true;
            await loginUpdate(login);
            await reply("❎ Acesso aos canais clubtv liberado!");
        }
    } else {
        reply('Usuário informado não existe!')
    }
};