"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeries = void 0;
const cacheDB_1 = require("../data/cacheDB");
const getPopularSeries_1 = require("../controller/getPopularSeries");
const stringSimilatary_1 = require("../util/stringSimilatary");
const getAxios_1 = require("../util/getAxios");
const jsonConverte_1 = require("../util/jsonConverte");
const path_1 = __importDefault(require("path"));
require('dotenv/config');
let popularTheMovieDB;
let popularSeries = [];
let series = [];
let novelas = [];
let isLoading = false;
const series_popular = '10';
const getSeries = async () => {
    const action = 'get_series';
    const actionNovelas = 'get_novelas';
    const actionPopular = 'get_series_popular';
    const dataOld = new Date((0, cacheDB_1.readOption)(action).data);
    const dataNow = new Date();
    if (dataOld.getDay() !== dataNow.getDay()) {
        if (isLoading) {
            return;
        }
        isLoading = true;
        series = [];
        novelas = [];
        try {
            const logins = (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "provedor_pass.json"));
            popularTheMovieDB = await (0, getPopularSeries_1.getPopularSeries)();
            for (const login of logins) {
                let res = await (0, getAxios_1.getAxiosResult)(action, login.id);
                console.log(`Séries ${login.provedor}: ${res === null || res === void 0 ? void 0 : res.data.length}`);
                forEachSeries(res, login.id);
            }
            popularSeries.sort((a, b) => a.posicao - b.posicao);
            series.unshift(...popularSeries);
            console.log(`Séries Total: ${series.length}`);
            const used = process.memoryUsage().heapUsed / 1024 / 1024;
            console.log(`Processo finalizado uso aproximado: ${Math.round(used * 100) / 100} MB`);
            const cache = {
                data: new Date().toISOString(),
                action: action,
            };
            (0, cacheDB_1.createAndUpdateCache)(cache);
            (0, cacheDB_1.createCache)(actionNovelas, novelas);
            (0, cacheDB_1.createCache)(actionPopular, popularSeries);
            (0, cacheDB_1.createCache)(action, series);
            isLoading = false;
            return series;
        }
        catch (error) {
            isLoading = false;
            console.error(`Error ao processar biblioteca de séries: ${error}`);
        }
    }
    else {
        return (0, cacheDB_1.readCache)(action);
    }
};
exports.getSeries = getSeries;
const forEachSeries = (res, provedor) => {
    const category_novelas = (0, jsonConverte_1.readJSON)(path_1.default.join(__dirname, "..", "..", "cache", "categories_novelas.json"));
    const idProvedoQueNaoModifica = process.env.ID_PROVEDOR_SERIES_SEM_MODIFICAR;
    if ((res === null || res === void 0 ? void 0 : res.status) == 200 && (res === null || res === void 0 ? void 0 : res.data.length) > 1 && Array.isArray(res.data)) {
        res.data.forEach(element => {
            if (element.category_id == "31755") {
                return console.log('achei');
            }
            if (category_novelas.find(category => category == (provedor + element.category_id))) {
                element.category_id = "9";
                novelas.push(element);
            }
            else if (idProvedoQueNaoModifica == provedor) {
                element.category_id = provedor + element.category_id;
            }
            else {
                const popular = (popularTheMovieDB !== undefined) ? (0, stringSimilatary_1.stringSimilatary)(element.name, popularTheMovieDB) : null;
                if (popular && (provedor === '2' || provedor === '6')) {
                    element.category_id = series_popular;
                    popularSeries.push({ ...element, posicao: popular });
                    return;
                }
                else {
                    element.category_id = provedor;
                }
            }
            element.series_id = provedor + element.series_id;
            series.push(element);
        });
    }
};
