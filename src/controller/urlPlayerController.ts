import { postWebCreateLoginController } from "./postWebCreateLoginController";
import { readJSON, writeJSON } from "../util/jsonConverte";
import { Provedor } from "../type/provedor";
import { Login } from "../type/login";
import axios from 'axios';
import path from "path";

export const urlPlayerController = async (req, res) => {
    const media: string = req.params.media;
    const user: string = req.params.user;
    const password: string = req.params.password;
    const video: string = req.params.video.substring(1);
    const idProvedor: string = req.params.video.charAt(0);

    const pathLogins = path.join(__dirname, "..", "..", "cache", "login.json");
    let login: Login = readJSON(pathLogins).find(value => value.user === user);
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

    let link = '';
    switch (idProvedor) {
        case Provedor.mygotv:
            link = `${process.env.SERVER_DNS_MYGOTV}/${media}/${process.env.SERVER_MYGOTV_USER}/${process.env.SERVER_MYGOTV_PASSWORD}/${video}`;
            break;
        case Provedor.clubtv:
            const clubPass: [] = readJSON(path.join(__dirname, "..", "..", "cache", "club_pass.json"));
            const login = clubPass[Math.floor(Math.random() * clubPass.length)];
            link = `${process.env.SERVER_DNS_CLUB}/${media}/${login["user"]}/${login["password"]}/${video}`;
            break;
        case Provedor.tigotv:
            link = await gerenteCountLive(process.env.SERVER_DNS_TIGO, user, password, media, video);
            break;
        case Provedor.elitetv:
            link = `${process.env.SERVER_DNS_ELITE}/${media}/${process.env.SERVER_ELITE_USER}/${process.env.SERVER_ELITE_PASSWORD}/${video}`;
            break;
        case Provedor.titanium:
            link = `${process.env.SERVER_DNS_TITANIUM}/${media}/${user}/${password}/${video}`;
            break;
        default:
            break;
    }
    res.set('location', link);
    res.status(301).send()
}

export const gerenteCountLive = async (dnsProvedor: string, user: string, password: string, media: string, video: string) => {

    if (user.includes('meuteste')) {
        return getUrl(dnsProvedor, media, user, password, video);
    }

    if (media === 'live') {
        const live_pass = readJSON(path.join(__dirname, "..", "..", "cache", "live_pass.json"));

        let login = await checkAvaibleLogin(dnsProvedor, live_pass);
        if (login) {
            return getUrl(dnsProvedor, media, login.user, login.password, video);
        }

        const pathTempLogin = path.join(__dirname, "..", "..", "cache", "live_temp.json");
        const live_temp = readJSON(pathTempLogin);
        login = await checkAvaibleLogin(dnsProvedor, live_temp);
        if (login) {
            return getUrl(dnsProvedor, media, login.user, login.password, video);
        }

        login = await postWebCreateLoginController('loginteste', true, true);
        if (login) {
            const temp = { user: login['user'], password: login['pass'] };
            let liveTemp = readJSON(pathTempLogin);
            liveTemp.push(temp);
            writeJSON(pathTempLogin, liveTemp);
            return getUrl(dnsProvedor, media, temp.user, temp.password, video);
        }
    }
    //Obs.: Se cair nessa ultima opção tem q mudar o usuario e senha para o provedor que esta sendo usando
    return getUrl(dnsProvedor, media, process.env.SERVER_TIGO_USER, process.env.SERVER_TIGO_PASSWORD, video);
}

const checkAvaibleLogin = async (dnsProvedor, logins) => {
    let uLogin, breakFor = false;
    for (const login of logins) {
        await axios(`${dnsProvedor}/player_api.php?username=${login.user}&password=${login.password}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } })
            .then(res => {
                const max_connections = parseInt(res.data['user_info']['max_connections']);
                const active_cons = parseInt(res.data['user_info']['active_cons']);
                const ativo = res.data['user_info']['status'] === 'Active' ? true : false;
                if (active_cons <= max_connections && ativo) {
                    uLogin = login;
                    breakFor = true;
                } else if (!ativo && login.user.includes('meuteste')) {
                    const pathTempLogin = path.join(__dirname, "..", "..", "cache", "live_temp.json")
                    let live_temp = readJSON(pathTempLogin);
                    const index = live_temp.findIndex((item) => item.user === login.user);
                    live_temp.splice(index, 1);
                    writeJSON(pathTempLogin, live_temp);
                }
            }).catch(error => console.log(error));
        if (breakFor) {
            break;
        }
    }
    return uLogin;
}

const getUrl = (dnsProvedor: string, media: string, user: string, password: string, video: string) => {
    return `${dnsProvedor}/${media}/${user}/${password}/${video}`
}