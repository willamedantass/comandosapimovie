
import { GoogleGenerativeAI } from '@google/generative-ai';
require('dotenv/config');

(async function iniciar() {
    try {
        const api_key = process.env.API_KEY_GEMINI || '';
        const genApi = new GoogleGenerativeAI(api_key);
        const model = genApi.getGenerativeModel({model: "gemini-pro"})
        const prompt_pedido = 'Crie uma mensagem para o cliente erasmoandrade informando que a assinatura mensal da Movnow venceu e incentivando-o a renovar pelo nosso robô de pagamentos.'
        const prompt_instrucoes = 'Utilize emojis para tornar a mensagem mais envolvente. Seja persuasivo, criativo e deixe o texto divertido.'
        const prompt_info = 'Movnow é uma plataforma de canais, filmes e séries. Contato via Zap: 5585988199556.'
        const prompt_negativo = 'Não incluir links na mensagem, não sugira uma mensagem do robô de atendimento com palavras e não escreva palavras como: clicar.'
        const prompt = prompt_pedido + prompt_instrucoes + prompt_info + prompt_negativo;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
    } catch (error) {
        console.log(error.message);
    }
})();