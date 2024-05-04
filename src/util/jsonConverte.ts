import fs, { PathLike } from 'fs'

export const readJSON = (pathFileJson: PathLike) => {
    if (fs.existsSync(pathFileJson)) {
        let file: any;
        const fileContents = fs.readFileSync(pathFileJson, 'utf-8');
        if (fileContents.trim() !== '') {
            file = JSON.parse(fileContents);
        } else {
            file = [];
        }
        return file;
    }
    return [];
};

export const readObject = (pathFileJson: PathLike) => {
    if (fs.existsSync(pathFileJson)) {
        let file: any;
        const fileContents = fs.readFileSync(pathFileJson, 'utf-8');
        if (fileContents.trim() !== '') {
            file = JSON.parse(fileContents);
        } else {
            file = {}
        }
        return file;
    }
    return {};
}

export const writeJSON = (pathFileJson: string, data: object) => {
    fs.writeFileSync(pathFileJson, JSON.stringify(data));
}