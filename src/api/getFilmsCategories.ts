import { createAndUpdateCache, createCache, readCache, readOption } from '../data/cacheDB';
import { getAxiosResult } from '../util/getAxios';
import { StringClean } from '../util/stringClean';
import { readJSON } from '../util/jsonConverte';
import { Cache } from '../type/cache';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

interface Category {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export const getFilmsCategories = async (isAdult: boolean): Promise<Category[]> => {
  const action = 'get_vod_categories';
  const dataOld = new Date(readOption(action).data);
  const dataNow = new Date();
  const categoryAdult: Category = { category_id: '999999', category_name: 'XXX | FILMES ADULTOS', parent_id: 0 };

  if (dataOld.getDay() !== dataNow.getDay()) {
    await updateCategoriesCache(action);
  }

  const categories = await readCache(action);
  if (isAdult) {
    categories.push(categoryAdult);
  }
  return categories;
}

const updateCategoriesCache = async (action: string) => {
  const filmsCategories: Category[] = [];
  const logins = readJSON(path.join(__dirname, '..', '..', 'cache', 'provedor_pass.json'));

  for (const login of logins) {
    try {
      const res = await getAxiosResult(action, login.id);
      processCategories(res, filmsCategories, login.id, login.sigla);
    } catch (error) {
      console.error(`Erro ao processar categorias para o provedor ${login.provedor}: ${error}`);
    }
  }

  if (filmsCategories.length > 0) {
    const filmsCategoriesNew = reorganizeCategories(filmsCategories);
    const cache: Cache = {
      data: new Date().toISOString(),
      action: action,
    };

    createAndUpdateCache(cache);
    createCache(action, filmsCategoriesNew);
  }
}

const processCategories = (res: any, films: Category[], provedor: string, siglaProvedor: string) => {
  const categoriesAdult = process.env.CATEGORIA_XXX_FILME?.split(',');
  if (res?.status === 200 && Array.isArray(res.data)) {
    res.data.forEach((element: Category) => {
      if (!categoriesAdult?.includes(element.category_id)) {
        const categoryName = element.category_name.includes('Filmes')
          ? element.category_name.replace('Filmes', siglaProvedor)
          : `${siglaProvedor} | ${element.category_name}`;

        element.category_name = categoryName;
        element.category_id = provedor + element.category_id;
        films.push(element);
      }
    });
  }
}

const reorganizeCategories = (filmsCategories: Category[]): Category[] => {
  const filmsCategoriesNew: Category[] = [];
  filmsCategories.forEach((category) => {
    if (StringClean(category.category_name).includes('lancamento')) {
      filmsCategoriesNew.unshift(category);
    } else {
      filmsCategoriesNew.push(category);
    }
  });

  filmsCategoriesNew.unshift({ category_id: '999989', category_name: 'TOP POPULARES', parent_id: 0 });

  return filmsCategoriesNew;
}
