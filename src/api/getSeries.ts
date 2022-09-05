import { createAndUpdateOption, createCache, readCache, readOption } from '../controller/cacheDBController';
import { getAxiosResult } from '../util/getAxios';
import { readJSON } from '../util/jsonConverte';
import { Provedor } from '../type/provedor';
import { Cache } from '../type/cache';
import path from "path";
require('dotenv/config')

export const getSeries = async () => {

    const action = 'get_series';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();
    if (dataOld.getDay() !== dataNow.getDay()) {
        const res_mygotv = await getAxiosResult(action, Provedor.mygotv);
        const res_clubtv = await getAxiosResult(action, Provedor.clubtv);
        const res_tigotv = await getAxiosResult(action, Provedor.tigotv);
        const res_elitetv = await getAxiosResult(action, Provedor.elitetv);

        console.log(`Séries MYGO: ${res_mygotv?.data.length}`);
        console.log(`Séries CLUB: ${res_clubtv?.data.length}`);
        console.log(`Séries TIGO: ${res_tigotv?.data.length}`);
        console.log(`Séries ELT: ${res_elitetv?.data.length}`);

        let series = [];
        forEachSeries(res_clubtv, series, Provedor.clubtv);
        forEachSeries(res_elitetv, series, Provedor.elitetv);
        forEachSeries(res_tigotv, series, Provedor.tigotv);
        forEachSeries(res_mygotv, series, Provedor.mygotv);

        console.log(`Séries Total: ${series.length}`)
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);

        const cache: Cache = {
            data: new Date().toISOString(),
            action: action,

        }
        createAndUpdateOption(cache);
        createCache(action, series)
        return series;
    } else {
        return readCache(action);
    }
}

const forEachSeries = (res, series, provedor: string) => {
    const category_novelas = readJSON(path.join(__dirname, "..", "..", "cache", "categories_novelas.json"));
    if (res?.status == 200 && res?.data.length > 1) {
        res.data.forEach(element => {
            if (element.category_id == "31755") {
                console.log('achei');

            }
            if (category_novelas.find(category => category == element.category_id)) {
                element.category_id = "9";
            } else if (Provedor.tigotv === provedor) {
                element.category_id = Provedor.tigotv + element.category_id;
            } else {
                element.category_id = provedor;
            }
            element.series_id = provedor + element.series_id;
            series.push(element);
        })
    }
}