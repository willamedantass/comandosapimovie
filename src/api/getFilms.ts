import { getPopularMovies } from '../controller/getPopularMovies';
import { createAndUpdateCache, createCache, readCache, readOption } from '../data/cacheDB';
import { Cache } from '../type/cache';
import { getAxiosResult } from '../util/getAxios';
import { readJSON } from '../util/jsonConverte';
import path from 'path';
import { stringSimilatary } from '../util/stringSimilatary';
require('dotenv/config');
let popularTheMovieDB: string[] | undefined;
let popularMovies: object[] = [];
let filmsAdult: object[] = [];
let films: object[] = [];
const categoria_top_popular: string = '999989';
const categoria_adulto: string = '999999';
let isLoading = false;

export const getFilms = async (isAdult: boolean) => {

    const action = 'get_vod_streams';
    const actionPopular = 'get_vod_popular';
    const actionAdult = 'get_vods_adult';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();

    if (dataOld.getDay() !== dataNow.getDay()) {
        if(isLoading){
            return
        }
        isLoading = true;
        popularTheMovieDB = [];
        popularMovies = [];
        filmsAdult = []
        films = [];

        try {
            const provedores = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json"));
            popularTheMovieDB = await getPopularMovies();
            for (const provedor of provedores) {
                let res = await getAxiosResult(action, provedor.id);
                console.log(`Filmes ${provedor.provedor}: ${res?.data.length}`);
                forEachFilms(res, provedor.id);
            }

            popularMovies.sort((a: any, b: any) => a.posicao - b.posicao);
            films.unshift(...popularMovies);
    
            console.log(`Filmes Total: ${films.length}`)
            const used = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
            const cache: Cache = {
                data: new Date().toISOString(),
                action: action,
            }

            createAndUpdateCache(cache);
            createCache(action, films);
            createCache(actionPopular, popularMovies);
            createCache(actionAdult, filmsAdult);
            if (isAdult) {
                return films.concat(filmsAdult)
            }
            isLoading = false;
            return films;
        } catch (error) {
            isLoading = false;
            console.error(`Error ao processar biblioteca de filmes: ${error}`);
        }
    } else {
        const films = await readCache(action);
        if (isAdult) {
            const filmsAdult = await readCache(actionAdult);
            return films.concat(filmsAdult);
        }
        return films;
    }
}

const forEachFilms = (res: any, provedor: string) => {
    const categories_adult = process.env.CATEGORIA_XXX_FILME?.split(',');
    if (res?.status == 200 && res?.data.length > 1) {
        res.data.forEach(element => {
            if (categories_adult?.find(category => category == element.category_id)) {
                element.stream_id = provedor + element.stream_id;
                element.category_id = categoria_adulto;
                filmsAdult.push(element);
            } else {
                element.stream_id = provedor + element.stream_id;
                const title = element.title ? element.title : element.name;
                const popular = (popularTheMovieDB !== undefined) ? stringSimilatary(title, popularTheMovieDB) : null;                
                if (popular && (provedor === '2' || provedor === '6')) {
                    element.category_id = categoria_top_popular;
                    popularMovies.push({ ...element, posicao: popular });
                } else {
                    element.category_id = provedor + element.category_id;
                    films.push(element);
                }
            }
        })
    }
}