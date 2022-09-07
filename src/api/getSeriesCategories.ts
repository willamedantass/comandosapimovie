import { readJSON } from '../function';
import { getAxiosResult } from '../util/getAxios';
import path from "path";
import { writeJSON } from '../util/jsonConverte';
import { createAndUpdateOption, createCache, readCache, readOption } from '../controller/cacheDBController';
import { Cache } from '../type/cache';
require('dotenv/config')

export const getSeriesCategories = async () => {

    const action = 'get_series_categories';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();
    if (dataOld.getDay() !== dataNow.getDay()) {

        const logins = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json"));
        let categorias = [];
        categorias.push({ "category_id": "9", "category_name": "NOVELAS", "parent_id": 0 });
        let category_novelas = []
        for(const login of logins){
            let res = await getAxiosResult(action, login.id);
            forEachCategories(res,categorias, category_novelas,login.id);
            categorias.push({ "category_id": login.id, "category_name": `${login.sigla}SERIES`, "parent_id": 0 })
        }
        
        writeJSON(path.join(__dirname, "..", "..", "cache", "categories_novelas.json"), category_novelas);
        
        const cache: Cache = {
            data: new Date().toISOString(),
            action: action,
            
        }
        createAndUpdateOption(cache);
        createCache(action, categorias)
        return categorias;
    } else {
        return readCache(action);
    }
}

const forEachCategories = (res, categorias, category_novelas, provedor: string) => {
    require('dotenv/config');
    const idProvedoQueNaoModifica = process.env.ID_PROVEDOR_SERIES_SEM_MODIFICAR;
    if (res?.status == 200 && res?.data.length > 1) {
        res?.data.forEach(element => {
            const name: string = element.category_name.toLowerCase();
            if (name.includes("novela") || name.includes("novelas")) {
                category_novelas.push(provedor + element.category_id)
            }
            if (idProvedoQueNaoModifica == provedor) {
                element.category_id = provedor + element.category_id;
                categorias.push(element);
            }
        });
    }

}