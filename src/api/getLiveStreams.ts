import { createAndUpdateCache, createCache, readCache, readOption } from '../data/cacheDB';
import { getAxiosResult } from '../util/getAxios';
import { Cache } from '../type/cache';
import dotenv from 'dotenv';

dotenv.config();

interface Stream {
    stream_id: string;
    category_id: string;
    [key: string]: any;
}

export const getLiveStreams = async (isAdult: boolean): Promise<Stream[]> => {
    const action = 'get_live_streams';
    const actionAdult = 'get_live_adult';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();

    if (dataOld.getDay() !== dataNow.getDay()) {
        await updateLiveStreamsCache(action, actionAdult);
    }

    let streams = await readCache(action);
    if (isAdult) {
        const adultStreams = await readCache(actionAdult);
        streams = streams.concat(adultStreams);
    }
    return streams;
}

const updateLiveStreamsCache = async (action: string, actionAdult: string) => {
    const providerId = process.env.PROVIDER_LIVE_ID as string;
    const categoryAdult = process.env.CATEGORY_XXX_LIVE;

    let streamsJson: Stream[] = [];
    let streamsAdult: Stream[] = [];

    try {
        const res = await getAxiosResult(action, providerId);

        if (res?.status === 200 && Array.isArray(res.data)) {
            res.data.forEach((element: Stream) => {
                if (element.category_id === categoryAdult) {
                    element.category_id = '999999';
                    element.stream_id = providerId + element.stream_id;
                    streamsAdult.push(element);
                } else {
                    element.category_id = providerId + element.category_id;
                    element.stream_id = providerId + element.stream_id;
                    streamsJson.push(element);
                }
            });
        }

        if (streamsJson.length > 0) {
            const cache: Cache = {
                data: new Date().toISOString(),
                action: action,
            };
            createAndUpdateCache(cache);
            createCache(action, streamsJson);
        }

        if (streamsAdult.length > 0) {
            createCache(actionAdult, streamsAdult);
        }

        console.log(`Total de Canais: ${streamsJson.length}`);
        const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`Processo finalizado. Uso de memória aproximado: ${Math.round(usedMemory * 100) / 100} MB`);
    } catch (error) {
        console.error(`Erro ao buscar os canais de transmissão ao vivo: ${error}`);
    }
}
