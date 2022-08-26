import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getFilmsCategoryId = async (category_id: string) => {

    const id: string = category_id.substring(1);
    const provedor: string = category_id.charAt(0);

    const res = await getAxiosResult('get_vod_streams', provedor,undefined,undefined,id);
   
    let filmsJson = [];
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