import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory, SafetySetting } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const callGeminiApi = async (prompt: string): Promise<string | undefined> => {
    try {

        const safety_settings = [
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            }
        ]

        const generation_config = {
            max_output_tokens: 256,
            temperature: 0.4,
            top_p: 1,
            top_k: 16,
        }
        
        const api_key = process.env.API_KEY_GEMINI || '';
        const genApi = new GoogleGenerativeAI(api_key);
        const model = genApi.getGenerativeModel({ model: "gemini-1.5-pro", safetySettings: safety_settings, generationConfig: generation_config });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error('Erro ao consultar api gemini.', error.message);
    }
    return undefined;
}

export const gemini = async (
    prompt_solicitacao: string,
    prompt_instrucoes: string,
    prompt_info: string,
    prompt_negativo: string
): Promise<string | undefined> => {
    const prompt = prompt_solicitacao + prompt_instrucoes + prompt_info + prompt_negativo;
    return await callGeminiApi(prompt);
}

export const geminiChat = async (solicitacao: string): Promise<string | undefined> => {
    const prompt = `Você é um chatbot avançado baseado no modelo Gemini da Google AI, projetado para interagir com usuários de forma amigável e informativa. 
    Sua função é responder perguntas, criar textos, contar piadas e usar todo o seu conhecimento para fornecer respostas úteis e precisas. 
    
    Siga as diretrizes abaixo para garantir uma interação satisfatória com os usuários:
    Respostas Claras e Precisas: Forneça respostas claras, precisas e diretas às perguntas dos usuários.
    Criação de Textos: Seja criativo ao criar textos, histórias ou qualquer outro conteúdo solicitado.
    Contar Piadas: Tenha um repertório de piadas engraçadas e apropriadas para todas as idades.
    Uso do Conhecimento: Utilize todo o seu conhecimento atualizado para responder às solicitações.
    Tom Amigável e divertido: Mantenha um tom amigável e divertido em todas as interações.
    Agora, responda à solicitação abaixo: ${solicitacao}`
    return await callGeminiApi(prompt);
}
