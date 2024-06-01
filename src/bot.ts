import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    makeInMemoryStore,
    proto,
    useMultiFileAuthState,
    WAMessageContent,
    WAMessageKey
} from '@whiskeysockets/baileys';
import { handleMessagesUpsert } from './messageHandler';
import MAIN_LOGGER from './util/logger';
import NodeCache from 'node-cache';
import { pid } from 'node:process';
import { Boom } from '@hapi/boom';
import path from "path";
import { general } from './configuration/general';

let socket: any;
const useStore = !process.argv.includes('--no-store');
const msgRetryCounterCache = new NodeCache();
const logger = MAIN_LOGGER.child({});
logger.level = 'info';

const store = useStore ? makeInMemoryStore({ logger }) : undefined;
if (store) {
    store.readFromFile(path.join(__dirname, "..", "cache", "baileys_store_multi.json"));
    setInterval(() => {
        store.writeToFile(path.join(__dirname, "..", "cache", "baileys_store_multi.json"));
    }, 10_000);
}

export const StartSock = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, "..", "cache", "baileys_auth_info"));
    const { version } = await fetchLatestBaileysVersion();

    socket = makeWASocket({
        version,
        logger,
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        msgRetryCounterCache,
        generateHighQualityLinkPreview: true,
        getMessage: getMessage,
    });

    if (store) {
        store.bind(socket.ev);
    }

    socket.ev.process(
        async (events) => {
            if (events['connection.update']) {
                handleConnectionUpdate(events['connection.update']);
            }

            if (events['creds.update']) {
                await saveCreds();
            }

            if (events['messages.upsert']) {
                await handleMessagesUpsert(events['messages.upsert'], socket);
            }
        }
    );

    return socket;
};

const getMessage = async (key: WAMessageKey): Promise<WAMessageContent | undefined> => {
    if (store) {
        const msg = await store.loadMessage(key.remoteJid!, key.id!);
        return msg?.message || undefined;
    }
    return proto.Message.fromObject({});
};

const handleConnectionUpdate = (update: any) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
        if ((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
            StartSock();
        } else {
            console.error('Servidor reiniciado!');
            process.kill(pid);
        }
    }
    console.info('Connection update', update);
};

export const sendZap = async (req, res) => {
    const body = req.body;
    const contato: string = body?.contato || '';
    const remoteJid: string = body?.remoteJid || '';
    const mensagem: string = body?.mensagem || '';

    if (!contato && !remoteJid) {
        console.error('Não foi possível enviar a mensagem, parâmetros não foram enviados.');
        return res.status(400).end();
    }

    try {
        const JID = remoteJid || `55${contato.startsWith('55') ? contato.substring(2) : contato}@s.whatsapp.net`;
        const assinatura = `${general.prefixEmoji} *${general.botName}:* \n`;
        await socket.sendMessage(JID, { text: `${assinatura}${mensagem}` });
        res.status(200).end();
    } catch (error) {
        console.error('Erro ao enviar mensagem pelo socket:', error.message);
        res.status(400).end();
    }
}