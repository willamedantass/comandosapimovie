export type User = {
    nome: string;
    dataCadastro: string;
    dataVencimento?: string;
    remoteJid: string;
    dataTeste?: string;
    dataPix?: string;
    idPgto: number[];
    logins?: string[];
    conversation: boolean;
    question: Question;
    acesso: Acesso;
    credito: number;
}

export enum Question {
    Name = 'nome',
    NewName = 'novoNome',
    Operadora = 'operadora',
    Info = 'info'
}

export enum Acesso {
    revenda = 'revenda',
    usuario = 'usuario'
}