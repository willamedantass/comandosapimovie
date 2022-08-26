import { readJSON } from '../util/jsonConverte';
import axios from 'axios';
import path from 'path';
import { Provedor } from '../type/provedor';
import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getSeries = async () => {
    const res_clubtv = await getAxiosResult('get_series', Provedor.clubtv);
    const res_tigotv = await getAxiosResult('get_series', Provedor.tigotv);
    const res_mygotv = await getAxiosResult('get_series', Provedor.mygotv);
    const res_elitetv = await getAxiosResult('get_series', Provedor.elitetv);
   
    console.log(`Séries MYGO: ${res_mygotv?.data.length}`);
    console.log(`Séries CLUB: ${res_clubtv?.data.length}`);
    console.log(`Séries TIGO: ${res_tigotv?.data.length}`);
    console.log(`Séries ELT: ${res_elitetv?.data.length}`);
    let series=[];
    
    forEachSeries(res_clubtv, series, Provedor.clubtv);
    forEachSeries(res_elitetv, series, Provedor.elitetv);
    forEachSeries(res_mygotv, series, Provedor.elitetv);

    if (res_tigotv?.status == 200 && res_tigotv?.data.length > 1) {
        res_tigotv.data.forEach(element => {
            element.series_id =  Provedor.tigotv + element.series_id
            element.category_id = Provedor.tigotv + element.category_id;
            series.push(element);
        })
    }

    console.log(`Séries Total: ${series.length}`)
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
    return series;
}

const forEachSeries = (res, series, provedor: string) => {
    if (res?.status == 200 && res?.data.length > 1) {
        res.data.forEach(element => {
            element.series_id =  provedor + element.series_id;
            element.category_id = provedor;
            series.push(element);
        })
    }
}