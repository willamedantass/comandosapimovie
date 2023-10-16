import { allLogins, criarLogin } from "./data/loginDB";
import { allUser, createUser } from "./data/userDB";
import { User } from "./type/user";

(async function iniciar() {
    const users = allUser();
    console.log('User: '+users.length);
    
    const logins = allLogins();
    console.log('Logins: '+logins.length);
    type ids = {
        idAntigo: string,
        idNovo: string,
    }

    const usersId: ids[] = [];

    for(let usr of users){
        const user: User = {
            id: usr.id,
            nome: usr.nome,
            remoteJid: usr.remoteJid,
            acesso: usr.acesso,
            credito: usr.credito,
            data_cadastro: usr.data_cadastro || usr['dataCadastro'] || new Date().toISOString(),
            data_pix: usr.data_pix || '',
            isCadastrando: usr['cadastro'] || false,
            limite_pix: usr.limite_pix || 0,
            pgtos_id: usr.pgtos_id || [],
            data_teste: usr?.data_teste || '',
            valor: usr?.valor || '30',
            vencimento: usr?.vencimento || ''
        }

        const id = await createUser(user) as string;
        usersId.push({ idAntigo: usr.id, idNovo: id });
        console.log(`User criado ---> ${user.nome}`);
    }

    for(let login of logins){
        if(login.uid.length){
            const id = usersId.find(value => value.idAntigo === login.uid);
            login.uid = id?.idNovo || ''
            console.log(`Trocando id: ${id?.idAntigo} para ${id?.idNovo}`);
        }
        await criarLogin(login);
        console.log(`Login criado ---> ${login.user}`);
    }
    
})();

