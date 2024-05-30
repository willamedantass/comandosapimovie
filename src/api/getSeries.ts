import { createAndUpdateCache, createCache, readCache, readOption } from '../data/cacheDB';
import { getPopularSeries } from '../controller/getPopularSeries';
import { stringSimilatary } from '../util/stringSimilatary';
import { getAxiosResult } from '../util/getAxios';
import { readJSON } from '../util/jsonConverte';
import { Cache } from '../type/cache';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

interface Series {
    series_id: string;
    category_id: string;
    name: string;
    posicao?: number;
    [key: string]: any;
}

let popularTheMovieDB: string[] | undefined;
let isLoading = false;
const seriesPopularCategory = '10';

export const getSeries = async (): Promise<Series[]> => {
    const action = 'get_series';
    const actionNovelas = 'get_novelas';
    const actionPopular = 'get_series_popular';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();

    if (dataOld.getDay() !== dataNow.getDay()) {
        if (isLoading) return [];

        isLoading = true;
        try {
            await updateSeriesCache(action, actionNovelas, actionPopular);
        } catch (error) {
            console.error(`Error ao processar biblioteca de séries: ${error}`);
        } finally {
            isLoading = false;
        }
    }
    return readCache(action);
}

const updateSeriesCache = async (action: string, actionNovelas: string, actionPopular: string) => {
    const logins = readJSON(path.join(__dirname, '..', '..', 'cache', 'provedor_pass.json'));
    popularTheMovieDB = await getPopularSeries();
    let series: Series[] = [];
    let novelas: Series[] = [];
    let popularSeries: Series[] = [];

    for (const login of logins) {
        const res = await getAxiosResult(action, login.id);
        console.log(`Séries ${login.provedor}: ${res?.data.length}`);
        processSeries(res, login.id, series, novelas, popularSeries);
    }


    if (series.length > 0) {
        popularSeries.sort((a, b) => (a.posicao! - b.posicao!));
        series.unshift(...popularSeries);
        const cache: Cache = {
            data: new Date().toISOString(),
            action: action,
        };
        createAndUpdateCache(cache);
        createCache(actionNovelas, novelas);
        createCache(actionPopular, popularSeries);
        createCache(action, series);
    }

    console.log(`Séries Total: ${series.length}`);
    const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Processo finalizado. Uso de memória aproximado: ${Math.round(usedMemory * 100) / 100} MB`);
}

const processSeries = (res: any, providerId: string, series: Series[], novelas: Series[], popularSeries: Series[]) => {
    const categoryNovelas = readJSON(path.join(__dirname, '..', '..', 'cache', 'categories_novelas.json'));
    const providerIdNoModify = process.env.ID_PROVEDOR_SERIES_SEM_MODIFICAR;

    if (res?.status === 200 && Array.isArray(res.data)) {
        res.data.forEach((element: Series) => {
            if (element.category_id === '31755') {
                return console.log('achei');
            }

            const popular = popularTheMovieDB ? stringSimilatary(element.name, popularTheMovieDB) : null;
            if (popular && (providerId === '2' || providerId === '6')) {
                element.category_id = seriesPopularCategory;
                element.series_id = providerId + element.series_id;
                popularSeries.push({ ...element, posicao: popular });
                return
            }

            if (categoryNovelas.includes(providerId + element.category_id)) {
                element.category_id = '9';
                novelas.push(element);
            } else if (providerId === providerIdNoModify) {
                element.category_id = providerId + element.category_id;
            } else {
                element.category_id = providerId;
            }
            element.series_id = providerId + element.series_id;
            series.push(element);
        });
    }
}
