export const getRandomString = (): string => {
    let characters = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
    let charactersLength = characters.length;
    let randomuser = "";
    for (let i = 0; i < 7; i++) {
        randomuser += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return randomuser;
}