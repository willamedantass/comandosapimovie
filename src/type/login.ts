export type Login = {
    id? : string,
    uid : string,
    user : string,
    password : string,
    conexoes? : string,
    dataCadastro: string,
    vencimento : string,
    vencLong?: string,
    live: boolean;
    isTrial?: boolean;
    status? : string,
    actionRenovar? : string,
    actionDesbloqueioConfianca? : string,
    actionResetar? : string,
    actionMigrarCodigo? : string,
    actionMigrarP2p? : string,
    actionOnOff? : string
}

export enum LoginTituloType {
    teste = 'teste',
    info = 'info',
    login = 'login'    

}