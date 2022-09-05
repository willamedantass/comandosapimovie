import { readJSON, writeJSON } from "../util/jsonConverte";
import path from "path";
import { Cache } from "../type/cache";
const pathJson = path.join(__dirname, "..", "..", "cache", "cache.json");

export const readOption = (action: string) : Cache => {
    const option = readJSON(pathJson).find(value => value.action === action);
    if(option) {return option};
    let date = new Date();
    date.setDate(date.getDate() - 1);
    let cache: Cache = {
        action : '',
        data : date.toISOString()
    }
    return cache;
}

export const readCache = async (action: string) => {
    const pathCache = path.join(__dirname, "..", "..", "cache", `${action}.json`);
    return await readJSON(pathCache);
}

export const createCache = (action: string, data) => {
    const pathCache = path.join(__dirname, "..", "..", "cache", `${action}.json`);
    writeJSON(pathCache, data);
}



export const createAndUpdateOption = async (cache: Cache) => {
    const arquivo = readJSON(pathJson);
    const option = arquivo.find(value => value.action === cache.action);

    if (option) {
        let arquivoNew = [];
        arquivoNew.forEach(value => {
            if (value.action === cache.action) {
                arquivoNew.push(value);
            } else {
                arquivoNew.push(value);
            }
        });
        writeJSON(pathJson, arquivoNew);
    } else {
        arquivo.push(cache);
        writeJSON(pathJson, arquivo);
    }
}

