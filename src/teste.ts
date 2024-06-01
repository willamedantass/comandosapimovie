
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { geminiChat } from './util/gemini';
require('dotenv/config');

(async function iniciar() {
    const resposta = await geminiChat("crie um texto de bom dia romantico para minha esposa")
    console.log(resposta);
    
    
})();