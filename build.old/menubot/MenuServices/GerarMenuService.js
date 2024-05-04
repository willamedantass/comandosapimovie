"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GerarMenuService = void 0;
const GerarMenuService = (menus) => {
    let menu_string = '';
    for (const menu of menus) {
        menu_string += `${menu.id} - ${menu.label}\n`;
    }
    return menu_string;
};
exports.GerarMenuService = GerarMenuService;
