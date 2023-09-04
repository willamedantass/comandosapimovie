import axios from "axios";
import * as dotenv from 'dotenv';
dotenv.config();

export const getPopularSeries = async (): Promise<string[] | undefined> => {
    try {
        const apiKey = process.env.API_KEY;
        const language = 'pt-BR';
        let allSeries: any = [];

        if (!apiKey) {
            throw new Error('API Key não fornecida. Defina a variável de ambiente API_KEY.');
        }

        for (let page = 1; page <= 3; page++) {
            const popularSeries = await getApiPopularSeries(apiKey, language, page);
            allSeries = [...allSeries, ...popularSeries];
        }
        return allSeries.map(serie => serie.name);
    } catch (error) {
        console.error(error.message);
    }
};

const getApiPopularSeries = async (apiKey: string, language: string, page: number) => {
    const url = 'https://api.themoviedb.org/3/tv/popular';
    const params = { api_key: apiKey, language, page };

    try {
        const response = await axios.get(url, { params });
        const series = response.data.results;

        const seriesWithProviders = await Promise.all(
            series.map(async (serie) => {
                const providersUrl = `https://api.themoviedb.org/3/tv/${serie.id}/watch/providers`;
                const providersParams = { api_key: apiKey };
                const providersResponse = await axios.get(providersUrl, { params: providersParams });
                const providers = providersResponse.data.results.BR; // Filtrar as informações apenas para o Brasil
                if (providers && Object.keys(providers).length > 0) {
                    serie.watch_providers = providers;
                    return serie;
                } else {
                    return null; // Se não houver disponibilidade no Brasil, retornar null
                }
            })
        );
        return seriesWithProviders.filter(Boolean);
    } catch (error) {
        throw new Error('Erro ao obter séries populares.');
    }
}