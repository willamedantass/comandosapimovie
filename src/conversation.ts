import { updateUser } from "./data/userDB";
import { Question, User } from "./type/user";
import { clearEmotionAndEspace } from "./function";
import { StringClean } from "./util/stringClean";

export const conversation = async (user: User, data) => {
    const resposta = StringClean(data.messageText);
    if (user.conversation) {
        switch (user.question) {
            case Question.Name:
                if (resposta === 'sim') {
                    if (user.nome.length > 10) {
                        user.question = Question.Info;
                        await updateUser(user);
                        await data.presenceTime(1000, 2000);
                        await data.sendText(true,`${user.nome} seu cadastro foi criado com sucesso!`)
                    } else {
                        user.question = Question.NewName;
                        await updateUser(user);
                        await data.presenceTime(1000, 1000);
                        await data.sendText(true, '❌ Seu nome esta curto, tente novamente!\nDigite seu nome e sobrenome:')
                    }
                } else if (resposta === 'nao') {
                    user.question = Question.NewName;
                    await updateUser(user);
                    await data.presenceTime(1000, 1000);
                    await data.sendText(true, 'Como posso lhe chamar?');
                } else {
                    await data.presenceTime(1000, 1000);
                    await data.sendText(true, 'Para continuar seu atendimento, porfavor responda sim ou não.');
                }
                break;
            case Question.NewName:
                user.nome = clearEmotionAndEspace(data.messageText);
                user.question = Question.Name;
                await updateUser(user);
                await data.presenceTime(1000, 1000);
                await data.sendText(true,`Posso lhe chamar por *${user.nome}*?`);
                break;
            default:
                break
        }

        if (user.question === Question.Info) {
            user.conversation = false;
            await updateUser(user);
            await data.presenceTime(3000, 7000);
            await data.sendText(true, `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n          📺 *MOVNOW* 📺 \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n✅Somos um servidor novo e com muito potêncial.\n✅Temos aplicativos para Smart, Android e IOS.\n✅Temos assistente virtual que irar agilizar nas tarefas de geração de teste, pagamento e renovação.\n✅Não fazemos devolução de pagamento, faça seu teste antes.`);
            await data.presenceTime(2000, 8000);
            await data.sendMenu(user.nome);
        }
    }
}