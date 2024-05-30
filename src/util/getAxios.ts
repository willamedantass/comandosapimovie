import { provedorAcesso } from '../type/provedor';
import { readJSON } from './jsonConverte';
import axios from 'axios';
import path from 'path';

const actionParams: { [key: string]: (login: provedorAcesso, id?: string, limit?: string) => string } = {
    "get_vod_streams": (login, id) => `${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=get_vod_streams&category_id=${id}`,
    "get_vod_info": (login, id) => `${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=get_vod_info&vod_id=${id}`,
    "get_series": (login, id) => `${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=get_series&category_id=${id}`,
    "get_series_info": (login, id) => `${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=get_series_info&series_id=${id}`,
    "get_live_streams": (login, id) => `${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=get_live_streams&category_id=${id}`,
    "get_short_epg": (login, id, limit) => `${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=get_short_epg&stream_id=${id}&limit=${limit}`
};

export const getAxiosResult = async (action: string, provedor: string, id?: string, limit?: string): Promise<any | null> => {
    const logins: provedorAcesso[] = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json"));
    const login = logins.find(element => element.id === provedor);

    if (!login || login.dns === '') {
        console.error('Parâmetro DNS vazio, não é possível executar o getAxios.');
        return { status: 401, data: [] };
    }

    try {
        const url = actionParams[action]
            ? actionParams[action](login, id, limit)
            : `${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=${action}`;

        const headers = {
            'User-Agent': 'IPTVSmartersPlayer',
            'accept-encoding': 'gzip',
            'content-type': 'application/x-www-form-urlencoded'
        };

        const res = await axios(url, { headers });
        return res;
    } catch (error) {
        console.error(`Erro ao carregar servidor ${login.dns} - Login: ${login.user} - Erro: ${error.message} - ${new Date().toLocaleDateString()}`);
    }
    return null;
};
