import { Provedor } from '../type/provedor';
import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getLiveCategoryId = async (category_id: string) => {

    const id: string = category_id.substring(1);
    const provedor: string = category_id.charAt(0);
    const res = await getAxiosResult('get_live_streams', provedor,id);  
    let streamsJson = [];

    console.log(`Canais Categoria: ${res?.data.length}`);
    if (res?.status == 200 && res?.data.length > 1) {
        res.data.forEach(element => {
            element.stream_id = provedor + element.stream_id;
            streamsJson.push(element);
        })
    }

    console.log(`Canais Total: ${streamsJson.length}`)
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
    return streamsJson;
}