import mongoose from 'mongoose';
import { sendMessageAlerta } from '../util/sendMessage';

const MONGODB_URI = 'mongodb://wonesistemas:4ZLU8XjAKCjC8ScU@146.235.34.194:27017/movnow?authMechanism=DEFAULT&authSource=admin';

let isConnected = false;

export const connectDB = async () => {
    if (!isConnected) {
        try {
            await mongoose.connect(MONGODB_URI);
            isConnected = true;
            console.log('Conexão com o MongoDB estabelecida com sucesso.');
        } catch (error) {
            console.error('Erro ao conectar ao MongoDB:', error);
            throw new Error('Erro ao conectar ao MongoDB.');
        }

        // Configurar evento de erro para monitorar falhas de conexão
        mongoose.connection.on('error', async () => {
            console.log('Conexão com o MongoDB perdida. Tentando reconectar...');
            await sendMessageAlerta('Conexão com o MongoDB perdida. Tentando reconectar...');
            isConnected = false;
            await reconnectDB();
        });
    }
};

const reconnectDB = async () => {
    try {
        await mongoose.disconnect();
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log('Nova conexão com o MongoDB estabelecida com sucesso.');
    } catch (error) {
        console.error('Erro ao tentar reconectar ao MongoDB:', error);
        throw new Error('Erro ao tentar reconectar ao MongoDB.');
    }
};

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('Desconexão do MongoDB realizada com sucesso.');
    } catch (error) {
        console.error('Erro ao desconectar do MongoDB:', error);
        throw new Error('Erro ao desconectar do MongoDB.');
    }
};

