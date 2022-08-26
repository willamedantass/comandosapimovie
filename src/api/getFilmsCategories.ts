import { Provedor } from '../type/provedor';
import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getFilmsCategories = async () => {
    const res_clubtv = await getAxiosResult('get_vod_categories', Provedor.clubtv);
    const res_tigotv = await getAxiosResult('get_vod_categories', Provedor.tigotv);
    const res_elitetv = await getAxiosResult('get_vod_categories', Provedor.elitetv);
    let getCategorias = [];
    if (res_clubtv?.status == 200) {
        res_clubtv.data.forEach(element => {
            element.category_id = Provedor.clubtv + element.category_id;
            element.category_name = element.category_name.replace('Filmes', 'Filmes CLB');
            getCategorias.push(element);
        });
    }
    if (res_tigotv?.status == 200) {
        res_tigotv.data.forEach(element => {
            element.category_id = Provedor.tigotv + element.category_id;
            element.category_name = element.category_name.replace('Filmes', 'Filmes TGO');
            getCategorias.push(element);
        });
    }
    if (res_elitetv?.status == 200) {
        res_elitetv.data.forEach(element => {
            element.category_id = Provedor.elitetv + element.category_id;
            element.category_name = 'Filmes ELT | ' + element.category_name;
            getCategorias.push(element);
        });
    }
    return getCategorias;
}
