import { Provedor } from '../type/provedor';
import { getAxiosResult } from '../util/getAxios';
require('dotenv/config')

export const getSeriesCategoryId = async (category_id: string) => {

    const id: string = category_id.substring(1);
    const provedor: string = category_id.charAt(0);

    const res = await getAxiosResult('get_series', provedor,id);
    let series=[];
    if(provedor === Provedor.tigotv){
        if (res?.status == 200 && res?.data.length > 1) {
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
    if (res?.status == 200 && res?.data.length > 1) {
        res.data.forEach(element => {
            element.series_id =  provedor + element.series_id;
            element.category_id = provedor;
            series.push(element);
        })
    }
}