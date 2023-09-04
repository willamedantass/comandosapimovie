const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, } = require("@whiskeysockets/baileys");
import { makeInMemoryStore } from "@whiskeysockets/baileys";
import MAIN_LOGGER from './util/logger'
import { pid } from 'node:process';
import path from "path";
const logger = MAIN_LOGGER.child({})
logger.level = 'info'

const useStore = !process.argv.includes('--no-store')

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
    logger
  });

  bot.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    console.error(`Update ${JSON.stringify(update)}`);

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;

      // if (shouldReconnect) {
      console.error('Iniciando nova conexão com o whatsapp.');
      process.kill(pid);
      // } 
      // else {
      //   console.error('servidor reiniciado!');
      //   process.kill(pid);
      // }
    }
  });

  bot.ev.on("creds.update", saveCreds);
  store?.bind(bot.ev)
  return bot;
};