import { readJSON, writeJSON } from "../util/jsonConverte";
import path from "path";
import { Cache } from "../type/cache";
const pathJson = path.join(__dirname, "..", "..", "cache", "cache.json");

export const readOption = (action: string): Cache => {
    const option = readJSON(pathJson).find(value => value?.action === action);
    if (option) { return option };
    let date = new Date();
    date.setDate(date.getDate() - 1);
    let cache: Cache = {
        action: '',
        data: date.toISOString()
    }
    return cache;
}

export const readCache = (action: string) => {
    const pathCache = path.join(__dirname, "..", "..", "cache", `${action}.json`);
    return readJSON(pathCache);
}

export const readAction = (action: string) => {
    const arquivo = readJSON(pathJson);
    const result = arquivo.find(value => value?.action === action);
    if(!result){
        return { action: action, data: new Date().toISOString(), count: 0 } as Cache
    }
    return result;
}

export const createCache = (action: string, data) => {
    const pathCache = path.join(__dirname, "..", "..", "cache", `${action}.json`);
    writeJSON(pathCache, data);
}



export const createAndUpdateCache = (cache: Cache) => {
    const arquivo = readJSON(pathJson);
    const action = arquivo.find(value => value?.action === cache.action);
    if (arquivo.length && action) {
        const arquivoNew = arquivo.map((value: Cache) => {
            if (value?.action === cache.action) {
                return cache;
            } else {
                return value;
            }
        });
        writeJSON(pathJson, arquivoNew);
    } else {
        arquivo.push(cache);
        writeJSON(pathJson, arquivo);
    }
}

