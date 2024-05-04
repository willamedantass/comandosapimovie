import { createUserFluxo, processUserFluxo, readUserFluxo, updateUserFluxo } from "../data/fluxoAcessoDB";
import { deleteLivePass, readLivePass, searchLivePass, unusedUserLivePass } from "../data/livePassDB";
import { CreateLoginApi, deleteLoginAPI } from "./LoginApiController";
import { isVencimentoController } from "./isVencimentoController";
import { userFluxoAcesso } from "../type/userFluxoAcesso";
import { loginFindByUser, loginUpdate } from "../data/login.service";
import { provedorAcesso } from "../type/provedor";
import { sendMessage } from "../util/sendMessage";
import { readJSON } from "../util/jsonConverte";
import { LivePass } from "../type/livePass";
import { ILogin } from "../type/login.model";
import path from "path";
require('dotenv/config');

export const urlPlayerController = async (req, res) => {
    const { media, user, password } = req.params;
    const video: string = req.params.video.substring(1);
    const idProvedor: string = req.params.video.charAt(0);

    let login: ILogin | null = await loginFindByUser(user);
    if (!login) {
        console.log(`Usuário inválido! Usuário: ${user}`);
        return res.json({ "user_info": { "auth": 0 } });
    }

    if (password !== login.password) {
        console.log(`Senha inválida! Senha usada: ${password}`);
        return res.json({ "user_info": { "auth": 0 } });
    }

    const isVencido = await isVencimentoController(login);
    if (isVencido) {
        return res.json({ "user_info": { "auth": 0 } });
    }

    if (media === 'live' && !login.isLive) {
        return res.json({ "user_info": { "auth": 0 } });
    }

    // const agora = new Date();
    // const remoteIp = (req.headers['x-forwarded-for'] || '').split(',').pop() || // Recupera o IP de origem, caso a fonte esteja utilizando proxy
    //     req.connection.remoteAddress || // Recupera o endereço remoto da chamada
    //     req.socket.remoteAddress || // Recupera o endereço através do socket TCP
    //     req.connection.socket.remoteAddress // Recupera o endereço através do socket da conexão
    // if (remoteIp !== login?.remoteIp) {
    //     const dataRemote = login?.dataRemote ? new Date(login.dataRemote) : dataAcesso(-15);
    //     if (agora > dataRemote) {
    //         login.remoteIp = remoteIp;
    //         login.dataRemote = dataAcesso(15).toISOString();
    //         await loginUpdate(login);
    //     } else {
    //         console.log(`Acesso ${user} não permitido, houve tentativa de acesso duplicado.`);
    //         const countForbiddenAccess: number = login.countForbiddenAccess || 0;
    //         login.countForbiddenAccess = countForbiddenAccess + 1;
    //         await loginUpdate(login);
    //         return res.json({ "user_info": { "auth": 0 } });
    //     }
    // }

    const generatedLink = await getUrl(idProvedor, media, video, login.user);
    console.log(`Link Gerado: ${generatedLink}`);
    if (!generatedLink) {
        return res.status(404).end();
    }
    res.set('location', generatedLink);
    res.status(301).send();
}

const getUrl = async (idProvedor: string, media: string, video: string, user: string) => {
    let acesso: provedorAcesso = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === idProvedor);
    if (acesso) {
        if (media === 'live') {
            return await processLogin(idProvedor, acesso?.dns, media, video, user);
        } else {
            //busca outros logins para reproduzir os filmes e series do mesmo provedor de live
            const idLive = process.env.PROVEDOR_LIVES_ID as string;
            if (acesso.id === idLive) {
                const login = unusedUserLivePass(true) as LivePass;
                acesso.user = login.username;
                acesso.password = login.password;
            }
            return `${acesso?.dns}/${media}/${acesso?.user}/${acesso?.password}/${video}`;
        }
    }
}

export const processLogin = async (provedor: string, dnsProvedor: string, media: string, video: string, user: string) => {

    let livePass: LivePass | undefined;
    processUserFluxo();

    const userAcesso: userFluxoAcesso | undefined = readUserFluxo().find(userFluxo => userFluxo.user === user);
    if (userAcesso) {
        livePass = searchLivePass(userAcesso.login);
        if (!livePass?.isDelete) {
            updateUserFluxo(userAcesso);
            return `${dnsProvedor}/${media}/${userAcesso.login}/${userAcesso.password}/${video}`
        }
    }

    let isRandom = false;
    livePass = unusedUserLivePass(isRandom);
    if (livePass) {
        createUserFluxo(user, livePass);
        return `${dnsProvedor}/${media}/${livePass.username}/${livePass.password}/${video}`;
    }

    const result: boolean = await CreateLoginApi();
    if (!result) {
        isRandom = true;
        livePass = unusedUserLivePass(isRandom) as LivePass;
        await sendMessage('8588199556', `Logins esgotados!\nUsuário ${user} - Login ${livePass.username}`);
        return `${dnsProvedor}/${media}/${livePass.username}/${livePass.password}/${video}`;
    }

    const expired: LivePass[] = readLivePass().filter(user => user?.isDelete == true);
    for (let user of expired) {
        await deleteLoginAPI(user.id);
        deleteLivePass(user.username);
    }

    return processLogin(provedor, dnsProvedor, media, video, user);
}

const dataAcesso = (minutes: number) => {
    let dataAcesso = new Date();
    dataAcesso.setMinutes(dataAcesso.getMinutes() + minutes);
    return dataAcesso;
}

const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}