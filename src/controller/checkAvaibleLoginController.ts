import { provedorAcesso } from "../type/provedor";
import { readJSON } from "../util/jsonConverte";
import { LivePass } from "../type/livePass";
import path from "path";
require('dotenv/config');

export const checkAvaibleLogin = async (livePass: LivePass) => {
    let result = false;

    const idLive = process.env.PROVIDER_LIVE_ID as string;
    const provedorAcesso: provedorAcesso = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === idLive);

    const url = `${provedorAcesso.dns}/player_api.php?username=${livePass.username}&password=${livePass.password}`;

    try {
        const axios = require('axios');
        const res = await axios.get(url, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });

        if (res?.status === 200 && res?.data && !res.data['error']) {
            const max_connections = parseInt(res.data['user_info']['max_connections']);
            const active_cons = parseInt(res.data['user_info']['active_cons']);
            const ativo = res.data['user_info']['status'] === 'Active' ? true : false;
            if (active_cons < max_connections && ativo) {
                result = true;
            }
        }
    } catch (error) {
        console.log(`Erro ao consultar servidor DNS-${provedorAcesso.dns} login ${livePass.username} - ${error}`);
    }
    return result;
}