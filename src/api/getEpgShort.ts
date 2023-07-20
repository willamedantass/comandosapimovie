import path from "path";
import { provedorAcesso } from "../type/provedor";
import { getAxiosResult } from "../util/getAxios";
import { readJSON } from "../util/jsonConverte";

export const getEpgShort = async (stream_id: string, limit: string) => {

    const id: string = stream_id.substring(1);
    const provedor: string = stream_id.charAt(0);

    const login: provedorAcesso = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json")).find(element => element.id === provedor);

    // const res = await getAxiosResult('get_short_epg', provedor, id,limit);
    // if (res?.status == 200) {
    //     return res.data;
    // }

    return `${login.dns}/player_api.php?username=${login.user}&password=${login.password}&action=get_short_epg&stream_id=${id}&limit=${limit}`;
}