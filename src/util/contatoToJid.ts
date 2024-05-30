export const contatoClean = (contato: string): string => {
    if (contato.startsWith('+55')) {
        contato = contato.replace('+55', '');
    }
    return contato.replace(/[\s-]/g, '');

}