import { createAndUpdateCache, createCache, readCache, readOption } from '../data/cacheDB';
import { getAxiosResult } from '../util/getAxios';
import { Cache } from '../type/cache';
import dotenv from 'dotenv';
dotenv.config();

interface LiveCategory {
    category_id: string;
    category_name: string;
    parent_id: number;
}

export const getLiveCategories = async (isAdult: boolean): Promise<LiveCategory[]> => {
    const action = 'get_live_categories';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();
    const adultCategoryId = '999999';
    const adultCategoryName = 'CANAIS | CANAIS ADULTO';

    if (dataOld.getDay() !== dataNow.getDay()) {
        await updateLiveCategoriesCache(action);
    }

    let categories = await readCache(action);

    if (isAdult) {
        const adultCategory: LiveCategory = { category_id: adultCategoryId, category_name: adultCategoryName, parent_id: 0 };
        categories.push(adultCategory);
    }

    return categories;
}

const updateLiveCategoriesCache = async (action: string) => {
    const providerId = process.env.PROVIDER_LIVE_ID;
    const adultCategory = process.env.CATEGORY_XXX_LIVE;
    let categories: LiveCategory[] = [];

    if(!providerId) return console.error('Não é possivel atualizar lista de canais, variável providerId é inválida.');
    

    try {
        const res = await getAxiosResult(action, providerId);
        if (res?.status === 200 && Array.isArray(res.data)) {
            categories = res.data.map((element: LiveCategory) => {
                if (element.category_id !== adultCategory) {
                    element.category_id = providerId + element.category_id;
                    return element;
                }
                return null;
            }).filter((category: LiveCategory | null) => category !== null) as LiveCategory[];

            if (categories.length > 0) {
                const cache: Cache = {
                    data: new Date().toISOString(),
                    action: action,
                };
                createAndUpdateCache(cache);
                createCache(action, categories);
            }
        }
    } catch (error) {
        console.error(`Error fetching live categories from provider ${providerId}: ${error}`);
    }
}
