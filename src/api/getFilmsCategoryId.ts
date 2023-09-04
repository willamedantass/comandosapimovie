import { getAxiosResult } from '../util/getAxios';
import { readJSON } from '../util/jsonConverte';
import path from 'path';

export const getFilmsCategoryId = async (category_id: string) => {

    const id: string = category_id.substring(1);
    const provedor: string = category_id.charAt(0);

    if(provedor === '999989'){
        return readJSON(path.join(__dirname, "..", "..", "cache", "get_vod_popular.json"));
    }

    if(category_id === '999999'){
        return readJSON(path.join(__dirname, "..", "..", "cache", "get_vods_adult.json"));
    }

    const res = await getAxiosResult('get_vod_streams', provedor,id);
    let filmsJson: any[] = [];
    if (res?.status == 200 && res?.data.length > 1) {
        res.data.forEach(element => {
            element.stream_id = provedor + element.stream_id;
            element.category_id = provedor + element.category_id;
            filmsJson.push(element);
        })
    }
    console.log(`Filmes Total: ${filmsJson.length}`)
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
    return filmsJson;
}