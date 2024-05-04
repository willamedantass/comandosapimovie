"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilmsCategories = void 0;
const cacheDB_1 = require("../data/cacheDB");
const getAxios_1 = require("../util/getAxios");
const stringClean_1 = require("../util/stringClean");
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
require('dotenv/config');
const getFilmsCategories = async (isAdult) => {
    const action = 'get_vod_categories';
    const dataOld = new Date((0, cacheDB_1.readOption)(action).data);
    const dataNow = new Date();
    const category_adult = { "category_id": "999999", "category_name": "XXX | FILMES ADULTOS", "parent_id": 0 };
    if (dataOld.getDay() !== dataNow.getDay()) {
        const logins = (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "provedor_pass.json"));
        const filmsCategories = [];
        for (const login of logins) {
            let res = await (0, getAxios_1.getAxiosResult)(action, login.id);
            forEachFilms(res, filmsCategories, login.id, login.sigla);
        }
        const filmsCategoriesNew = [];
        for (let category of filmsCategories) {
            if ((0, stringClean_1.StringClean)(category['category_name']).includes('lancamento')) {
                filmsCategoriesNew.unshift(category);
            }
            else {
                filmsCategoriesNew.push(category);
            }
        }
        filmsCategoriesNew.unshift({ "category_id": "999989", "category_name": "TOP POPULARES", "parent_id": 0 });
        const cache = {
            data: new Date().toISOString(),
            action: action,
        };
        (0, cacheDB_1.createAndUpdateCache)(cache);
        (0, cacheDB_1.createCache)(action, filmsCategoriesNew);
    }
    if (isAdult) {
        const categories = await (0, cacheDB_1.readCache)(action);
        categories.push(category_adult);
        return categories;
    }
    else {
        return (0, cacheDB_1.readCache)(action);
    }
};
exports.getFilmsCategories = getFilmsCategories;
const forEachFilms = (res, films, provedor, siglaProvedor) => {
    var _a;
    const categories_adult = (_a = process.env.CATEGORIA_XXX_FILME) === null || _a === void 0 ? void 0 : _a.split(',');
    if ((res === null || res === void 0 ? void 0 : res.status) == 200 && (res === null || res === void 0 ? void 0 : res.data.length) > 1 && Array.isArray(res.data)) {
        res.data.forEach(element => {
            if (categories_adult === null || categories_adult === void 0 ? void 0 : categories_adult.find(category => category == element.category_id)) {
                return;
            }
            if (element.category_name.includes('Filmes')) {
                element.category_name = element.category_name.replace('Filmes', siglaProvedor);
            }
            else {
                element.category_name = `${siglaProvedor} | ${element.category_name}`;
            }
            element.category_id = provedor + element.category_id;
            films.push(element);
        });
    }
};
