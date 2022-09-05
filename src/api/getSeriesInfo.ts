import { getAxiosResult } from "../util/getAxios";
require('dotenv/config')

export const getSeriesInfo = async (idSeries) => {
    const provedorId = idSeries.charAt(0);
    const serieId = idSeries.substr(1);

    let res = await getAxiosResult('get_series_info', provedorId,serieId);
    return setProvedorId(res.data, provedorId);
}

const setProvedorId = (res, provedor: string) => {
    Object.keys(res.episodes).forEach(key => {
        const value = res.episodes[key];
        value.forEach((element, index) => {
            const id = res.episodes[key][index].id;
            res.episodes[key][index].id = `${provedor}${id}`;
        });
    });
    return res;
}