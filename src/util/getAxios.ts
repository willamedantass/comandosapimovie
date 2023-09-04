import path from 'path';
import { provedorAcesso } from '../type/provedor';
import { readJSON } from './jsonConverte';
import axios from 'axios';
require('dotenv');

export const getAxiosResult = async (action: string, provedor: string, id?: string, limit?: string) => {

    const login: provedorAcesso = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === provedor);
    const url_api: string = process.env.SERVER_API || '';
    provedor === '5' && (login.dns = url_api);
    if (login?.dns === '') {
        console.error('Erro no getAxios o dns está vazio!');
        return { status: 401, data: [] }
    }
    try {
        let res;
        if (login) {
            if (action === "get_vod_streams") {
                res = await axios(`${login?.dns}/player_api.php?username=${login?.user}&password=${login?.password}&action=${action}${id ? `&category_id=${id}` : ''}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
            } else if (action === "get_vod_info") {
                res = await axios(`${login?.dns}/player_api.php?username=${login?.user}&password=${login?.password}&action=${action}&vod_id=${id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
            } else if (action === "get_series") {
                res = await axios(`${login?.dns}/player_api.php?username=${login?.user}&password=${login?.password}&action=${action}${id ? `&category_id=${id}` : ''}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
            } else if (action === "get_series_info") {
                res = await axios(`${login?.dns}/player_api.php?username=${login?.user}&password=${login?.password}&action=${action}&series_id=${id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
            } else if (action === "get_live_streams") {
                res = await axios(`${login?.dns}/player_api.php?username=${login?.user}&password=${login?.password}&action=${action}${id ? ('category_id=' + id) : ''}`, { headers: { 'accept-encoding': 'gzip', 'User-Agent': 'IPTVSmartersPlayer', 'content-type': 'application/x-www-form-urlencoded' } });
            } else if (action === "get_short_epg") {
                res = await axios(`${login?.dns}/player_api.php?username=${login?.user}&password=${login?.password}&action=${action}&stream_id=${id}&limit=${limit}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
            } else {
                res = await axios(`${login?.dns}/player_api.php?username=${login?.user}&password=${login?.password}${action ? '&action=' + action : ''}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
            }
        }
        return res;
    } catch (error) {
        console.log(`Erro ao carregar servidor ${login?.dns}. Login: ${login?.user} - Erro: ${error}`);
    }
}