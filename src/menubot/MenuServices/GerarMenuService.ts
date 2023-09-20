import { Menu } from "../../type/menu";

export const GerarMenuService = (menus: Menu[]): string => {
    let menu_string = '';
    for (const menu of menus) {
        menu_string += `${menu.id} - ${menu.label}\n`
    }
    return menu_string;
}