import { clearEmotionAndEspace, getBotData, getCommand, isCommand, readJSON } from "./function";
import { criarUser } from "./data/userDB";
import { Acesso, Question, User } from "./type/user";
import { general } from "./configuration/general";
import { conversation } from "./conversation";
import { connect } from "./connection";
import path from "path";
const pathUsers = path.join(__dirname, "..", "cache", "user.json");
const pathBlacklist = path.join(__dirname, "..", "cache", "blacklist.json");

export default async () => {
    const socket = await connect();

    socket.ev.process(
        // events is a map for event name => event data
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
                        if (!msg.key.fromMe) {
                            if (!user) {
                                const userNew: User = {
                                    nome: clearEmotionAndEspace(data.webMessage.pushName || ''),
                                    remoteJid: data.remoteJid,
                                    dataCadastro: new Date().toISOString(),
                                    conversation: true,
                                    question: Question.Name,
                                    acesso: Acesso.usuario,
                                    idPgto: [],
                                    credito: 0
                                }
                                await criarUser(userNew);
                                await data.sendText(false, `Olá, seja bem vindo à *MOVNOW*.\n \nMeu nome é *${general.botName}* sou um assistente virtual, nesse primeiro momento siga as instruções para pesornalizar seu atendimento.`)
                                await data.presenceTime(1000, 2000);
                                await data.sendText(true, `Posso lhe chamar por *${userNew.nome}*?`);
                            } else if (user?.conversation) {
                                conversation(user, data);
                            }
                        }

                        if (!isCommand(command)) return;

                        if ((user && !user?.conversation) || msg.key.fromMe) {
                            try {
                                const action = await getCommand(command.replace(general.prefix, ""));
                                await action({ command, ...data });
                            } catch (error) {
                                console.log('Log_bot: ' + error);
                            }
                        }

                    }
                }
            }
        }
    )

    // socket.ev.on('messages.upsert', async (message) => {
    // });
};