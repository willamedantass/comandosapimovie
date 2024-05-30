import { readJSON } from '../util/jsonConverte';
import path from 'path';

interface ProvedorAcesso {
    id: string;
    dns: string;
    user: string;
    password: string;
}

export const generateUrl = (id: string, type: 'epg' | 'vod' | 'series', limit?: string): string | null => {
    const streamId = id.substring(1);
    const provedor = id.charAt(0);

    const logins: ProvedorAcesso[] = readJSON(path.join(__dirname, '..', '..', 'cache', 'provedor_pass.json'));
    const login = logins.find((element: ProvedorAcesso) => element.id === provedor);

    if (!login) {
        return null;
    }

    const baseUrl = `${login.dns}/player_api.php`;
    const commonParams = `username=${login.user}&password=${login.password}`;
    
    const actionParams: { [key: string]: string } = {
        epg: `action=get_short_epg&stream_id=${streamId}&limit=${limit}`,
        vod: `action=get_vod_info&vod_id=${streamId}`,
        series: `action=get_series_info&series_id=${streamId}`
    }

    return `${baseUrl}?${commonParams}&${actionParams[type]}`;
}
