import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion, useSingleFileAuthState, WAMessageStatus } from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import fs from "fs" 
import path from 'path'
import { pid } from 'node:process';
const P = require('pino')

export const connect = async () => {
    const { version } = await fetchLatestBaileysVersion()
    const { saveState, state } = useSingleFileAuthState(
        path.resolve(__dirname, '..', 'cache', 'auth_info.json')
    );

    const socket = makeWASocket({
        auth: state,
        logger: P({ Level: 'error' }),
        printQRInTerminal: true,
        version,
        browser: ['ROBOTV', '', '1.0'],
        async getMessage(key) {
            return { conversation: 'ROBOSSH' };
        },

    });

    socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            console.log('Conexao: ' + (lastDisconnect?.error as Boom)?.output?.statusCode)
            const shoudReconnection = (lastDisconnect?.error as Boom)?.output?.statusCode ===
                DisconnectReason.loggedOut;
            const restart = (lastDisconnect?.error as Boom)?.output?.statusCode ===
                DisconnectReason.restartRequired;
            if (restart) {
                await connect();
            } else if (shoudReconnection){
                let auth_info = path.join(__dirname, '..', 'cache', 'auth_info.json');
                fs.unlinkSync(auth_info)
            } else {
                process.kill(pid);
            }
        }
    });

    socket.ev.on('creds.update', saveState);
    return socket;

};