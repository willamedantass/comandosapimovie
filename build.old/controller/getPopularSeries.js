"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopularSeries = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const getPopularSeries = async () => {
    try {
        const apiKey = process.env.API_KEY;
        const language = 'pt-BR';
        let allSeries = [];
        if (!apiKey) {
            throw new Error('API Key não fornecida. Defina a variável de ambiente API_KEY.');
        }
        for (let page = 1; page <= 3; page++) {
            const popularSeries = await getApiPopularSeries(apiKey, language, page);
            allSeries = [...allSeries, ...popularSeries];
        }
        return allSeries.map(serie => serie.name);
    }
    catch (error) {
        console.error(error.message);
    }
};
exports.getPopularSeries = getPopularSeries;
const getApiPopularSeries = async (apiKey, language, page) => {
    const url = 'https://api.themoviedb.org/3/tv/popular';
    const params = { api_key: apiKey, language, page };
    try {
        const response = await axios_1.default.get(url, { params });
        const series = response.data.results;
        const seriesWithProviders = await Promise.all(series.map(async (serie) => {
            const providersUrl = `https://api.themoviedb.org/3/tv/${serie.id}/watch/providers`;
            const providersParams = { api_key: apiKey };
            const providersResponse = await axios_1.default.get(providersUrl, { params: providersParams });
            const providers = providersResponse.data.results.BR; // Filtrar as informações apenas para o Brasil
            if (providers && Object.keys(providers).length > 0) {
                serie.watch_providers = providers;
                return serie;
            }
            else {
                return null; // Se não houver disponibilidade no Brasil, retornar null
            }
        }));
        return seriesWithProviders.filter(Boolean);
    }
    catch (error) {
        throw new Error('Erro ao obter séries populares.');
    }
};
