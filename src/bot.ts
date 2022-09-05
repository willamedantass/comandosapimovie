import { clearEmotionAndEspace, getBotData, getCommand, isCommand, readJSON } from "./function";
import { criarUser } from "./controller/userDBController";
import { Acesso, Question, User } from "./type/user";
import { general } from "./configuration/general";
import { conversation } from "./conversation";
import { connect } from "./connection";
import path from "path";
const pathUsers = path.join(__dirname, "..", "cache", "user.json");
const pathBlacklist = path.join(__dirname, "..", "cache", "blacklist.json");

export default async () => {
    const socket = await connect();
    socket.ev.on('messages.upsert', async (message) => {
        var [webMessage] = message.messages;     
        //ignorar mensagens de brodcast
        if (webMessage.key?.remoteJid === "status@broadcast") {
            return;
        }
        //Blacklist
        if (readJSON(pathBlacklist).includes(webMessage.key.remoteJid) && !webMessage.key.fromMe) {
            return;
        }

        let user: User = readJSON(pathUsers).find(value => value.remoteJid === webMessage.key.remoteJid)
        const { command, ...data } = getBotData(socket, webMessage, user);
        if (!webMessage.key.fromMe) {
            if (!user) {
                const userNew: User = {
                    nome : clearEmotionAndEspace(data.webMessage.pushName),
                    remoteJid : data.remoteJid,
                    dataCadastro : new Date().toISOString(),
                    conversation : true,
                    question : Question.Name,
                    acesso : Acesso.usuario,
                    idPgto: [],
                    credito : 0
                }
                await criarUser(userNew);
                await data.sendText(false, `Olá, seja bem vindo à *MOVNOW*.\n \nMeu nome é *${general.botName}* sou um assistente virtual, nesse primeiro momento siga as instruções para pesornalizar seu atendimento.`)
                await data.presenceTime(1000, 2000);
                await data.sendText(true,`Posso lhe chamar por *${userNew.nome}*?`);
            } else if (user?.conversation) {
                conversation(user, data);
            }
        }
        
        if (!isCommand(command)) return;

        if ((user && !user?.conversation) || webMessage.key.fromMe) {
            try {
                const action = await getCommand(command.replace(general.prefix, ""));
                await action({ command, ...data });
            } catch (error) {
                console.log('Log_bot: ' + error);
            }
        }
    });
};