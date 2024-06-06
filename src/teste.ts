import { loginUpdate, loginsAll } from './data/login.service';
import { ILogin } from './type/login.model';
import { userFindByRemoteJid, userUpdate } from './data/user.service';
import { connectDB, disconnectDB } from './data/mongodb';
require('dotenv/config');

(async function iniciar() {
    await connectDB();
    const logins: ILogin[] = await loginsAll();
    for (let login of logins) {
        if (!login.contato) continue;
        const jid = `55${login.contato}@s.whatsapp.net`;
        let user = await userFindByRemoteJid(jid);
        if (!user) continue;
        login.uid = user.id;
        user.vencimento = login.vencimento;
        await userUpdate(user);
        await loginUpdate(login);
    }
    await disconnectDB();
})();