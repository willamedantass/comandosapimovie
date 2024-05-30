import { createAndUpdateCache, createCache, readCache, readOption } from '../data/cacheDB';
import { getPopularMovies } from '../controller/getPopularMovies';
import { stringSimilatary } from '../util/stringSimilatary';
import { getAxiosResult } from '../util/getAxios';
import { readJSON } from '../util/jsonConverte';
import { Cache } from '../type/cache';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

interface Film {
    stream_id: string;
    category_id: string;
    title?: string;
    name?: string;
    posicao?: number;
}

const CATEGORY_TOP_POPULAR = '999989';
const CATEGORY_ADULT = '999999';
let isLoading = false;

export const getFilms = async (isAdult: boolean): Promise<object[]> => {
    const action = 'get_vod_streams';
    const actionPopular = 'get_vod_popular';
    const actionAdult = 'get_vods_adult';

    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();

    if (dataOld.getDay() === dataNow.getDay()) {
        const films = readCache(action);
        if (isAdult) {
            const filmsAdult = readCache(actionAdult);
            return films.concat(filmsAdult);
        }
        return films;
    }

    if (isLoading) return readCachedFilms(isAdult, action, actionAdult);

    isLoading = true;

    try {
        const provedores = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json"));
        const popularTheMovieDB = await getPopularMovies();

        const { films, popularMovies, filmsAdult } = await processFilms(provedores, popularTheMovieDB);

        if (films.length > 0) {
            films.unshift(...popularMovies);
            console.log(`Filmes Total: ${films.length}`);
            const usedMemory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
            console.log(`Processo finalizado uso aproximado: ${usedMemory} MB`);

            const cache: Cache = {
                data: new Date().toISOString(),
                action,
            };

            createAndUpdateCache(cache);
            createCache(action, films);
            createCache(actionPopular, popularMovies);
            createCache(actionAdult, filmsAdult);
        }

        isLoading = false;
        return isAdult ? films.concat(filmsAdult) : films;
    } catch (error) {
        isLoading = false;
        console.error(`Erro ao processar biblioteca de filmes: ${error}`);
        return readCachedFilms(isAdult, action, actionAdult);
    }
}

const processFilms = async (provedores: any[], popularTheMovieDB: string[]): Promise<{ films: Film[], popularMovies: Film[], filmsAdult: Film[] }> => {
    const films: Film[] = [];
    const popularMovies: Film[] = [];
    const filmsAdult: Film[] = [];

    const categoriesAdult = process.env.CATEGORIA_XXX_FILME?.split(',');

    for (const provedor of provedores) {
        const res = await getAxiosResult('get_vod_streams', provedor.id);
        console.log(`Filmes ${provedor.provedor}: ${res?.data.length}`);
        if (res?.status === 200 && Array.isArray(res.data)) {
            res.data.forEach((element: Film) => {
                if (categoriesAdult?.includes(element.category_id)) {
                    element.stream_id = provedor.id + element.stream_id;
                    element.category_id = CATEGORY_ADULT;
                    filmsAdult.push(element);
                } else {
                    element.stream_id = provedor.id + element.stream_id;
                    const title = element.title ?? element.name;
                    const popular = stringSimilatary(title || "", popularTheMovieDB);
                    if (popular && (provedor.id === '2' || provedor.id === '6')) {
                        element.category_id = CATEGORY_TOP_POPULAR;
                        popularMovies.push({ ...element, posicao: popular });
                    } else {
                        element.category_id = provedor.id + element.category_id;
                        films.push(element);
                    }
                }
            });
        }
    }

    popularMovies.sort((a, b) => (a.posicao! - b.posicao!));
    return { films, popularMovies, filmsAdult };
}

const readCachedFilms = (isAdult: boolean, action: string, actionAdult: string): object[] => {
    const films = readCache(action);
    if (isAdult) {
        const filmsAdult = readCache(actionAdult);
        return films.concat(filmsAdult);
    }
    return films;
}
