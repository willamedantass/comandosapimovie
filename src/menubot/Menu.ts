export enum MenuLevel {
    MAIN,
    SUBMENU_RENOVACAO,
    MENU_CADASTRA_LOGIN
}

export enum MenuMain {
    CriarLogin,
    AtivarRenovar,
    PixCopiaCola,
    Detalhes,
}

export const opcoesMenuMain = {
    '1': MenuMain.CriarLogin,
    '2': MenuMain.AtivarRenovar,
    '3': MenuMain.PixCopiaCola,
    '4': MenuMain.Detalhes,
};

export const menuTexts = {
    [MenuLevel.MAIN]: `*MENU PRINCIPAL*\n${MenuMain.CriarLogin + 1} - Criar Login\n${MenuMain.AtivarRenovar + 1} - Ativar/Renovar\n${MenuMain.PixCopiaCola + 1} - Pix Cópia e Cola\n${MenuMain.Detalhes + 1} - Detalhes do Login`,
    [MenuLevel.SUBMENU_RENOVACAO]: `
    //     Submenu 1:
    //     A. Opção A
    //     B. Opção B
    //     Voltar: Digite 'voltar'
    // `,
    // Adicione mais textos para outros submenus
}