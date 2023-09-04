import fs, { PathLike } from 'fs'
import path from 'path';

export const readJSON = (pathFileJson: PathLike) => {
    if (fs.existsSync(pathFileJson)) {
        let file: any;
        const fileContents = fs.readFileSync(pathFileJson, 'utf-8');
        if (fileContents.trim() !== '') {
            file = JSON.parse(fileContents);
        } else {
            file = []
        }
        return file;
    }
    return [];
};

export const mensagem = (key: string): string => {
    const pathFileJson = path.join(__dirname, '..', '..', 'cache', 'mensagens.json');
    const mensagens = JSON.parse(fs.readFileSync(pathFileJson, 'utf-8'));
    return mensagens[key];
};

export const writeJSON = (pathFileJson: string, data: object) => {
    fs.writeFileSync(pathFileJson, JSON.stringify(data));
};