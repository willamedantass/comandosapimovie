import { createAndUpdateOption, createCache, readCache, readOption } from '../controller/cacheDBController';
import { getAxiosResult } from '../util/getAxios';
import { readJSON } from '../util/jsonConverte';
import { Cache } from '../type/cache';
import path from "path";
require('dotenv/config')

export const getFilmsCategories = async (isAdult: boolean) => {

    const action = 'get_vod_categories';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();
    const category_adult = { "category_id": "999999", "category_name": "XXX | Filmes ADULTOS", "parent_id": 0 };
    if (dataOld.getDay() !== dataNow.getDay()) {

        const logins = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json"));
        const filmsCategories = [];
        for (const login of logins) {
            let res = await getAxiosResult(action, login.id);
            forEachFilms(res, filmsCategories, login.id, login.sigla, isAdult);
        }
        
        const cache: Cache = {
            data: new Date().toISOString(),
            action: action,

        }
        createAndUpdateOption(cache);
        createCache(action, filmsCategories)
    }
   
    if (isAdult) {
        const categories = await readCache(action);
        categories.push(category_adult);
        return categories;
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
