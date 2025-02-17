import { ClearEmotionAndEspace } from "./util/stringClean";
import { ConvertWhatsAppEvent } from "./type/WhatsAppEvent";
import { userUpdate } from "./data/user.service";
import { sendText } from "./util/evolution";
import { IUser } from "./type/user.model";
import NodeCache from 'node-cache';

type UserState = {
    remoteJid: string;
    question: 'name' | 'newName' | 'info';
    nome: string;
}

const userStateCache = new NodeCache({ stdTTL: 15 * 60 }); // TTL de 15 minutos
const negativeResponses = new Set(['nao', 'não', 'naum', 'n']);
const affirmativeResponses = new Set(['sim', 'claro', 'yes', 's']);

export const CadastroUser = async (user: IUser, mData: ConvertWhatsAppEvent) => {
    const resposta = mData.conversation.trim().toLowerCase();
    const userState = userStateCache.get<UserState>(user.remoteJid);

    try {
        if (userState) {
            switch (userState.question) {
                case 'name':
                    await handleNameQuestion(user, resposta, userState);
                    break;
                case 'newName':
                    await handleNewNameQuestion(user, mData, resposta, userState);
                    break;
                default:
                    throw new Error(`Tipo de pergunta não tratado: ${userState.question}`);
            }
        } else {
            await startUserRegistration(user, mData);
        }
    } catch (error) {
        console.error('Erro no cadastro do usuário:', error.message);
    }
}

const handleNameQuestion = async (user: IUser, resposta: string, userState: UserState) => {
    try {
        if (affirmativeResponses.has(resposta)) {
            if (isValidName(userState.nome)) {
                userState.question = 'info';
                user.isCadastrando = false;
                user.nome = userState.nome;
                await userUpdate(user);
                userStateCache.set(user.remoteJid, userState);

                await sendText(user.remoteJid, `Concluído, *${userState.nome}* seu cadastro foi criado!`, false);
                await finalizeRegistration(userState.remoteJid);
            } else {
                await askForNewName(user.remoteJid, userState);
            }
        } else if (negativeResponses.has(resposta)) {
            await askForNewName(user.remoteJid, userState);
        } else {
            await sendText(user.remoteJid, `Não consegui identificar sua resposta, posso lhe chamar por *${userState.nome}*? Digite sim ou não.`, true);
        }
    } catch (error) {
        throw new Error(`Erro ao processar a pergunta sobre o nome: ${error.message}`);
    }
}

const handleNewNameQuestion = async (user: IUser, data: any, resposta: string, userState: UserState) => {
    try {
        const nome = ClearEmotionAndEspace(resposta);
        userState.nome = capitalizeName(nome);
        userState.question = 'name';
        userStateCache.set(user.remoteJid, userState);
        await sendText(user.remoteJid, `Posso lhe chamar por *${userState.nome}*? Digite sim ou não.`, true);
    } catch (error) {
        throw new Error(`Erro ao processar a nova pergunta de nome: ${error.message}`);
    }
}

const startUserRegistration = async (user: IUser, mData: ConvertWhatsAppEvent) => {
    try {
        const newUserState: UserState = {
            remoteJid: user.remoteJid,
            question: 'newName',
            nome: user.nome
        };
        userStateCache.set(user.remoteJid, newUserState);

        await sendText(user.remoteJid, 'Vejo que é novo por aqui, vamos fazer seu cadastro para personalizar seu atendimento.', true);
        await sendText(user.remoteJid, 'Como posso lhe chamar? Digite seu nome e sobrenome por favor.', true);
    } catch (error) {
        throw new Error(`Erro ao iniciar o cadastro do usuário: ${error.message}`);
    }
}

const isValidName = (nome: string): boolean => {
    return nome.length > 7 && nome.split(" ").length > 1;
}

const askForNewName = async (remoteJid: string, userState: UserState) => {
    try {
        userState.question = 'newName';
        userStateCache.set(userState.remoteJid, userState);
        await sendText(remoteJid, 'Digite seu nome e sobrenome:', true);
    } catch (error) {
        throw new Error(`Erro ao solicitar um novo nome: ${error.message}`);
    }
}

const finalizeRegistration = async (remoteJid: string) => {
    try {
        userStateCache.del(remoteJid);
        await sendText(remoteJid, '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n         📺🌟 *MOVNOW* 🌟📺 \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n✅Temos um servidor com muito potencial.\n✅Temos aplicativos para Smart xTv, Android e IOS.\n✅Temos assistente virtual que irá realizar as tarefas de geração de login, pagamento e renovação.\n✅Não fazemos devolução de pagamento, faça seu teste primeiro.', false);
    } catch (error) {
        throw new Error(`Erro ao finalizar o registro: ${error.message}`);
    }
}

const capitalizeName = (nome: string): string => {
    return nome.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}