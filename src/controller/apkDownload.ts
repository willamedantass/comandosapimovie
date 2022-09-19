import path from 'path';

export const apkDownload = async (req, res) => {
    const apk = path.join(__dirname, "..", "..", "cache", "smarterstvbox.apk");
    res.download(apk);
}