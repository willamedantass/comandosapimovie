import { Provedor } from '../type/provedor';
import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getSeriesCategories = async () => {
    const result = await getAxiosResult('get_series_categories', Provedor.tigotv);    
    const getCategorias = [{ "category_id": Provedor.mygotv, "category_name": "MYGOSERIES", "parent_id": 0 }, { "category_id": Provedor.clubtv, "category_name": "CLUBSERIES", "parent_id": 0 }, { "category_id": Provedor.elitetv, "category_name": "ELITESERIES", "parent_id": 0 }];

    if (result?.status == 200 && result?.data.length > 1) {
        result?.data.forEach(element => {
            element.category_id = Provedor.tigotv + element.category_id;
            getCategorias.push(element);
        });
    }
    return getCategorias;
}
