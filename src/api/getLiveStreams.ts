import { createAndUpdateOption, createCache, readCache, readOption } from '../controller/cacheDBController';
import { Cache } from '../type/cache';
import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getLiveStreams = async (isAdult: boolean) => {

    const action = 'get_live_streams';
    const actionAdult = 'get_live_adult';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();
    if (dataOld.getDay() !== dataNow.getDay()) {

        const provedor = process.env.PROVEDOR_LIVES_ID;
        const category_adult = process.env.CATEGORIA_XXX_LIVE;
        const res = await getAxiosResult(action, provedor);
        let streamsJson = [];
        let streamsAdult = [];
        if (res?.status == 200 && res?.data.length > 1) {
            res.data.forEach(element => {
                if (element.category_id === category_adult) {
                    element.category_id = "999999";
                    element.stream_id = provedor + element.stream_id;
                    streamsAdult.push(element)
                } else {
                    element.category_id = provedor + element.category_id;
                    element.stream_id = provedor + element.stream_id;
                    streamsJson.push(element);
                }
            })
        }

        //Para incluir algumas categorias do servidor club
        const category_club = ['2480','4','488','489','490','1110','2113','1048'];
        const provedor_club = '2';
        const res_club = await getAxiosResult(action, provedor_club);
        if (res_club?.status == 200 && res_club?.data.length > 1) {
            res_club?.data.forEach(element => {
                let category_id: string = element.category_id;
                if (category_club.includes(category_id)) {
                    element.category_id = provedor_club + element.category_id;
                    element.stream_id = provedor_club + element.stream_id;
                    streamsJson.push(element);
                }
            });
        }

        console.log(`Canais Total: ${streamsJson.length}`)
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
        
        const cache: Cache = {
            data: new Date().toISOString(),
            action: action,
            
        }
        createAndUpdateOption(cache);
        createCache(action, streamsJson);
        createCache(actionAdult, streamsAdult);
        if(isAdult){
            return streamsJson.concat(streamsAdult);
        }
        return streamsJson;
    } else {
        const lives = await readCache(action);
        if(isAdult){
            const livesAdult = await readCache(actionAdult);
            return lives.concat(livesAdult);
        }
        return lives;
    }
}