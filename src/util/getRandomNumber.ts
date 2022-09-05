export const getRandomNumber = (): string => {
    let min = Math.ceil(10000);
    let max = Math.floor(99999);
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
}