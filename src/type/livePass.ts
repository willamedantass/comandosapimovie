export interface livePass {
    id : string,
    username : string,
    password : string,
    vencimento : string,
    isTrial : boolean,
    isDelete: boolean,
    isUsed: boolean,
    countUsed: number
}