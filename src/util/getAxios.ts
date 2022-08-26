import axios from 'axios';
import { Provedor } from '../type/provedor';
import { getLoginProvedor } from './getLoginProvedor';

export const getAxiosResult = async (action: string, provedor: string, vod_id?: string, series_id?: string, category_id?: string, stream_id?: string) => {

    const acesso = getLoginProvedor(provedor);
    try {
        let res;
        if (vod_id) {
            res = await axios(`${acesso.servidorDNS}/player_api.php?username=${acesso.user}&password=${acesso.password}&action=${action}&vod_id=${vod_id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else if (series_id) {
            res = await axios(`${acesso.servidorDNS}/player_api.php?username=${acesso.user}&password=${acesso.password}&action=${action}&series_id=${series_id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else if (category_id) {
            res = await axios(`${acesso.servidorDNS}/player_api.php?username=${acesso.user}&password=${acesso.password}&action=${action}&category_id=${category_id}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else if (stream_id) {
            res = await axios(`${acesso.servidorDNS}/player_api.php?username=${acesso.user}&password=${acesso.password}&action=${action}&stream_id=${stream_id}&limit=3`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        } else {
            res = await axios(`${acesso.servidorDNS}/player_api.php?username=${acesso.user}&password=${acesso.password}&action=${action}`, { headers: { 'User-Agent': 'IPTVSmartersPlayer' } });
        }
        return res;
    } catch (error) {
        console.log(`Erro ao carregar servidor tigo, erro: ${error}`);
    }
}