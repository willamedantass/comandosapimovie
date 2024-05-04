
import { GoogleGenerativeAI } from '@google/generative-ai';

(async function iniciar() {
    try {
        const mensagem = {
            "prompt_solicitacao": "Identifique se essa palavra é um nome próprio: willame",
            "prompt_instrucoes": "Responda no seguinte formato:\n{ \"result\": 'true ou false com o resultado se o nome é prórpio', \"genero\": \"female\" ou \"male\" ou null",
            "prompt_info": "",
            "prompt_negativo": "",
            "default": "{ \"result\": true, \"genero\": null}"
        }
        const genApi = new GoogleGenerativeAI('AIzaSyBAUou4o4rWoJyVOTrpNwWFu0x3pViOYJQ')
        const model = genApi.getGenerativeModel({ model: "gemini-pro" })
        const prompt = mensagem.prompt_solicitacao + mensagem.prompt_instrucoes + mensagem.prompt_info + mensagem.prompt_negativo;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        console.log(text);

    } catch (error) {
        console.log(error.message);

    }
})();

