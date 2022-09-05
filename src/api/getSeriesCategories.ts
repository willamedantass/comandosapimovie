import { readJSON } from '../function';
import { Provedor } from '../type/provedor';
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
        const result = await getAxiosResult(action, Provedor.tigotv);
        const res_club = await getAxiosResult(action, Provedor.clubtv);
        const categorias = [{ "category_id": Provedor.mygotv, "category_name": "MYGOSERIES", "parent_id": 0 }, { "category_id": Provedor.clubtv, "category_name": "CLUBSERIES", "parent_id": 0 }, { "category_id": Provedor.elitetv, "category_name": "ELITESERIES", "parent_id": 0 }, { "category_id": "9", "category_name": "NOVELAS", "parent_id": 0 }];
        let category_novelas = []

        if (result?.status == 200 && result?.data.length > 1) {
            result?.data.forEach(element => {
                const name: string = element.category_name.toLowerCase();
                if (name.includes("novela") || name.includes("novelas")) {
                    category_novelas.push(element.category_id)
                    return
                }
                element.category_id = Provedor.tigotv + element.category_id;
                categorias.push(element);
            });
        }

        if (res_club?.status == 200 && res_club?.data.length > 1) {
            res_club?.data.forEach(element => {
                const name: string = element.category_name.toLowerCase();
                if (name.includes("novela") || name.includes("novelas")) {
                    category_novelas.push(element.category_id);
                }
            });
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
