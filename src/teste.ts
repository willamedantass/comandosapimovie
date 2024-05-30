
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
require('dotenv/config');

(async function iniciar() {
    const url = 'https://redecanaishd.in/embed/getplay.php?id=1&sv=filemoon';
    
    // const url = 'https://filemoon.sx/e/uq146x7j2bwp';
    try {
        const response = await axios.post(url);
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error message:', error.message);
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            }
        } else {
            console.error('Unexpected error:', error);
        }
    }
})();