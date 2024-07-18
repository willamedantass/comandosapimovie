import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { config } from 'dotenv';
config();

(async function iniciar() {
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
        ];

        const generation_config = {
            max_output_tokens: 256,
            temperature: 0.4,
            top_p: 1,
            top_k: 16,
        };

        const mensagem = {
            "prompt_solicitacao": "Preciso que você identifique se a palavra a seguir é um nome próprio de uma pessoa ou uma palavra comum. Aqui esta a palavra: Luanara",
            "prompt_instrucoes": "Responda no formato json:\n{ \"result\": true | false, \"genero\": \"female\" | \"male\" | null",
            "prompt_info": "",
            "prompt_negativo": "não use aspas ou bloco de codigos",
            "defaultMessage": "{ \"result\": true, \"genero\": null}"
        };

        const apiKeys = process.env.API_KEY_GEMINI?.split(',') || [];

        let text: string | null = null;
        for (const keyGemini of apiKeys) {
            try {
                const genApi = new GoogleGenerativeAI(keyGemini);
                const model = genApi.getGenerativeModel({
                    model: "gemini-1.5-flash",
                    safetySettings: safety_settings,
                    generationConfig: generation_config
                });
                const prompt = mensagem.prompt_solicitacao + mensagem.prompt_instrucoes + mensagem.prompt_info + mensagem.prompt_negativo;
                const result = await model.generateContent(prompt);
                text = result.response.text();
                break; // Break the loop if the API call is successful
            } catch (error: any) {
                console.error('Erro ao consultar API Gemini.', error.message);
                if (error.message.includes("Quota exceeded for quota metric")) {
                    console.log('Tentando próxima chave de API...');
                    continue;  // Try the next API key
                } else {
                    throw error;  // Re-throw the error if it's not "Quota exceeded"
                }
            }
        }

        if (text) {
            console.log(text);
        } else {
            console.error('Todas as chaves de API foram excedidas ou ocorreu um erro.');
        }
    } catch (error) {
        console.error('Erro ao iniciar:', error.message);
    }
})();
