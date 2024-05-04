import { GoogleGenerativeAI } from '@google/generative-ai';
require('dotenv/config');

export const gemini = async (prompt_solicitacao: string, prompt_instrucoes: string, prompt_info: string, prompt_negativo: string): Promise<string|undefined> => {
    try {
        const api_key = process.env.API_KEY_GEMINI || '';
        const genApi = new GoogleGenerativeAI(api_key);
        const model = genApi.getGenerativeModel({ model: "gemini-pro" });
        const prompt = prompt_solicitacao + prompt_instrucoes + prompt_info + prompt_negativo;
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Erro ao consultar api gemini.', error.message);
    }
    return undefined;
}