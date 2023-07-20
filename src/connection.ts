const { default: makeWASocket, DisconnectReason, useMultiFileAuthState,} = require("@whiskeysockets/baileys"); 
import { makeInMemoryStore } from "@whiskeysockets/baileys";
import MAIN_LOGGER from './util/logger'
import { pid } from 'node:process';
import NodeCache from 'node-cache'
import path from "path";
const logger = MAIN_LOGGER.child({})
logger.level = 'trace'

const useStore = !process.argv.includes('--no-store')
const doReplies = !process.argv.includes('--no-reply')
const useMobile = process.argv.includes('--mobile')

// external map to store retry counts of messages when decryption/encryption fails
// keep this out of the socket itself, so as to prevent a message decryption/encryption loop across socket restarts
const msgRetryCounterCache = new NodeCache()

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
const store = useStore ? makeInMemoryStore({ logger }) : undefined
store?.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
	store?.writeToFile('./baileys_store_multi.json')
}, 10_000)

export const connect = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(path.resolve(__dirname, '..', 'cache', 'auth_info'));
  
    const bot = makeWASocket({
      printQRInTerminal: true,
      auth: state,
      defaultQueryTimeoutMs: undefined,
    });
  
    bot.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect } = update;
  
      if (connection === "close") {
        const shouldReconnect =
          lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
  
        if (shouldReconnect) {
            console.log('Iniciando nova conexão com o whatsapp.');
            
            connect();
        } else {
          process.kill(pid);
        }
      }
    });
  
    bot.ev.on("creds.update", saveCreds);
    store?.bind(bot.ev)
    return bot;
};





// import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeInMemoryStore, proto, useMultiFileAuthState, WAMessageContent, WAMessageKey, WAMessageStatus } from "@whiskeysockets/baileys";
// import { Boom } from "@hapi/boom";
// import fs from "fs" 
// import path from 'path'
// import { pid } from 'node:process';
// import MAIN_LOGGER from './util/logger'
// import NodeCache from 'node-cache'
// const P = require('pino')

// const logger = MAIN_LOGGER.child({})
// logger.level = 'trace'

// const useStore = !process.argv.includes('--no-store')
// const doReplies = !process.argv.includes('--no-reply')
// const useMobile = process.argv.includes('--mobile')

// // external map to store retry counts of messages when decryption/encryption fails
// // keep this out of the socket itself, so as to prevent a message decryption/encryption loop across socket restarts
// const msgRetryCounterCache = new NodeCache()

// // the store maintains the data of the WA connection in memory
// // can be written out to a file & read from it
// const store = useStore ? makeInMemoryStore({ logger }) : undefined
// store?.readFromFile('./baileys_store_multi.json')
// // save every 10s
// setInterval(() => {
// 	store?.writeToFile('./baileys_store_multi.json')
// }, 10_000)

// export const connect = async () => {

//     const { state, saveCreds } = await useMultiFileAuthState(path.resolve(__dirname, '..', 'cache', 'auth_info.json'))
// 	// fetch latest version of WA Web
// 	const { version, isLatest } = await fetchLatestBaileysVersion()
// 	console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)

// 	const sock = makeWASocket({
// 		version,
// 		logger,
// 		printQRInTerminal: true,
// 		mobile: useMobile,
//         browser: ['ROBOTV', '', '2.0'],
// 		auth: {
// 			creds: state.creds,
// 			/** caching makes the store faster to send/recv messages */
// 			keys: makeCacheableSignalKeyStore(state.keys, logger),
// 		},
// 		msgRetryCounterCache,
// 		generateHighQualityLinkPreview: true,
// 		// ignore all broadcast messages -- to receive the same
// 		// comment the line below out
// 		// shouldIgnoreJid: jid => isJidBroadcast(jid),
// 		// implement to handle retries & poll updates
// 		getMessage,
// 	})

	
//     sock.ev.on('connection.update', async (update) => {
//         const { connection, lastDisconnect } = update;
//         if (connection === "close") {
//             console.log('Conexao: ' + (lastDisconnect?.error as Boom)?.output?.statusCode)
//             const shoudReconnection = (lastDisconnect?.error as Boom)?.output?.statusCode ===
//                 DisconnectReason.loggedOut;
//             const restart = (lastDisconnect?.error as Boom)?.output?.statusCode ===
//                 DisconnectReason.restartRequired;
//             if (restart) {
//                 await connect();
//             } else if (shoudReconnection){
//                 let auth_info = path.join(__dirname, '..', 'cache', 'auth_info.json');
//                 fs.unlinkSync(auth_info)
//             } else {
//                 process.kill(pid);
//             }
//         }
//     });

//     store?.bind(sock.ev)
//     return sock;

//     async function getMessage(key: WAMessageKey): Promise<WAMessageContent | undefined> {
// 		if(store) {
// 			const msg = await store.loadMessage(key.remoteJid!, key.id!)
// 			return msg?.message || undefined
// 		}

// 		// only if store is present
// 		return proto.Message.fromObject({})
// 	}
// }