import { Provedor } from '../type/provedor';
import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getFilmsCategories = async (isAdult: boolean) => {
    const res_clubtv = await getAxiosResult('get_vod_categories', Provedor.clubtv);
    const res_tigotv = await getAxiosResult('get_vod_categories', Provedor.tigotv);
    const res_elitetv = await getAxiosResult('get_vod_categories', Provedor.elitetv);
    
    let filmsCategories = [];
    forEachFilms(res_clubtv, filmsCategories, Provedor.clubtv, 'CLB', isAdult);
    forEachFilms(res_tigotv, filmsCategories, Provedor.tigotv, 'TGO', isAdult);
    forEachFilms(res_elitetv, filmsCategories, Provedor.elitetv, 'ELT', isAdult);
    if(isAdult){
        const category_adult = {"category_id":"999999","category_name":"XXX | Filmes ADULTOS","parent_id":0};
        filmsCategories.push(category_adult)
    }
    
    return filmsCategories;
}

const forEachFilms = (res, films, provedor: string, siglaProvedor: string, isAdult: boolean) => {
    const categories_adult = process.env.CATEGORIA_XXX_FILME.split(',');
    if (res?.status == 200 && res?.data.length > 1) {
        res.data.forEach(element => {
            if(categories_adult.find(category => category == element.category_id)){
                return
            }
            element.category_id = provedor + element.category_id;
            element.category_name = element.category_name.replace('Filmes','Filmes '+ siglaProvedor);
            films.push(element);
        });
    }
}
