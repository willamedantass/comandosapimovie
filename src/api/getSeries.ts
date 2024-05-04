import { createAndUpdateCache, createCache, readCache, readOption } from '../data/cacheDB';
import { getPopularSeries } from '../controller/getPopularSeries';
import { stringSimilatary } from '../util/stringSimilatary';
import { getAxiosResult } from '../util/getAxios';
import { readJSON } from '../util/jsonConverte';
import { Cache } from '../type/cache';
import path from "path";
require('dotenv/config');
let popularTheMovieDB: string[] | undefined;
let popularSeries: object[] = [];
let series: object[] = [];
let novelas: object[] = [];
let isLoading = false;
const series_popular = '10';

export const getSeries = async () => {
    const action = 'get_series';
    const actionNovelas = 'get_novelas';
    const actionPopular = 'get_series_popular';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();
    if (dataOld.getDay() !== dataNow.getDay()) {
        if(isLoading){
            return
        }
        isLoading = true;
        series = [];
        novelas = [];

        try {
            const logins = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json"));
            popularTheMovieDB = await getPopularSeries();
            for (const login of logins) {
                let res = await getAxiosResult(action, login.id);
                console.log(`Séries ${login.provedor}: ${res?.data.length}`);
                forEachSeries(res, login.id);
            }
    
            popularSeries.sort((a: any, b: any) => a.posicao - b.posicao);
            series.unshift(...popularSeries);
    
            console.log(`Séries Total: ${series.length}`)
            const used = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
    
            const cache: Cache = {
                data: new Date().toISOString(),
                action: action,
    
            }
            createAndUpdateCache(cache);
            createCache(actionNovelas, novelas);
            createCache(actionPopular, popularSeries);
            createCache(action, series)
            isLoading = false;
            return series;
        } catch (error) {
            isLoading = false;
            console.error(`Error ao processar biblioteca de séries: ${error}`);
        }
    } else {
        return readCache(action);
    }
}

const forEachSeries = (res: any, provedor: string) => {
    const category_novelas = readJSON(path.join(__dirname, "..", "..", "cache", "categories_novelas.json"));
    const idProvedoQueNaoModifica = process.env.ID_PROVEDOR_SERIES_SEM_MODIFICAR;
    if (res?.status == 200 && res?.data.length > 1 && Array.isArray(res.data)) {
        res.data.forEach(element => {
            if (element.category_id == "31755") {
                return console.log('achei');
            }
            if (category_novelas.find(category => category == (provedor + element.category_id))) {
                element.category_id = "9";
                novelas.push(element);
            } else if (idProvedoQueNaoModifica == provedor) {
                element.category_id = provedor + element.category_id;
            } else {
                const popular = (popularTheMovieDB !== undefined) ? stringSimilatary(element.name, popularTheMovieDB) : null;
                if (popular && (provedor === '2' || provedor === '6')) {
                    element.category_id = series_popular;
                    popularSeries.push({ ...element, posicao: popular });
                    return
                } else {
                    element.category_id = provedor;
                }
            }
            element.series_id = provedor + element.series_id;
            series.push(element);
        })
    }
}