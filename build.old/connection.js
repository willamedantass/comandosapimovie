// import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
// import { makeInMemoryStore } from "@whiskeysockets/baileys";
// import MAIN_LOGGER from './util/logger'
// import { pid } from 'node:process';
// import path from "path";
// const logger = MAIN_LOGGER.child({})
// logger.level = 'info'
// const useStore = !process.argv.includes('--no-store')
// const store = useStore ? makeInMemoryStore({ logger }) : undefined
// store?.readFromFile('./baileys_store_multi.json')
// // save every 10s
// setInterval(() => {
//   store?.writeToFile('./baileys_store_multi.json')
// }, 10_000)
// export const connect = async () => {
//   const { state, saveCreds } = await useMultiFileAuthState(path.resolve(__dirname, '..', 'cache', 'auth_info'));
//   const sock = makeWASocket({
//     printQRInTerminal: true,
//     auth: state,
//     defaultQueryTimeoutMs: undefined,
//     logger
//   });
//   // sock.ev.on('connection.update', (update) => {
//   //   const { connection, lastDisconnect } = update
//   //   if (connection === 'close') {
//   //     const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
//   //     console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
//   //     // reconnect if not logged out
//   //     if (shouldReconnect) {
//   //       connect()
//   //     }
//   //   } else if (connection === 'open') {
//   //     console.log('opened connection')
//   //   }
//   // })
//   sock.ev.on("connection.update", (update) => {
//     const { connection, lastDisconnect } = update;
//     if (connection === "close") {
//       // const shouldReconnect =
//       //   lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
//       // if (shouldReconnect) {
//       console.error('Iniciando nova conexão com o whatsapp.');
//       process.kill(pid);
//       // } 
//       // else {
//       //   console.error('servidor reiniciado!');
//       //   process.kill(pid);
//       // }
//     }
//   });
//   sock.ev.on("creds.update", saveCreds);
//   store?.bind(sock.ev)
//   return sock;
// };
