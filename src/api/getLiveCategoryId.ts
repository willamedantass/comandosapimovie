import { getAxiosResult } from '../util/getAxios';
import { readJSON } from '../util/jsonConverte';
import path from 'path';
require('dotenv/config')

export const getLiveCategoryId = async (category_id: string) => {

    const id: string = category_id.substring(1);
    const provedor: string = category_id.charAt(0);
    
    if(id === '99990'){
        return readJSON(path.join(__dirname, "..", "..", "cache", "get_live_clubtv.json"));
    }
    
    if(provedor === '9'){
        return readJSON(path.join(__dirname, "..", "..", "cache", "get_live_adult.json"));
    }
    
    let live_categorias;
    if(provedor === '5'){
        live_categorias = readJSON(path.join(__dirname, "..", "..", "cache", "get_live_streams.json")); //await getAxiosResult('get_live_streams', provedor,id);  
    }

    if(provedor === '2'){
        live_categorias = readJSON(path.join(__dirname, "..", "..", "cache", "get_live_clubtv.json")); //await getAxiosResult('get_live_streams', provedor,id);  
    }

    let streamsJson: any[] = [];
    let res = {status: 200, data: live_categorias} 
    if (res?.status == 200 && res?.data.length > 1) {
        res.data.forEach(element => {
            if(category_id == element.category_id){
                streamsJson.push(element);
                element.stream_id = element.stream_id; //provedor + element.stream_id;
            }
        })
    }

    return streamsJson;
}