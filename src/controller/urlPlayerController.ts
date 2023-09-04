import { createUserFluxo, processUserFluxo, readUserFluxo, updateUserFluxo } from "../data/fluxoAcessoDB";
import { deleteLivePass, readLivePass, searchLivePass, unusedUserLivePass } from "../data/livePassDB";
import { createLoginAPI, deleteLoginAPI } from "./LoginsWebOPainelController";
import { buscarLogin, updateLogin } from "../data/loginDB";
import { userFluxoAcesso } from "../type/userFluxoAcesso";
import { provedorAcesso } from "../type/provedor";
import { readJSON } from "../util/jsonConverte";
import { livePass } from "../type/livePass";
import { enviarMensagem } from "../bot";
import { Login } from "../type/login";
import path from "path";
const idProvedorClub = '2';

export const urlPlayerController = async (req, res) => {
    const { media, user, password } = req.params;
    const video: string = req.params.video.substring(1);
    const idProvedor: string = req.params.video.charAt(0);

    if (!user) {
        res.status(405).end();
    }

    let login: Login | undefined= buscarLogin(user);
    if (!login) {
        console.log(`Usuário inválido! Usuário: ${user}`);
        return res.json({ "user_info": { "auth": 0 } });
    }
    if (password !== login.password) {
        console.log(`Senha inválida! Senha usada: ${password}`);
        return res.json({ "user_info": { "auth": 0 } });
    }

    const agora = new Date();
    const vencimento = new Date(login.vencimento);
    if (agora > vencimento) {
        const dataMensagem = login?.data_msg_vencimento ? new Date(login?.data_msg_vencimento) : null;
        if(dataMensagem && dataMensagem.getDay() !== agora.getDay()){
            const mensagens = readJSON(path.join(__dirname, '..','..','cache','mensagens.json'));
            const contato = login?.contato ? login.contato : '8588199556';
            await enviarMensagem(contato, mensagens.vencimento);
        }
        console.info(`Login expirado! Usuário: ${user}`);
        return res.json({ "user_info": { "auth": 0 } });
    }

    if (media === 'live' && !login.isLive) {
        return res.json({ "user_info": { "auth": 0 } });
    }

    const remoteIp = (req.headers['x-forwarded-for'] || '').split(',').pop() || // Recupera o IP de origem, caso a fonte esteja utilizando proxy
        req.connection.remoteAddress || // Recupera o endereço remoto da chamada
        req.socket.remoteAddress || // Recupera o endereço através do socket TCP
        req.connection.socket.remoteAddress // Recupera o endereço através do socket da conexão
    if (remoteIp !== login?.remoteIp) {
        const dataRemote = login?.dataRemote ? new Date(login.dataRemote) : dataAcesso(-15);
        if (agora > dataRemote) {
            login.remoteIp = remoteIp;
            login.dataRemote = dataAcesso(15).toISOString();
            updateLogin(login);
        } else {
            console.log('Acesso remoto não permitido, houve tentativa de acesso duplicado.');
            const countForbiddenAccess: number = login.countForbiddenAccess || 0;
            login.countForbiddenAccess = countForbiddenAccess + 1;
            updateLogin(login);
            return res.json({ "user_info": { "auth": 0 } });
        }
    }

    const link = await getUrl(idProvedor, media, video, login.user);
    console.log(`Link Gerado: ${link}`);
    if (!link) {
        return res.status(404).end();
    }
    res.set('location', link);
    res.status(301).send();
}

const getUrl = async (idProvedor: string, media: string, video: string, user: string) => {
    require('dotenv/config');

    // const idProvedorLive = process.env.PROVEDOR_LIVES_ID;
    let acesso: provedorAcesso = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === idProvedor);
    if (acesso) {
        if (media === 'live') {
            return await processLogin(idProvedor, acesso?.dns, media, video, user);
        } else {
            if (acesso.id === '5') {
                const login = unusedUserLivePass(true) as livePass;
                acesso.user = login.username;
                acesso.password = login.password;
            };
            return `${acesso?.dns}/${media}/${acesso?.user}/${acesso?.password}/${video}`;
        }
    }
}

export const processLogin = async (provedor: string, dnsProvedor: string, media: string, video: string, user: string) => {

    let pathLive: string, pathLiveTemp: string, pathLiveAtivos: string;
    if (provedor === idProvedorClub) {
        pathLive = path.join(__dirname, "..", "..", "cache", "club_pass.json");
        pathLiveTemp = path.join(__dirname, "..", "..", "cache", "club_temp.json");
        pathLiveAtivos = path.join(__dirname, "..", "..", "cache", "club_logins_ativos.json");
    } else {
        pathLive = path.join(__dirname, "..", "..", "cache", "live_pass.json");
        pathLiveTemp = path.join(__dirname, "..", "..", "cache", "live_temp.json");
    }

    let live_pass = readJSON(pathLive);
    if (live_pass.length < 1) {
        return undefined;
    }

    if (provedor !== idProvedorClub) {

        processUserFluxo();
        const user_acesso: userFluxoAcesso | undefined = readUserFluxo().find(value => value.user === user);

        if (user_acesso) {
            const live_pass: livePass | undefined = searchLivePass(user_acesso.login);
            if (!live_pass?.isDelete) {
                updateUserFluxo(user_acesso);
                return `${dnsProvedor}/${media}/${user_acesso.login}/${user_acesso.password}/${video}`
            }
        }

        let isRandom = false;
        let live_pass: livePass | undefined = unusedUserLivePass(isRandom);
        if (live_pass) {
            RegisterFluxo(user, live_pass);
            return `${dnsProvedor}/${media}/${live_pass.username}/${live_pass.password}/${video}`;
        }

        //Cria testes e verifica se não foi criado retorna um login randomico.
        const result: boolean = await createLoginAPI();
        if (!result) {
            isRandom = true;
            live_pass = unusedUserLivePass(isRandom) as livePass;
            return `${dnsProvedor}/${media}/${live_pass.username}/${live_pass.password}/${video}`;
        }

        const expired: livePass[] = readLivePass().filter(user => user?.isDelete == true);
        for (let user of expired) {
            await deleteLoginAPI(user.id);
            deleteLivePass(user.username);
        }

        return processLogin(provedor, dnsProvedor, media, video, user);
    }

    live_pass = shuffle(live_pass);
    return `${dnsProvedor}/${media}/${live_pass[0]["user"]}/${live_pass[0]["password"]}/${video}`;
}

const RegisterFluxo = (user: string, live_pass: livePass) => {
    const data_expirar = new Date();
    const login = live_pass.username, password = live_pass.password;
    data_expirar.setHours(data_expirar.getHours() + 2);
    createUserFluxo({
        user: user,
        login: login,
        password: password,
        expire: data_expirar.toISOString(),
        data: new Date().toISOString()
    } as userFluxoAcesso);
}

// const checkAvaibleLogin = async (dnsProvedor: string, login) => {
//     let result = false;
//     const url = `${dnsProvedor}/player_api.php?username=${login.user}&password=${login.password}`;
//     const res = await axios(url, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } })
//         .catch(res => {
//             console.log(`Erro ao consultar servidor DNS-${dnsProvedor} login ${login.user} - ${res}`);
//         }) as AxiosResponse;

//     if (res?.status === 200 && res?.data && !res.data['error']) {
//         const max_connections = parseInt(res.data['user_info']['max_connections']);
//         const active_cons = parseInt(res.data['user_info']['active_cons']);
//         const ativo = res.data['user_info']['status'] === 'Active' ? true : false;
//         if (active_cons < max_connections && ativo) {
//             result = true;
//         }
//     }

//     return result;
// }

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