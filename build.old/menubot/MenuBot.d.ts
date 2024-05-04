import { Menu } from "../type/menu";
export declare enum MenuLevel {
    MAIN = 0,
    MENU_ENTRETENIMENTO = 1
}
export declare enum MenuMain {
    CriarLogin = 0,
    AtivarRenovar = 1,
    PixCopiaCola = 2,
    Detalhes = 3,
    Entretenimento = 4
}
export declare const OpcoesMenuMain: Menu[];
export declare enum MenuEntretenimento {
    JogosDeHoje = 0,
    Cinemas = 1,
    Voltar = 2
}
export declare const OpcoesMenuEntretenimento: Menu[];
export declare const menuTexts: {
    0: string;
    1: string;
};
