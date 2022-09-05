import { getAxiosResult } from "../util/getAxios";

export const getEpgShort = async (stream_id: string, limit: string) => {

    const id: string = stream_id.substring(1);
    const provedor: string = stream_id.charAt(0);

    const res = await getAxiosResult('get_short_epg', provedor, id,limit);
    if (res?.status == 200) {
        return res.data;
    }
    return {"epg_listings":[]};
}