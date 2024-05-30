import { createAndUpdateCache, createCache, readCache, readOption } from '../data/cacheDB';
import { readJSON, writeJSON } from '../util/jsonConverte';
import { getAxiosResult } from '../util/getAxios';
import { Cache } from '../type/cache';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface Category {
    category_id: string;
    category_name: string;
    parent_id: number;
}

export const getSeriesCategories = async (): Promise<Category[]> => {
    const action = 'get_series_categories';
    const dataOld = new Date(readOption(action).data);
    const dataNow = new Date();

    if (dataOld.getDay() !== dataNow.getDay()) {
        await updateSeriesCategoriesCache(action);
    }

    return readCache(action);

}

const updateSeriesCategoriesCache = async (action: string) => {
    const logins = readJSON(path.join(__dirname, '..', '..', 'cache', 'provedor_pass.json'));
    const categorias: Category[] = [
        { category_id: '9', category_name: 'NOVELAS', parent_id: 0 },
        { category_id: '10', category_name: 'TOP SERIES', parent_id: 0 },
    ]
    const categoryNovelas: string[] = [];

    for (const login of logins) {
        const res = await getAxiosResult(action, login.id);
        processCategories(res, categorias, categoryNovelas, login.id, login.sigla);
    }

    if (categoryNovelas.length > 0) {
        writeJSON(path.join(__dirname, '..', '..', 'cache', 'categories_novelas.json'), categoryNovelas);
    }

    if (categorias.length > 0) {
        const cache: Cache = {
            data: new Date().toISOString(),
            action: action,
        };
        createAndUpdateCache(cache);
        createCache(action, categorias);
    }
}

const processCategories = (res: any, categorias: Category[], categoryNovelas: string[], providerId: string, providerSigla: string) => {
    const idProviderNoModify = process.env.ID_PROVEDOR_SERIES_SEM_MODIFICAR;

    if (res?.status === 200 && Array.isArray(res.data)) {
        res.data.forEach((element: Category) => {
            const name = element.category_name.toLowerCase();
            if (name.includes('novela') || name.includes('novelas')) {
                categoryNovelas.push(providerId + element.category_id);
            }
            if (idProviderNoModify === providerId) {
                element.category_id = providerId + element.category_id;
                categorias.push(element);
            }
        });
        categorias.push({ category_id: providerId, category_name: `${providerSigla} SERIES`, parent_id: 0 });
    }
}
