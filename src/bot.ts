import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeInMemoryStore, proto, useMultiFileAuthState, WAMessageContent, WAMessageKey } from '@whiskeysockets/baileys';
import { CreateUserState, getUserState, UpdateUserState } from "./menubot/UserState";
import { MenuEntretenimentoOpcoes } from "./menubot/MenuEntretenimentoOpcoes";
import { MenuLevel, menuTexts, OpcoesMenuMain } from "./menubot/MenuBot";
import { ClearEmotionAndEspace, StringClean } from "./util/stringClean";
import { getBotData, getCommand, isCommand } from "./function";
import { MenuMainOpcoes } from "./menubot/MenuMainOpcoes";
import { mensagem, readJSON } from "./util/jsonConverte";
import { createUser, searchUser } from "./data/userDB";
import { general } from "./configuration/general";
import { CadastroUser } from './cadastroUser';
import { UserState } from "./type/UserState";
import MAIN_LOGGER from './util/logger';
import NodeCache from 'node-cache';
import { pid } from 'node:process';
import { Boom } from '@hapi/boom';
import { uid } from "uid";
import path from "path";

let socket: any;
const pathBlacklist = path.join(__dirname, "..", "cache", "blacklist.json");
const useStore = !process.argv.includes('--no-store')
const msgRetryCounterCache = new NodeCache()
const logger = MAIN_LOGGER.child({})
logger.level = 'info';

const store = useStore ? makeInMemoryStore({ logger }) : undefined
store?.readFromFile(path.join(__dirname, "..", "cache", "baileys_store_multi.json"));

setInterval(() => {
    store?.writeToFile(path.join(__dirname, "..", "cache", "baileys_store_multi.json"));
}, 10_000)

export const StartSock = async () => {
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, "..", "cache", "baileys_auth_info"));
    const { version } = await fetchLatestBaileysVersion()

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
        getMessage,
    })

    store?.bind(socket.ev)

    socket.ev.process(
        async (events) => {
            if (events['connection.update']) {
                const update = events['connection.update']
                const { connection, lastDisconnect } = update
                if (connection === 'close') {
                    if ((lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
                        StartSock();
                    } else {
                        console.error('servidor reiniciado!');
                        process.kill(pid);
                    }
                }
                console.info('connection update', update)
            }

            // credentials updated -- save them
            if (events['creds.update']) {
                await saveCreds()
            }

            if (events['messages.upsert']) {
                const upsert = events['messages.upsert']
                if (upsert.type === 'notify') {
                    for (const msg of upsert.messages) {
                        const remoteJid = msg.key?.remoteJid;
                        const owner: boolean = msg.key?.fromMe || false;

                        const blacklist = readJSON(pathBlacklist);
                        //ignorar mensagens de brodcast
                        if (remoteJid === "status@broadcast") return

                        //Blacklist
                        if (blacklist.includes(remoteJid) && !owner) return;

                        const { command, ...data } = getBotData(socket, msg);
                        let user = searchUser(msg.key.remoteJid);
                        if (user === undefined) {
                            const agora = new Date().toISOString();
                            const nome = ClearEmotionAndEspace(data.webMessage.pushName || '');
                            user = {
                                id: uid(8),
                                nome: nome,
                                remoteJid: data.remoteJid,
                                data_cadastro: agora,
                                isCadastrando: true,
                                acesso: owner ? 'adm' : 'usuario',
                                pgtos_id: [],
                                limite_pix: 0,
                                data_pix: agora,
                                credito: 0
                            }
                            await createUser(user);
                            await data.sendText(false, `Olá, seja bem vindo à *MOVNOW*.\n\nMeu nome é *${general.botName}* sou um assistente virtual.`);
                        }

                        if (!owner && user && user.isCadastrando) {
                            await CadastroUser(user, data);
                            return;
                        }

                        let userState: UserState | undefined = getUserState(data.remoteJid);
                        if (!owner) {

                            if (!userState) {
                                userState = CreateUserState(data.remoteJid, user, MenuLevel.MAIN);
                                await data.sendText(true, mensagem('info_menu', user.nome));
                            }

                            const conversation = StringClean(data.messageText);
                            const menu: boolean = conversation === 'menu' ? true : false;
                            if (menu) {
                                userState.status = true;
                                userState.user = user;
                                UpdateUserState(userState);
                                return await data.sendText(true, menuTexts[MenuLevel.MAIN]);
                            }

                            const isCancel: boolean = (conversation === 'sair' || conversation === 'cancelar' || conversation === 'desativar') ? true : false;
                            if (userState.status && isCancel) {
                                userState.status = false;
                                UpdateUserState(userState);
                                return await data.sendText(true, 'MovBot desativado, para retornar é só enviar a palavra *MENU*.')
                            }

                            if (userState.status) {
                                let opcaoMenu: any;
                                const select = parseInt(conversation);

                                if (isNaN(select) && !['voltar', 'sim', 'nao'].includes(conversation)) {
                                    return await data.reply(mensagem('opcao_invalida'));
                                }
                                switch (userState.menuLevel) {
                                    case MenuLevel.MAIN:
                                        opcaoMenu = userState?.opcaoMenu ? OpcoesMenuMain[userState.opcaoMenu].enum : OpcoesMenuMain[select - 1]?.enum;
                                        MenuMainOpcoes(userState, opcaoMenu, conversation, data);
                                        break;
                                    case MenuLevel.MENU_ENTRETENIMENTO:
                                        opcaoMenu = userState?.opcaoMenu ? OpcoesMenuMain[userState.opcaoMenu].enum : OpcoesMenuMain[select - 1]?.enum;
                                        MenuEntretenimentoOpcoes(userState, opcaoMenu, conversation, data);
                                        break
                                }
                                return
                            }
                        }

                        if (!isCommand(command) || userState?.status === true) return;
                        try {
                            const action = await getCommand(command.replace(general.prefix, ""));
                            await action({ command, ...data });
                        } catch (error) {
                            console.error('Log_bot: ' + error);
                        }
                    }
                }
            }
        }
    )

    return socket;

    async function getMessage(key: WAMessageKey): Promise<WAMessageContent | undefined> {
        if (store) {
            const msg = await store.loadMessage(key.remoteJid!, key.id!)
            return msg?.message || undefined
        }
        return proto.Message.fromObject({})
    }
}

export const sendZap = async (req, res) => {

    const body = req.body
    const contato = body?.contato || null;
    const remoteJid = body?.remoteJid || null;
    const mensagem = body?.mensagem || '';

    if (!contato && !remoteJid) {
        console.error('Não foi possível enviar a mensagem, parâmetros não foi enviado.');
        return res.status(400).end();
    }

    try {
        const JID = remoteJid ? remoteJid : `55${contato}@s.whatsapp.net`;
        const assinatura = `${general.prefixEmoji} *${general.botName}:* \n`
        await socket.sendMessage(JID, { text: `${assinatura}${mensagem}` });
        res.status(200).end();
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(400).end();
    }
};