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
    const element_adult = { "category_id": "999999", "category_name": "CANAIS | CANAIS ADULTO", "parent_id": 0 };
    const element_Channel_clubtv = { "category_id": "999990", "category_name": "CLUBTV | FHD/HD", "parent_id": 0 };
    if (dataOld.getDay() !== dataNow.getDay()) {
        const categorias = [];
        const res = await getAxiosResult(action, provedor);
        if (res?.status == 200 && res?.data.length > 1) {
            res?.data.forEach(element => {
                const category_id = element.category_id;
                if (category_id === category_adult) {
                    return
                }
                element.category_id = provedor + category_id;
                categorias.push(element);
            });
        }

        //Incluindo categoria FHD/HD do servidor club
        categorias.push(element_Channel_clubtv);

        //Para incluir algumas categorias do servidor club
        const category_club = ['2480', '4', '42', '488', '489', '490', '1110', '2113', '1048'];
        const provedor_club = '2';
        const res_club = await getAxiosResult(action, provedor_club);
        if (res_club?.status == 200 && res_club?.data.length > 1) {
            res_club?.data.forEach(element => {
                let category_id: string = element.category_id;
                if (category_club.includes(category_id)) {
                    element.category_id = provedor_club + category_id;
                    element.category_name = element.category_name.replace('Canais', 'ClubTv');
                    categorias.push(element);
                }
            });
        }

        const cache: Cache = {
            data: new Date().toISOString(),
            action: action,
        }
        createAndUpdateOption(cache)
        createCache(action, categorias);
    }

    if (isAdult) {
        const categorias = await readCache(action);
        categorias.push(element_adult);
        return categorias;

    } else {
        return readCache(action);
    }
}
