import { GerarMenuService } from "./MenuServices/GerarMenuService";
import { Menu } from "../type/menu";

export enum MenuLevel {
    MAIN,
    MENU_ENTRETENIMENTO
}

export enum MenuMain {
    CriarLogin,
    AtivarRenovar,
    PixCopiaCola,
    Detalhes,
    Entretenimento
}

export const OpcoesMenuMain: Menu[] = [
    { id: '1', label: 'Criar Login', enum: MenuMain.CriarLogin },
    { id: '2', label: 'Ativar/Renovar', enum: MenuMain.AtivarRenovar },
    { id: '3', label: 'Pix Cópia e Cola', enum: MenuMain.PixCopiaCola },
    { id: '4', label: 'Detalhes do Login', enum: MenuMain.Detalhes },
    { id: '5', label: 'Entretenimento', enum: MenuMain.Entretenimento }
];


export enum MenuEntretenimento {
    JogosDeHoje,
    Cinemas,
    Voltar
}

export const OpcoesMenuEntretenimento: Menu[] = [
    { id: '1', label: 'Jogos Do Dia', enum: MenuEntretenimento.JogosDeHoje },
    { id: '2', label: 'Cinemas Fortaleza', enum: MenuEntretenimento.Cinemas },
    { id: '3', label: 'Voltar', enum: MenuEntretenimento.Voltar }
]

export const menuTexts = {
    [MenuLevel.MAIN]: `*MENU PRINCIPAL*\n${GerarMenuService(OpcoesMenuMain)}`,
    [MenuLevel.MENU_ENTRETENIMENTO]: `*MENU ENTRETENIMENTO*\n${GerarMenuService(OpcoesMenuEntretenimento)}`
}