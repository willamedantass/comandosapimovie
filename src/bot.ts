import { createUserState, getUserState, removeUserState, updateUserState } from "./menubot/UserState";
import { ConversationMenuMain } from "./menubot/ConversationMenuMain";
import { getBotData, getCommand, isCommand } from "./function";
import { CadastroConversation } from "./cadastroConversation";
import { ClearEmotionAndEspace, StringClean } from "./util/stringClean";
import { MenuLevel, MenuMain, menuTexts, opcoesMenuMain } from "./menubot/Menu";
import { Acesso, Question, User } from "./type/user";
import { general } from "./configuration/general";
import { mensagem, readJSON } from "./util/jsonConverte";
import { createUser } from "./data/userDB";
import { connect } from "./connection";
import { uid } from "uid";
import path from "path";
import { UserState } from "./type/UserState";
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

                        if (!user) {
                            const agora = new Date().toISOString();
                            const userNew: User = {
                                id: uid(8),
                                nome: ClearEmotionAndEspace(data.webMessage.pushName || ''),
                                remoteJid: data.remoteJid,
                                data_cadastro: agora,
                                cadastro: true,
                                question: Question.NewName,
                                acesso: Acesso.usuario,
                                pgtos_id: [],
                                limite_pix: 0,
                                data_pix: agora,
                                credito: 0
                            }
                            await createUser(userNew);
                            await data.sendText(false, `Olá, seja bem vindo à *MOVNOW*.\n\nMeu nome é *${general.botName}* sou um assistente virtual. Seu contato foi salvo para personalizar seu atendimento.`)
                            await data.presenceTime(1000, 2000);
                            await data.sendText(true, 'Como posso lhe chamar?\nDigite seu nome e sobrenome por favor.');
                            return;
                        } else if (user.cadastro) {
                            CadastroConversation(user, data);
                            return;
                        }

                        let userState: UserState | undefined = undefined;
                        if (!data.owner && !user.cadastro) {
                            userState = getUserState(data.remoteJid);
                            if (!userState) {
                                userState = createUserState(data.remoteJid, user, MenuLevel.MAIN);
                                return await data.sendText(true, mensagem('info_menu'));
                            }

                            const conversation = StringClean(data.messageText);
                            const menu: boolean = conversation === 'menu' ? true : false;
                            if (menu) {
                                userState.status = true;
                                updateUserState(userState);
                                return await data.sendText(true, menuTexts[MenuLevel.MAIN])
                            }

                            const isCancel: boolean = (conversation === 'sair' || conversation === 'cancelar' || conversation === 'desativar') ? true : false;
                            if (userState.status && isCancel) {
                                userState.status = false;
                                updateUserState(userState);
                                return await data.sendText(true, 'MovBot desativado, para retornar é só enviar a palavra *MENU*.')
                            }

                            if (userState.status) {
                                switch (userState.menuLevel) {
                                    case MenuLevel.MAIN:
                                        const opcaoMenu: MenuMain = userState?.opcaoMenu ? opcoesMenuMain[userState.opcaoMenu] : opcoesMenuMain[conversation];
                                        ConversationMenuMain(userState, opcaoMenu, conversation, data);
                                        break;
                                }
                                return
                            }
                        }

                        if (!isCommand(command) || userState?.status === true) return;

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