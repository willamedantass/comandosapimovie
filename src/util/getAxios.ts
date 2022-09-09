import path from 'path';
import axios from 'axios';
import { provedorAcesso } from '../type/provedor';
import { readJSON } from '../function';

export const getAxiosResult = async (action: string, provedor: string, id?: string, limit?: string) => {

    const login: provedorAcesso = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === provedor);
    try {
        let res;
        if (action === "get_vod_streams") {
            res = await axios(`${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=${action}${id ? `&category_id=${id}` : ''}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else if (action === "get_vod_info") {
            res = await axios(`${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=${action}&vod_id=${id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else if (action === "get_series") {
            res = await axios(`${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=${action}${id ? `&category_id=${id}` : ''}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else if (action === "get_series_info") {
            res = await axios(`${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=${action}&series_id=${id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else if (action === "get_live_streams") {
            res = await axios(`${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=${action}&category_id=${id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else if (action === "get_short_epg") {
            res = await axios(`${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=${action}&stream_id=${id}&limit=${limit}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else {
            res = await axios(`${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=${action}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        }
        return res;
    } catch (error) {
        console.log(`Erro ao carregar servidor. Login: ${login} - Erro: ${error}`);
    }
}