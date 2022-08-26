import { Provedor } from "../type/provedor";
import { getAxiosResult } from "../util/getAxios";

export const getEpgShort = async (stream_id: string) => {
    const res = await getAxiosResult('get_short_epg', Provedor.tigotv, undefined, undefined, undefined, stream_id);
    if (res?.status == 200) {
        return res.data;
    }
    return {"epg_listings":[]};
}