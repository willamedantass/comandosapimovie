import { Provedor } from "../type/provedor";
import { getAxiosResult } from "../util/getAxios";
require('dotenv/config')

export const getMovieInfo = async (id) => {
    const provedorId = id.charAt(0);
    const movieId = id.substr(1);
    switch (provedorId) {
        case Provedor.mygotv:
            const res_mygotv = await getAxiosResult('get_vod_info',Provedor.mygotv,movieId);
            return setProvedorId(res_mygotv.data, Provedor.mygotv);
        case Provedor.clubtv:
            const res_clubtv = await getAxiosResult('get_vod_info',Provedor.clubtv,movieId);
            return setProvedorId(res_clubtv.data, Provedor.clubtv);
        case Provedor.tigotv:
            const res_tigotv = await getAxiosResult('get_vod_info',Provedor.tigotv,movieId);
            return setProvedorId(res_tigotv.data, Provedor.tigotv);
        case Provedor.elitetv:
            const res_elitetv = await getAxiosResult('get_vod_info',Provedor.elitetv,movieId);
            return setProvedorId(res_elitetv.data, Provedor.elitetv);
        default:
            break;
    }
}

const setProvedorId = (res, provedor:string) => {       
    let id = provedor + res["movie_data"].stream_id;
    res["movie_data"].stream_id = id;    
    return res;
}