export declare type Login = {
    id: string;
    uid: string;
    user: string;
    password: string;
    dataCadastro: string;
    vencimento: string;
    isLive: boolean;
    isTrial: boolean;
    contato?: string;
    data_msg_vencimento?: string;
    isClubtv?: boolean;
    conexoes?: string;
    remoteIp?: string;
    dataRemote?: string;
    countForbiddenAccess?: number;
    vencLong?: string;
    isAdult?: boolean;
    status?: string;
};
export declare enum LoginTituloType {
    teste = "teste",
    info = "info",
    login = "login",
    renovacao = "renovacao"
}
