export type Login = {
    id?: string,
    uid: string,
    user: string,
    password: string,
    dataCadastro: string,
    vencimento: string,
    isLive: boolean;
    contato?: string;
    data_msg_vencimento?: string;
    isClubtv?: boolean,
    conexoes?: string,
    remoteIp?: string,
    dataRemote?: string,
    countForbiddenAccess?: number,
    vencLong?: string,
    isTrial?: boolean;
    isAdult?: boolean,
    status?: string,
}

export enum LoginTituloType {
    teste = 'teste',
    info = 'info',
    login = 'login'

}