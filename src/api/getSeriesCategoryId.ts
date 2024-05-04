import { getAxiosResult } from '../util/getAxios';
import path from "path";
import { readJSON } from '../util/jsonConverte';
require('dotenv/config')

export const getSeriesCategoryId = async (category_id: string) => {

    const id: string = category_id.substring(1);
    const provedor: string = category_id.charAt(0);
    const idProvedorQueNaoModifica = process.env.ID_PROVEDOR_SERIES_SEM_MODIFICAR;

    if(provedor === '9'){
        return readJSON(path.join(__dirname, "..", "..", "cache", "get_novelas.json"));
    }

    if(category_id === '10'){
        return readJSON(path.join(__dirname, "..", "..", "cache", "get_series_popular.json"));
    }

    const res = await getAxiosResult('get_series', provedor,id);
    let series:any[]=[];
    if(provedor === idProvedorQueNaoModifica){
        if (res?.status == 200 && res?.data.length > 1 && Array.isArray(res.data)) {
            res.data.forEach(element => {
                element.series_id =  provedor + element.series_id
                element.category_id = provedor + element.category_id;
                series.push(element);
            })
        }
    }else{
        forEachSeries(res, series, provedor);
    }

    console.log(`Series Total: ${series.length}`)
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
    return series;
}

const forEachSeries = (res, series, provedor: string) => {
    if (res?.status == 200 && res?.data.length > 1 && Array.isArray(res.data)) {
        res.data.forEach(element => {
            element.series_id =  provedor + element.series_id;
            element.category_id = provedor;
            series.push(element);
        })
    }
}