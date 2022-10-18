import { getAxiosResult } from '../util/getAxios';
import { readJSON } from '../util/jsonConverte';
import path from 'path';
require('dotenv/config')

export const getLiveCategoryId = async (category_id: string) => {

    const id: string = category_id.substring(1);
    const provedor: string = category_id.charAt(0);
    
    if(id === '999990'){
        return readJSON(path.join(__dirname, "..", "..", "cache", "get_live_clubtv.json"));
    }
    
    if(provedor === '9'){
        return readJSON(path.join(__dirname, "..", "..", "cache", "get_live_adult.json"));
    }
    
    const res = await getAxiosResult('get_live_streams', provedor,id);  
    let streamsJson = [];
    console.log(`Canais Categoria: ${res?.data.length}`);
    if (res?.status == 200 && res?.data.length > 1) {
        res.data.forEach(element => {
            element.stream_id = provedor + element.stream_id;
            streamsJson.push(element);
        })
    }

    return streamsJson;
}