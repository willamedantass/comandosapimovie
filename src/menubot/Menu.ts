export enum MenuLevel {
    MAIN,
    MENU_CADASTRA_LOGIN
}

export enum MenuMain {
    CriarTeste = '1',
    CriarLogin = '2',
    Renovar = '3',
    PixCopiaCola = '4',
    Informacoes = '5',
}

export const menuTexts = {
    [MenuLevel.MAIN]: '*MENU PRINCIPAL*\n1 - Criar Teste\n2 - Ativar/Renovar\n3 - Pix Cópia e Cola\n4 - Informações',
    // [MenuLevel.SUBMENU_1]: `
    //     Submenu 1:
    //     A. Opção A
    //     B. Opção B
    //     Voltar: Digite 'voltar'
    // `,
    // Adicione mais textos para outros submenus
}