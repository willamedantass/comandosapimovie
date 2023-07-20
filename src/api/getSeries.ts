import { createAndUpdateCache, createCache, readCache, readOption } from '../data/cacheDB';
import { getAxiosResult } from '../util/getAxios';
import { readJSON } from '../util/jsonConverte';
import { Cache } from '../type/cache';
import path from "path";
require('dotenv/config');

export const getSeries = async () => {

    const action = 'get_series';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();
    if (dataOld.getDay() !== dataNow.getDay()) {

        const logins = readJSON(path.join(__dirname, "..", "..", "cache", "provedor_pass.json"));
        let series = [];
        let novelas = [];
        for(const login of logins){
            let res = await getAxiosResult(action, login.id);
            console.log(`Séries ${login.provedor}: ${res?.data.length}`);
            forEachSeries(res, series, novelas, login.id);
        }
        
        console.log(`Séries Total: ${series.length}`)
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);

        const cache: Cache = {
            data: new Date().toISOString(),
            action: action,

        }
        createAndUpdateCache(cache);
        createCache('get_novelas', novelas);
        createCache(action, series)
        return series;
    } else {
        return readCache(action);
    }
}

const forEachSeries = (res, series, novelas, provedor: string) => {
    require('dotenv/config')
    const category_novelas = readJSON(path.join(__dirname, "..", "..", "cache", "categories_novelas.json"));
    const idProvedoQueNaoModifica = process.env.ID_PROVEDOR_SERIES_SEM_MODIFICAR;
    if (res?.status == 200 && res?.data.length > 1) {
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
                element.category_id = provedor;
            }
            element.series_id = provedor + element.series_id;
            series.push(element);
        })
    }
}