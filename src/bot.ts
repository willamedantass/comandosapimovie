import { CreateUserState, getUserState, UpdateUserState } from "./menubot/UserState";
import { MenuEntretenimentoOpcoes } from "./menubot/MenuEntretenimentoOpcoes";
import { MenuLevel, menuTexts, OpcoesMenuMain } from "./menubot/MenuBot";
import { ClearEmotionAndEspace, StringClean } from "./util/stringClean";
import { getBotData, getCommand, isCommand } from "./function";
import { CadastroConversation } from "./cadastroConversation";
import { MenuMainOpcoes } from "./menubot/MenuMainOpcoes";
import { mensagem, readJSON } from "./util/jsonConverte";
import { createUser } from "./data/userDB";
import { Acesso, Question, User } from "./type/user";
import { general } from "./configuration/general";
import { UserState } from "./type/UserState";
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
                        const blacklist = readJSON(pathBlacklist);
                        //ignorar mensagens de brodcast
                        if (msg.key?.remoteJid === "status@broadcast") return

                        //Blacklist
                        if (blacklist.includes(msg.key.remoteJid) && !msg.key.fromMe) return;

                        let user: User = readJSON(pathUsers).find(value => value.remoteJid === msg.key.remoteJid)
                        const { command, ...data } = getBotData(socket, msg, user);

                        if (!user && !data.owner) {
                            const agora = new Date().toISOString();
                            const nome = ClearEmotionAndEspace(data.webMessage.pushName || '');
                            const userNew: User = {
                                id: uid(8),
                                nome: StringClean(nome),
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
                            await data.presenceTime(1000, 1500);
                            await data.sendText(true, 'Como posso lhe chamar?\nDigite seu nome e sobrenome por favor.');
                            return;
                        } else if (user.cadastro && !data.owner) {
                            CadastroConversation(user, data);
                            return;
                        }

                        let userState: UserState | undefined = undefined;
                        if (!data.owner && !user.cadastro) {
                            userState = getUserState(data.remoteJid);
                            if (!userState) {
                                userState = CreateUserState(data.remoteJid, user, MenuLevel.MAIN);
                                await data.sendText(true, mensagem('info_menu'));
                            }

                            const conversation = StringClean(data.messageText);
                            const menu: boolean = conversation === 'menu' ? true : false;
                            if (menu) {
                                userState.status = true;
                                userState.user = user;
                                UpdateUserState(userState);
                                return await data.sendText(true, menuTexts[MenuLevel.MAIN])
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