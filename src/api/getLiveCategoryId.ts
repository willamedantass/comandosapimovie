import { Provedor } from '../type/provedor';
import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getLiveCategoryId = async (category_id: string) => {

    const res_tigotv = await getAxiosResult('get_live_streams', Provedor.tigotv,undefined,undefined,category_id);  
    let streamsJson = [];

    console.log(`Canais Categoria: ${res_tigotv?.data.length}`);
    if (res_tigotv?.status == 200 && res_tigotv?.data.length > 1) {
        res_tigotv.data.forEach(element => {
            const id = Provedor.tigotv + element.stream_id;
            element.stream_id = id;
            streamsJson.push(element);
        })
    }

    console.log(`Canais Total: ${streamsJson.length}`)
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
    return streamsJson;
}