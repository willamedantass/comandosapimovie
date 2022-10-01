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
    let element_adult;
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
                    return element_adult = element;
                }
                element.category_id = provedor + category_id;
                categorias.push(element);
            });
        }
        //Para incluir algumas categorias do servidor club
        const category_club = ['2480','4','488','489','490','1110','2113','1048'];
        const provedor_club = '2';
        const res_club = await getAxiosResult(action, provedor_club);
        if (res_club?.status == 200 && res_club?.data.length > 1) {
            res_club?.data.forEach(element => {
                let category_id: string = element.category_id;
                if (category_club.includes(category_id)) {
                    element.category_id = provedor_club + category_id ;
                    element.category_name = element.category_name.replace('Canais', 'ClubTv');
                    categorias.push(element);
                }
            });
        }
        categorias.push(element_adult);
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
