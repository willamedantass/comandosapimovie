import { createAndUpdateCache, createCache, readCache, readOption } from '../controller/cacheDBController';
import { Cache } from '../type/cache';
import { getAxiosResult } from '../util/getAxios';
import { readJSON } from '../util/jsonConverte';
import path from 'path';
require('dotenv/config')

export const getFilms = async (isAdult: boolean) => {

    const action = 'get_vod_streams';
    const actionAdult = 'get_vods_adult';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();
    if (dataOld.getDay() !== dataNow.getDay()) {

        const logins = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json"));
        let films = [];
        let filmsAdult = [];
        for (const login of logins) {
            let res = await getAxiosResult(action, login.id);
            console.log(`Filmes ${login.provedor}: ${res?.data.length}`);
            forEachFilms(res, films, filmsAdult, login.id);
        }

        console.log(`Filmes Total: ${films.length}`)
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
        const cache: Cache = {
            data: new Date().toISOString(),
            action: action,

        }
        createAndUpdateCache(cache);
        createCache(action, films);
        createCache(actionAdult, filmsAdult);
        if(isAdult){
            return films.concat(filmsAdult)
        }
        return films;
    } else {
        const films = await readCache(action);
        if(isAdult){
            const filmsAdult = await readCache(actionAdult);
            return films.concat(filmsAdult);
        }
        return films;
    }
}

const forEachFilms = (res, films, filmsAdult, provedor: string) => {
    const categories_adult = process.env.CATEGORIA_XXX_FILME.split(',');
    if (res?.status == 200 && res?.data.length > 1) {
        res.data.forEach(element => {
            if (categories_adult.find(category => category == element.category_id)) {
                element.stream_id = provedor + element.stream_id;
                element.category_id = "999999";
                filmsAdult.push(element);
            } else {
                element.stream_id = provedor + element.stream_id;
                element.category_id = provedor + element.category_id;
                films.push(element);
            }
        })
    }
}