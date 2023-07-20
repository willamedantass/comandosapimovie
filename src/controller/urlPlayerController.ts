import createWebLoginClub from "./createWebLoginClubController";
import { buscarLogin, updateLogin } from "./loginDBController";
import { readJSON, writeJSON } from "../util/jsonConverte";
import { provedorAcesso } from "../type/provedor";
import { Login } from "../type/login";
import axios, { AxiosResponse } from 'axios';
import path from "path";
import { getAxiosResult } from "../util/getAxios";
import { createLoginWebKOfficeController } from "./createLoginWebKOfficeController";
import { deleteLoginKOffice } from "./deleteLoginKOffice";
const idProvedorClub = '2'
let isProcesslogin: boolean = false;

export const urlPlayerController = async (req, res) => {
    const media: string = req.params.media;
    const user: string = req.params.user;
    const password: string = req.params.password;
    const video: string = req.params.video.substring(1);
    const idProvedor: string = req.params.video.charAt(0);

    if (!user) {
        res.status(405).end();
    }

    let login: Login = buscarLogin(user);
    if (!login) {
        console.log(`Usuário inválido! Usuário: ${user}`);
        return res.json({ "user_info": { "auth": 0 } });
    }
    if (password !== login.password) {
        console.log(`Senha inválido! Senha: ${password}`);
        return res.json({ "user_info": { "auth": 0 } });
    }

    const agora = new Date();
    const vencimento = new Date(login.vencimento);
    if (agora > vencimento) {
        console.log(`Login vencido! Usuário: ${user}`);
        return res.json({ "user_info": { "auth": 0 } });
    }

    if (media === 'live' && !login.live) {
        return res.json({ "user_info": { "auth": 0 } });
    }

    const remoteIp = (req.headers['x-forwarded-for'] || '').split(',').pop() || // Recupera o IP de origem, caso a fonte esteja utilizando proxy
        req.connection.remoteAddress || // Recupera o endereço remoto da chamada
        req.socket.remoteAddress || // Recupera o endereço através do socket TCP
        req.connection.socket.remoteAddress // Recupera o endereço através do socket da conexão
    if (remoteIp !== login?.remoteIp) {
        let dataRemote = login?.dataRemote ? new Date(login.dataRemote) : dataAcesso(-15);
        if (agora > dataRemote) {
            login.remoteIp = remoteIp;
            login.dataRemote = dataAcesso(15).toISOString();
            updateLogin(login);
        } else {
            console.log('Acesso remoto não permitido, houve tentativa de acesso duplicado.');
            login.countForbiddenAccess += 1;
            updateLogin(login);
            return res.json({ "user_info": { "auth": 0 } });
        }
    }

    const link = await getUrl(idProvedor, media, video);
    console.log(`Link Gerado: ${link}`);
    if (!link) {
        return res.status(404).end();
    }
    res.set('location', link);
    res.status(301).send()
}

const getUrl = async (provedor: string, media: string, video: string) => {
    require('dotenv/config');
    const idProvedorLive = process.env.PROVEDOR_LIVES_ID;
    const acesso: provedorAcesso = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === provedor);
    if (acesso) {
        if (media === 'live' && (provedor === idProvedorLive || provedor === idProvedorClub)) {
            return await gerenteCountLive(provedor, acesso.dns, media, video);
        } else {
            return `${acesso.dns}/${media}/${acesso.user}/${acesso.password}/${video}`;
        }
    }
}

export const gerenteCountLive = async (provedor: string, dnsProvedor: string, media: string, video: string) => {

    let pathLive: string, pathLiveTemp: string, login;
    if (provedor === idProvedorClub) {
        pathLive = path.join(__dirname, "..", "..", "cache", "club_pass.json");
        pathLiveTemp = path.join(__dirname, "..", "..", "cache", "club_temp.json");
    } else {
        pathLive = path.join(__dirname, "..", "..", "cache", "live_pass.json");
        pathLiveTemp = path.join(__dirname, "..", "..", "cache", "live_temp.json");
    }

    const live_pass = readJSON(pathLive);
    login = await checkAvaibleLogin(dnsProvedor, live_pass, false);
    if (login) {
        return `${dnsProvedor}/${media}/${login["user"]}/${login["password"]}/${video}`;
    }

    const live_temp = readJSON(pathLiveTemp);
    login = await checkAvaibleLogin(dnsProvedor, live_temp, true);
    if (login) {
        return `${dnsProvedor}/${media}/${login["user"]}/${login["password"]}/${video}`;
    }

    const action = 'get_live_categories';
    const estaNoAr = await getAxiosResult(action, provedor);
    if (!estaNoAr || estaNoAr?.status > 201 || !estaNoAr?.data || estaNoAr?.data['error']) {
        return console.log(`Servidor id-${provedor} está fora do ar. Status: ${estaNoAr?.status} Erro: ${estaNoAr?.data}`);
    }

    if (isProcesslogin) {
        return console.log('Sistema está em processo de criação de login!');
    }

    isProcesslogin = true;
    for (let i = 0; i < 3; i++) {
        if (provedor === idProvedorClub) {
            login = await createWebLoginClub(true);
        } else {
            login = await createLoginWebKOfficeController(true);
        }

        if (login && login['user']) {
            const Login_temp = { user: login['user'], password: login['pass'] };
            let liveTemp = readJSON(pathLiveTemp);
            liveTemp.push(Login_temp);
            writeJSON(pathLiveTemp, liveTemp);
        }
    }

    //Método só funciona nos paineis koffice.
    if (provedor !== idProvedorClub) {
        deleteLoginKOffice(true);
    }
    isProcesslogin = false;
    return `${dnsProvedor}/${media}/${login['user']}/${login['pass']}/${video}`;
}

const checkAvaibleLogin = async (dnsProvedor: string, logins, isTrialLogin: boolean) => {
    if (logins.length === 0) {
        return
    }

    let uLogin, breakFor = false;
    const shuffleLogins = shuffle(logins);
    for (const login of shuffleLogins) {
        let isError404 = false;
        const url = `${dnsProvedor}/player_api.php?username=${login.user}&password=${login.password}`;
        const res = await axios(url, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } })
            .catch(res => {
                isError404 = res?.response?.status === 404;
                console.log(`URLPLAYERCONTROLLER: Erro ao consultar servidor DNS-${dnsProvedor} login ${login.user} - ${res}`)
            }) as AxiosResponse;

        if (!isError404 && res?.status === 200 && res?.data && !res.data['error']) {
            const max_connections = parseInt(res.data['user_info']['max_connections']);
            const active_cons = parseInt(res.data['user_info']['active_cons']);
            const ativo = res.data['user_info']['status'] === 'Active' ? true : false;
            if (active_cons < max_connections && ativo) {
                uLogin = login;
                breakFor = true;
            }
        }

        if (breakFor) {
            break;
        }
    }
    return uLogin;
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