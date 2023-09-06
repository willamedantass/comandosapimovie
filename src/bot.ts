import { getUserState, removeUserState, updateUserState } from "./menubot/UserState";
import { ConversationMenuMain } from "./menubot/ConversationMenuMain";
import { getBotData, getCommand, isCommand } from "./function";
import { CadastroConversation } from "./cadastroConversation";
import { ClearEmotionAndEspace } from "./util/stringClean";
import { MenuLevel, menuTexts } from "./menubot/Menu";
import { Acesso, Question, User } from "./type/user";
import { general } from "./configuration/general";
import { readJSON } from "./util/jsonConverte";
import { createUser } from "./data/userDB";
import { connect } from "./connection";
import { uid } from "uid";
import path from "path";
const pathUsers = path.join(__dirname, "..", "cache", "user.json");
const pathBlacklist = path.join(__dirname, "..", "cache", "blacklist.json");
let socket: any;

export default async () => {
    socket = await connect();
    socket.ev.process(
        async (events) => {
            if (events['messages.upsert']) {
                const upsert = events['messages.upsert']
                if (upsert.type === 'notify') {
                    for (const msg of upsert.messages) {
                        //ignorar mensagens de brodcast
                        if (msg.key?.remoteJid === "status@broadcast") {
                            return;
                        }
                        //Blacklist
                        if (readJSON(pathBlacklist).includes(msg.key.remoteJid) && !msg.key.fromMe) {
                            return;
                        }

                        let user: User = readJSON(pathUsers).find(value => value.remoteJid === msg.key.remoteJid)
                        const { command, ...data } = getBotData(socket, msg, user);
                        const userState = getUserState(data.remoteJid);
                        if (!data.owner) {
                            if (!user) {
                                const userNew: User = {
                                    id: uid(8),
                                    nome: ClearEmotionAndEspace(data.webMessage.pushName || ''),
                                    remoteJid: data.remoteJid,
                                    data_cadastro: new Date().toISOString(),
                                    cadastro: true,
                                    question: Question.Name,
                                    acesso: Acesso.usuario,
                                    pgtos_id: [],
                                    credito: 0
                                }
                                await createUser(userNew);
                                await data.sendText(false, `Olá, seja bem vindo à *MOVNOW*.\n \nMeu nome é *${general.botName}* sou um assistente virtual. Seu contato foi salvo para personalizar seu atendimento.`)
                                await data.presenceTime(1000, 2000);
                                await data.sendText(true, `Posso lhe chamar por *${userNew.nome}*?`);
                            } else if (user?.cadastro) {
                                CadastroConversation(user, data);
                            }

                            const msg_conversation = data.messageText.toLowerCase();
                            const menu: boolean = msg_conversation === 'menu' ? true : false;
                            if (menu) {
                                const expire = new Date();
                                expire.setMinutes(expire.getMinutes() + 15);
                                updateUserState(data.remoteJid, MenuLevel.MAIN, expire);
                                return await data.sendText(true, menuTexts[MenuLevel.MAIN])
                            }

                            const isCancel: boolean = (msg_conversation === 'sair' || msg_conversation === 'cancelar' || msg_conversation === 'desativar') ? true : false;
                            if (userState && isCancel) {
                                removeUserState(data.remoteJid);
                                return await data.sendText(true, 'MovBot desativado, para retornar é só enviar a palavra *MENU*.')
                            }

                            if (userState) {
                                switch (userState.menuLevel) {
                                    case MenuLevel.MAIN:
                                        ConversationMenuMain(user, msg_conversation, data);
                                        break;
                                }
                                return
                            }
                        }

                        if (!isCommand(command) || userState instanceof Object) return;
                        if ((user && !user?.cadastro) || data.owner) {
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
        }
    )
};

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