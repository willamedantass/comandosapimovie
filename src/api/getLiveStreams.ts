import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getLiveStreams = async (isAdult: boolean) => {
    
    const provedor = process.env.PROVEDOR_LIVES_ENUM;
    const category_adult = process.env.CATEGORIA_XXX_LIVE;
    const res_tigotv = await getAxiosResult('get_live_streams',provedor);  
    let streamsJson = [];

    if (res_tigotv?.status == 200 && res_tigotv?.data.length > 1) {
        res_tigotv.data.forEach(element => {
            if(element.category_id === category_adult){
                if(!isAdult){
                    return
                }
                element.category_id = "999999";
            }else{
                element.category_id = provedor + element.category_id;
            }
            element.stream_id = provedor + element.stream_id;
            streamsJson.push(element);
        })
    }

    console.log(`Canais Total: ${streamsJson.length}`)
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
    return streamsJson;
}