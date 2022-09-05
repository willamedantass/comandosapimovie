import { createAndUpdateOption, createCache, readCache, readOption } from '../controller/cacheDBController';
import { Cache } from '../type/cache';
import { Provedor } from '../type/provedor';
import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getFilmsCategories = async (isAdult: boolean) => {

    const action = 'get_vod_categories';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();
    if (dataOld.getDay() !== dataNow.getDay()) {

        const res_clubtv = await getAxiosResult(action, Provedor.clubtv);
        const res_tigotv = await getAxiosResult(action, Provedor.tigotv);
        const res_elitetv = await getAxiosResult(action, Provedor.elitetv);

        let filmsCategories = [];
        forEachFilms(res_clubtv, filmsCategories, Provedor.clubtv, 'CLB', isAdult);
        forEachFilms(res_tigotv, filmsCategories, Provedor.tigotv, 'TGO', isAdult);
        forEachFilms(res_elitetv, filmsCategories, Provedor.elitetv, 'ELT', isAdult);
        if (isAdult) {
            const category_adult = { "category_id": "999999", "category_name": "XXX | Filmes ADULTOS", "parent_id": 0 };
            filmsCategories.push(category_adult)
        }
        const cache: Cache = {
            data: new Date().toISOString(),
            action: action,

        }
        createAndUpdateOption(cache);
        createCache(action, filmsCategories)
        return filmsCategories;
    } else {
        return readCache(action);
    }
}

const forEachFilms = (res, films, provedor: string, siglaProvedor: string, isAdult: boolean) => {
    const categories_adult = process.env.CATEGORIA_XXX_FILME.split(',');
    if (res?.status == 200 && res?.data.length > 1) {
        res.data.forEach(element => {
            if (categories_adult.find(category => category == element.category_id)) {
                return
            }
            if (element.category_name.includes('Filmes')) {
                element.category_name = element.category_name.replace('Filmes', siglaProvedor);
            } else {
                element.category_name = `${siglaProvedor} | ${element.category_name}`
            }
            element.category_id = provedor + element.category_id;
            films.push(element);
        });
    }
}
