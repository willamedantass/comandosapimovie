import { Provedor, provedorAcesso } from "../type/provedor";
import { readJSON } from "./jsonConverte";
import path from 'path';

export const getLoginProvedor = (provedor: string) => {
    let acesso = new provedorAcesso();
    switch (provedor) {
        case Provedor.clubtv:
            const clubPass = readJSON(path.join(__dirname, "..", "..", "cache", "club_pass.json"));
            const login = clubPass[Math.floor(Math.random() * clubPass.length)];
            acesso.servidorDNS = process.env.SERVER_DNS_CLUB;
            acesso.user = login.user;
            acesso.password = login.password;
            break;
        case Provedor.tigotv:
            acesso.servidorDNS = process.env.SERVER_DNS_TIGO;
            acesso.user =  process.env.SERVER_TIGO_USER;
            acesso.password =  process.env.SERVER_TIGO_PASSWORD;
            break;
        case Provedor.elitetv:
            acesso.servidorDNS = process.env.SERVER_DNS_ELITE;
            acesso.user =  process.env.SERVER_ELITE_USER;
            acesso.password =  process.env.SERVER_ELITE_PASSWORD;
            break;
        case Provedor.mygotv:
            acesso.servidorDNS = process.env.SERVER_DNS_MYGOTV;
            acesso.user =  process.env.SERVER_MYGOTV_USER;
            acesso.password =  process.env.SERVER_MYGOTV_PASSWORD;
            break;
        case Provedor.titanium:
            acesso.servidorDNS = process.env.SERVER_DNS_TITANIUM;
            acesso.user =  process.env.SERVER_TITANIUM_USER;
            acesso.password =  process.env.SERVER_TITANIUM_PASSWORD;
            break;
        default:
            break;
    }
    return acesso;
}