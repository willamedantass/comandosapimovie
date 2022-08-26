import { Provedor } from '../type/provedor';
import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getFilms = async () => {

    const res_clubtv = await getAxiosResult('get_vod_streams', Provedor.clubtv);
    const res_tigotv = await getAxiosResult('get_vod_streams', Provedor.tigotv);
    const res_elitetv = await getAxiosResult('get_vod_streams', Provedor.elitetv);

    console.log(`Filmes CLUBTV: ${res_clubtv?.data.length}`);
    console.log(`Filmes TIGOTV: ${res_tigotv?.data.length}`);
    console.log(`Filmes ELITETV: ${res_elitetv?.data.length}`);
    let filmsJson = [];
    if (res_clubtv?.status == 200 && res_clubtv?.data.length > 1) {
        res_clubtv.data.forEach(element => {
            element.stream_id = Provedor.clubtv + element.stream_id;
            element.category_id = Provedor.clubtv + element.category_id;
            filmsJson.push(element);
        })
    }
    if (res_tigotv?.status == 200 && res_tigotv?.data.length > 1) {
        res_tigotv.data.forEach(element => {
            element.stream_id = Provedor.tigotv + element.stream_id;
            element.category_id = Provedor.tigotv + element.category_id;
            filmsJson.push(element);
        })
    }
    if (res_elitetv?.status == 200 && res_elitetv?.data.length > 1) {
        res_elitetv.data.forEach(element => {
            element.stream_id = Provedor.elitetv + element.stream_id;
            element.category_id = Provedor.elitetv + element.category_id;
            filmsJson.push(element);
        })
    }
    console.log(`Filmes Total: ${filmsJson.length}`)
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
    return filmsJson;
}