import { getLoginProvedor } from './getLoginProvedor';
import axios from 'axios';

export const getAxiosResult = async (action: string, provedor: string, id?: string, limit?: string) => {

    const acesso = getLoginProvedor(provedor);
    try {
        let res;
        if (action === "get_vod_streams") {
            res = await axios(`${acesso.servidorDNS}/player_api.php?username=${acesso.user}&password=${acesso.password}&action=${action}&vod_id=${id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else if (action === "get_vod_info") {
            res = await axios(`${acesso.servidorDNS}/player_api.php?username=${acesso.user}&password=${acesso.password}&action=${action}&vod_id=${id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else if (action === "get_series") {
            res = await axios(`${acesso.servidorDNS}/player_api.php?username=${acesso.user}&password=${acesso.password}&action=${action}&series_id=${id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else if (action === "get_series_info") {
            res = await axios(`${acesso.servidorDNS}/player_api.php?username=${acesso.user}&password=${acesso.password}&action=${action}&series_id=${id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else if (action === "get_live_streams") {
            res = await axios(`${acesso.servidorDNS}/player_api.php?username=${acesso.user}&password=${acesso.password}&action=${action}&category_id=${id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else if (action === "get_short_epg") {
            res = await axios(`${acesso.servidorDNS}/player_api.php?username=${acesso.user}&password=${acesso.password}&action=${action}&stream_id=${id}&limit=${limit}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else {
            res = await axios(`${acesso.servidorDNS}/player_api.php?username=${acesso.user}&password=${acesso.password}&action=${action}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        }
        return res;
    } catch (error) {
        console.log(`Erro ao carregar servidor tigo, erro: ${error}`);
    }
}