import { Provedor } from "../type/provedor";
import { getAxiosResult } from "../util/getAxios";
require('dotenv/config')

export const getSeriesInfo = async (idSeries) => {
    const provedorId = idSeries.charAt(0);
    const serieId = idSeries.substr(1);
    switch (provedorId) {
        case Provedor.mygotv:
            let res_mygotv = await getAxiosResult('get_series_info',Provedor.mygotv,undefined,serieId);
            if (res_mygotv) {
                return setProvedorId(res_mygotv.data, Provedor.mygotv);
            }
            console.log('Erro ao carregar series info mygo!');
        case Provedor.clubtv:
            let res_clubtv = await getAxiosResult('get_series_info',Provedor.clubtv,undefined,serieId);
            if (res_clubtv) {
                return setProvedorId(res_clubtv.data, Provedor.clubtv);
            }
            console.log('Erro ao carregar series info clubtv!');
        case Provedor.tigotv:
            let res_tigotv = await getAxiosResult('get_series_info',Provedor.tigotv,undefined,serieId);
            if (res_tigotv) {
                return setProvedorId(res_tigotv.data, Provedor.tigotv);
            }
            console.log('Erro ao carregar series info tigo!');
        case Provedor.elitetv:
            let res_elitetv = await getAxiosResult('get_series_info',Provedor.elitetv,undefined,serieId);
            if (res_elitetv) {
                return setProvedorId(res_elitetv.data, Provedor.elitetv);
            }
            console.log('Erro ao carregar series info elite!');
        default:
            break;
    }
}

const setProvedorId = (res, provedor) => {
    Object.keys(res.episodes).forEach(key => {
        const value = res.episodes[key];
        value.forEach((element, index) => {
            const id = res.episodes[key][index].id;
            res.episodes[key][index].id = `${provedor}${id}`;
        });
    });
    return res;
}