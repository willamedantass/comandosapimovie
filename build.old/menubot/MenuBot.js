"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuTexts = exports.OpcoesMenuEntretenimento = exports.MenuEntretenimento = exports.OpcoesMenuMain = exports.MenuMain = exports.MenuLevel = void 0;
const GerarMenuService_1 = require("./MenuServices/GerarMenuService");
var MenuLevel;
(function (MenuLevel) {
    MenuLevel[MenuLevel["MAIN"] = 0] = "MAIN";
    MenuLevel[MenuLevel["MENU_ENTRETENIMENTO"] = 1] = "MENU_ENTRETENIMENTO";
})(MenuLevel = exports.MenuLevel || (exports.MenuLevel = {}));
var MenuMain;
(function (MenuMain) {
    MenuMain[MenuMain["CriarLogin"] = 0] = "CriarLogin";
    MenuMain[MenuMain["AtivarRenovar"] = 1] = "AtivarRenovar";
    MenuMain[MenuMain["PixCopiaCola"] = 2] = "PixCopiaCola";
    MenuMain[MenuMain["Detalhes"] = 3] = "Detalhes";
    MenuMain[MenuMain["Entretenimento"] = 4] = "Entretenimento";
})(MenuMain = exports.MenuMain || (exports.MenuMain = {}));
exports.OpcoesMenuMain = [
    { id: '1', label: 'Criar Login', enum: MenuMain.CriarLogin },
    { id: '2', label: 'Ativar/Renovar', enum: MenuMain.AtivarRenovar },
    { id: '3', label: 'Pix Cópia e Cola', enum: MenuMain.PixCopiaCola },
    { id: '4', label: 'Detalhes do Login', enum: MenuMain.Detalhes },
    { id: '5', label: 'Entretenimento', enum: MenuMain.Entretenimento }
];
var MenuEntretenimento;
(function (MenuEntretenimento) {
    MenuEntretenimento[MenuEntretenimento["JogosDeHoje"] = 0] = "JogosDeHoje";
    MenuEntretenimento[MenuEntretenimento["Cinemas"] = 1] = "Cinemas";
    MenuEntretenimento[MenuEntretenimento["Voltar"] = 2] = "Voltar";
})(MenuEntretenimento = exports.MenuEntretenimento || (exports.MenuEntretenimento = {}));
exports.OpcoesMenuEntretenimento = [
    { id: '1', label: 'Jogos Do Dia', enum: MenuEntretenimento.JogosDeHoje },
    { id: '2', label: 'Cinemas Fortaleza', enum: MenuEntretenimento.Cinemas },
    { id: '3', label: 'Voltar', enum: MenuEntretenimento.Voltar }
];
exports.menuTexts = {
    [MenuLevel.MAIN]: `*MENU PRINCIPAL*\n${(0, GerarMenuService_1.GerarMenuService)(exports.OpcoesMenuMain)}`,
    [MenuLevel.MENU_ENTRETENIMENTO]: `*MENU ENTRETENIMENTO*\n${(0, GerarMenuService_1.GerarMenuService)(exports.OpcoesMenuEntretenimento)}`
};
