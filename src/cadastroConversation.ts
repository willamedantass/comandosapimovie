import { ClearEmotionAndEspace, StringClean } from "./util/stringClean";
import { mensagem } from "./util/jsonConverte";
import { Question, User } from "./type/user";
import { updateUser } from "./data/userDB";

export const CadastroConversation = async (user: User, data: any) => {
    const resposta = StringClean(data.messageText);
    if (user.cadastro) {
        switch (user.question) {
            case Question.Name:
                if (resposta === 'sim') {
                    if (user.nome.length > 7) {
                        user.question = Question.Info;
                        updateUser(user);
                        await data.presenceTime(1000, 2000);
                        await data.sendText(true,`Concluído, *${user.nome}* seu cadastro foi criado!`);
                    } else {
                        user.question = Question.NewName;
                        updateUser(user);
                        await data.presenceTime(1000, 1000);
                        await data.sendText(true, '❌ Seu nome está curto, tente novamente!\n\nDigite seu nome e sobrenome:')
                    }
                } else if (resposta === 'nao') {
                    user.question = Question.NewName;
                    updateUser(user);
                    await data.presenceTime(1000, 1000);
                    await data.sendText(true, 'Como posso lhe chamar?\nDigite seu nome e sobrenome por favor.');
                } else {
                    await data.presenceTime(1000, 1000);
                    await data.sendText(true, 'Para continuar seu atendimento, por favor responda sim ou não.');
                }
                break;
            case Question.NewName:
                user.nome = ClearEmotionAndEspace(data.messageText);
                user.question = Question.Name;
                updateUser(user);
                await data.presenceTime(1000, 1000);
                await data.sendText(true,`Posso lhe chamar por *${user.nome}*?\nDigite sim ou não.`);
                break;
            default:
                break
        }

        if (user.question === Question.Info) {
            user.cadastro = false;
            updateUser(user);
            await data.presenceTime(3000, 7000);
            await data.sendText(false, `▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n          📺 *MOVNOW* 📺 \n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n✅Temos um servidor com muito potêncial.\n✅Temos aplicativos para SmartTv, Android e IOS.\n✅Temos assistente virtual que irar agilizar nas tarefas de geração de teste, pagamento e renovação.\n✅Não fazemos devolução de pagamento, faça seu teste antes.`);
            await data.presenceTime(2000, 8000);
            await data.sendText(true, mensagem('info_menu'));
        }
    }
}