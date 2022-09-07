import { createAndUpdateOption, createCache, readCache, readOption } from '../controller/cacheDBController';
import { Cache } from '../type/cache';
import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getLiveCategories = async (isAdult: boolean) => {
    const provedor = process.env.PROVEDOR_LIVES_ID;
    const category_adult = process.env.CATEGORIA_XXX_LIVE;
    const action = 'get_live_categories';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();
    if (dataOld.getDay() !== dataNow.getDay()) {
        let categorias = [];
        const res = await getAxiosResult(action, provedor);
        if (res?.status == 200 && res?.data.length > 1) {
            res?.data.forEach(element => {
                let category_id = element.category_id;
                if (category_id === category_adult) {
                    if (!isAdult) {
                        return
                    }
                    element.category_id = "999999";
                    return categorias.push(element);
                }
                element.category_id = provedor + category_id;
                categorias.push(element);
            });
        }
        const cache: Cache = {
            data: new Date().toISOString(),
            action: action,
            
        }
        createAndUpdateOption(cache)
        createCache(action, categorias);
        return categorias;
    } else {
        return readCache(action);
    }
}
