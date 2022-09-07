import { createAndUpdateOption, createCache, readCache, readOption } from '../controller/cacheDBController';
import { Cache } from '../type/cache';
import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getLiveStreams = async (isAdult: boolean) => {

    const action = 'get_live_streams';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();
    if (dataOld.getDay() !== dataNow.getDay()) {

        const provedor = process.env.PROVEDOR_LIVES_ID;
        const category_adult = process.env.CATEGORIA_XXX_LIVE;
        const res = await getAxiosResult(action, provedor);
        let streamsJson = [];
        if (res?.status == 200 && res?.data.length > 1) {
            res.data.forEach(element => {
                if (element.category_id === category_adult) {
                    if (!isAdult) {
                        return
                    }
                    element.category_id = "999999";
                } else {
                    element.category_id = provedor + element.category_id;
                }
                element.stream_id = provedor + element.stream_id;
                streamsJson.push(element);
            })
        }

        console.log(`Canais Total: ${streamsJson.length}`)
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
        
        const cache: Cache = {
            data: new Date().toISOString(),
            action: action,
            
        }
        createAndUpdateOption(cache);
        createCache(action, streamsJson)
        return streamsJson;
    } else {
        return readCache(action);
    }
}