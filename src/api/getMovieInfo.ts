import { getAxiosResult } from "../util/getAxios";
require('dotenv/config')

export const getMovieInfo = async (id) => {
    const provedorId = id.charAt(0);
    const movieId = id.substr(1);

    const res = await getAxiosResult('get_vod_info', provedorId, movieId);
    return setProvedorId(res, provedorId);
}

const setProvedorId = (res, provedor:string) => {    
    if (res?.status == 200 && res.data["movie_data"]?.stream_id) {
        let id = provedor + res.data["movie_data"].stream_id;
        res.data["movie_data"].stream_id = id;    
        return res.data;
    }     
}