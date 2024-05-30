import { getAxiosResult } from "../util/getAxios";
import { Result } from "../type/result";
import { generateUrl } from "../util/generateUrl";

export const getMediaInfo = async (id: string, type: 'series' | 'vod'): Promise<Result> => {
    let result: Result = { result: false, msg: "" };
    const providerId = id.charAt(0);
    const mediaId = id.substr(1);

    const action = type === 'series' ? 'get_series_info' : 'get_vod_info' 
    const res = await getAxiosResult(action, providerId, mediaId);

    if (res && res.status === 200) {
        if (type === 'series') {
            result.result = true;
            result.data = setProviderIdForSeries(res, providerId);
        } else if (type === 'vod') {
            result.result = true;
            result.data = setProviderIdForMovie(res, providerId);
        }
    } else {
        result.data = generateUrl(id, type);
    }

    return result;
}

const setProviderIdForSeries = (res: any, providerId: string) => {
    if (res.data.episodes) {
        Object.keys(res.data.episodes).forEach(key => {
            res.data.episodes[key].forEach((episode: any, index: number) => {
                const id = episode.id;
                res.data.episodes[key][index].id = `${providerId}${id}`;
            });
        });
        return res.data;
    }
}

const setProviderIdForMovie = (res: any, providerId: string) => {
    if (res.data?.movie_data?.stream_id) {
        const id = res.data.movie_data.stream_id;
        res.data.movie_data.stream_id = `${providerId}${id}`;
        return res.data;
    }
}