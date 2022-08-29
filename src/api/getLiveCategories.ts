import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getLiveCategories = async (isAdult: boolean) => {

    const provedor = process.env.PROVEDOR_LIVES_ENUM;
    const category_adult = process.env.CATEGORIA_XXX_LIVE;
    const res = await getAxiosResult('get_live_categories', provedor);
    let getCategorias = [];

    if (res?.status == 200 && res?.data.length > 1) {
        res?.data.forEach(element => {
            let category_id = element.category_id;
            if (category_id === category_adult) {
                if(!isAdult){
                    return
                }
                element.category_id = "999999";
                return getCategorias.push(element);
            }
            element.category_id = provedor + category_id;
            getCategorias.push(element);
        });
    }
    return getCategorias;
}
