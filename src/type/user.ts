export interface User {
    id: string;
    nome: string;
    data_cadastro: string;
    remoteJid: string;
    pgtos_id: number[];
    cadastro: boolean;
    question: Question;
    acesso: Acesso;
    credito: number;
    valor?: string;
    data_teste?: string;
    data_pix: string;
    limite_pix: number;
    vencimento?: string;
    logins?: string[];
}

export enum Question {
    Name = 'nome',
    NewName = 'novoNome',
    Operadora = 'operadora',
    Info = 'info'
}

export enum Acesso {
    adm = 'adm',
    revenda = 'revenda',
    usuario = 'usuario'
}