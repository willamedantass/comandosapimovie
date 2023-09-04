import { createAndUpdateCache, createCache, readCache, readOption } from '../data/cacheDB';
import { getAxiosResult } from '../util/getAxios';
// import { readJSON } from '../util/jsonConverte';
import { Cache } from '../type/cache';
// import path from 'path';
require('dotenv/config')

export const getLiveCategories = async (isAdult: boolean, isClubtv: boolean) => {

    let categorias: any[];
    const action_clubtv = 'get_live_categories_clubtv';
    const action = 'get_live_categories';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();
    const element_adult = { "category_id": "999999", "category_name": "CANAIS | CANAIS ADULTO", "parent_id": 0 };
    if (dataOld.getDay() !== dataNow.getDay()) {
        const element_channel_clubtv = { "category_id": "999990", "category_name": "CLUBTV | FHD/HD", "parent_id": 0 };
        let provedor = process.env.PROVEDOR_LIVES_ID as string;
        const category_adult = process.env.CATEGORIA_XXX_LIVE;
        categorias = [];
        // const live_categorias = readJSON(path.join(__dirname, "..", "..", "cache", "live_categorias.json"));
        let res = await getAxiosResult(action, provedor); //{status: 200, data: live_categorias}
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
        categorias.push(element_channel_clubtv);

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

        let cache: Cache = {
            data: new Date().toISOString(),
            action: action,
        }
        createAndUpdateCache(cache)
        createCache(action, categorias);


        //***listando os canais da clubtv***
        categorias = [];

        res = await getAxiosResult(action, '2');
        if (res?.status == 200 && res?.data.length > 1) {
            res?.data.forEach(element => {
                const category_id = element.category_id;
                if (category_id === '12') {
                    return
                }
                element.category_id = '2' + category_id;
                categorias.push(element);
            });
        }

        cache = {
            data: new Date().toISOString(),
            action: action,
        }
        createAndUpdateCache(cache)
        createCache(action_clubtv, categorias);

    }

    categorias = [];
    if (isClubtv) {
        categorias = categorias.concat(await readCache(action_clubtv));
    } else {
        categorias = categorias.concat(await readCache(action));
    }

    if (isAdult) {
        categorias.push(element_adult);
    }
    return categorias;
}
