import { getAxiosResult } from "../util/getAxios";
require('dotenv/config')

export const getSeriesInfo = async (idSeries) => {
    const provedorId = idSeries.charAt(0);
    const serieId = idSeries.substr(1);

    let res = await getAxiosResult('get_series_info', provedorId, serieId);
    return setProvedorId(res, provedorId);
}

const setProvedorId = (res, provedor: string) => {
    if (res && res.data.episodes) {
        Object.keys(res.data.episodes).forEach(key => {
            const value = res.data.episodes[key];
            value.forEach((_, index) => {
                const id = res.data.episodes[key][index].id;
                res.data.episodes[key][index].id = `${provedor}${id}`;
            });
        });
        return res.data;
    }
}