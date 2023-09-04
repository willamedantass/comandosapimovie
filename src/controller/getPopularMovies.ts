import axios from "axios";
import * as dotenv from 'dotenv';
dotenv.config();

export const getPopularMovies = async (): Promise<string[] | undefined> => {
    try {
        const apiKey = process.env.API_KEY;
        const language = 'pt-BR';
        let allMovies: any = [];

        if (!apiKey) {
            console.log('Chave de api The Movie DB, não informada.');
            return
        }

        for (let page = 1; page <= 3; page++) {
            const popularMovies = await getApiPopularMovies(apiKey, language, page);
            allMovies = [...allMovies, ...popularMovies];
        }

        return allMovies.map(movie => movie.title);
    } catch (error) {
        console.error(error.message);
    }
};

const getApiPopularMovies = async (apiKey: string, language: string, page: number) => {
    const url = 'https://api.themoviedb.org/3/movie/popular';
    const params = { api_key: apiKey, language, page };

    try {
        const response = await axios.get(url, { params });
        const movies = response.data.results;

        // Filtrar filmes que têm disponibilidade no Brasil
        const moviesWithProviders = await Promise.all(
            movies.map(async (movie: any) => {
                const providersUrl = `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers`;
                const providersParams = { api_key: apiKey };
                const providersResponse = await axios.get(providersUrl, { params: providersParams });
                const providers = providersResponse.data.results.BR;
                if (providers && Object.keys(providers).length > 0) {
                    movie.watch_providers = providers;
                    return movie;
                } else {
                    return null;
                }
            })
        );
        return moviesWithProviders.filter(Boolean); // Filtrar filmes não nulos
    } catch (error) {
        throw new Error('Erro ao obter filmes populares.');
    }
}