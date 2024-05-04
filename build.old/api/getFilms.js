"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilms = void 0;
const getPopularMovies_1 = require("../controller/getPopularMovies");
const cacheDB_1 = require("../data/cacheDB");
const getAxios_1 = require("../util/getAxios");
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
const stringSimilatary_1 = require("../util/stringSimilatary");
require('dotenv/config');
let popularTheMovieDB;
let popularMovies = [];
let filmsAdult = [];
let films = [];
const categoria_top_popular = '999989';
const categoria_adulto = '999999';
let isLoading = false;
const getFilms = async (isAdult) => {
    const action = 'get_vod_streams';
    const actionPopular = 'get_vod_popular';
    const actionAdult = 'get_vods_adult';
    const dataOld = new Date((0, cacheDB_1.readOption)(action).data);
    const dataNow = new Date();
    if (dataOld.getDay() !== dataNow.getDay()) {
        if (isLoading) {
            return;
        }
        isLoading = true;
        popularTheMovieDB = [];
        popularMovies = [];
        filmsAdult = [];
        films = [];
        try {
            const provedores = (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "provedor_pass.json"));
            popularTheMovieDB = await (0, getPopularMovies_1.getPopularMovies)();
            for (const provedor of provedores) {
                let res = await (0, getAxios_1.getAxiosResult)(action, provedor.id);
                console.log(`Filmes ${provedor.provedor}: ${res === null || res === void 0 ? void 0 : res.data.length}`);
                forEachFilms(res, provedor.id);
            }
            popularMovies.sort((a, b) => a.posicao - b.posicao);
            films.unshift(...popularMovies);
            console.log(`Filmes Total: ${films.length}`);
            const used = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
            const cache = {
                data: new Date().toISOString(),
                action: action,
            };
            (0, cacheDB_1.createAndUpdateCache)(cache);
            (0, cacheDB_1.createCache)(action, films);
            (0, cacheDB_1.createCache)(actionPopular, popularMovies);
            (0, cacheDB_1.createCache)(actionAdult, filmsAdult);
            if (isAdult) {
                return films.concat(filmsAdult);
            }
            isLoading = false;
            return films;
        }
        catch (error) {
            isLoading = false;
            console.error(`Error ao processar biblioteca de filmes: ${error}`);
        }
    }
    else {
        const films = await (0, cacheDB_1.readCache)(action);
        if (isAdult) {
            const filmsAdult = await (0, cacheDB_1.readCache)(actionAdult);
            return films.concat(filmsAdult);
        }
        return films;
    }
};
exports.getFilms = getFilms;
const forEachFilms = (res, provedor) => {
    var _a;
    const categories_adult = (_a = process.env.CATEGORIA_XXX_FILME) === null || _a === void 0 ? void 0 : _a.split(',');
    if ((res === null || res === void 0 ? void 0 : res.status) == 200 && (res === null || res === void 0 ? void 0 : res.data.length) > 1 && Array.isArray(res.data)) {
        res.data.forEach(element => {
            if (categories_adult === null || categories_adult === void 0 ? void 0 : categories_adult.find(category => category == element.category_id)) {
                element.stream_id = provedor + element.stream_id;
                element.category_id = categoria_adulto;
                filmsAdult.push(element);
            }
            else {
                element.stream_id = provedor + element.stream_id;
                const title = element.title ? element.title : element.name;
                const popular = (popularTheMovieDB !== undefined) ? (0, stringSimilatary_1.stringSimilatary)(title, popularTheMovieDB) : null;
                if (popular && (provedor === '2' || provedor === '6')) {
                    element.category_id = categoria_top_popular;
                    popularMovies.push({ ...element, posicao: popular });
                }
                else {
                    element.category_id = provedor + element.category_id;
                    films.push(element);
                }
            }
        });
    }
};
