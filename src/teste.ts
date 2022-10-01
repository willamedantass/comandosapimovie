import axios, { Axios } from 'axios';
import path from 'path';

const deleteFile = async (fileId: string) =>{
    const GOOGLE_DRIVE_API_FOLDER_ID = '1fuKLYMLED86rYFG4MBX_18EUcvSdgoge';
    const { GoogleAuth } = require('google-auth-library');
    const { google } = require('googleapis');

    try {
        const auth = new GoogleAuth({
            keyFile: path.join(__dirname, "..", "cache", "googledrive.json"),
            scopes: 'https://www.googleapis.com/auth/drive'
        });

        const service = google.drive({
            version: 'v3',
            auth
        });

        const response = await service.files.delete({
            fileId: fileId
        });

        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
}

const uploadGoogleDrive = async (stream) => {
    const GOOGLE_DRIVE_API_FOLDER_ID = '1fuKLYMLED86rYFG4MBX_18EUcvSdgoge';
    const { GoogleAuth } = require('google-auth-library');
    const { google } = require('googleapis');

    try {
        const auth = new GoogleAuth({
            keyFile: path.join(__dirname, "..", "cache", "googledrive.json"),
            scopes: 'https://www.googleapis.com/auth/drive'
        });

        const service = google.drive({
            version: 'v3',
            auth
        });

        const fileMetadata = {
            name: 'deucerto.jpg',
            parents: [GOOGLE_DRIVE_API_FOLDER_ID]
        }

        const media = {
            mimeType: 'image/jpg',
            body: stream
            //fs.createReadStream(path.join(__dirname, "..", "cache", "somic.jpg"))
        }

        const response = await service.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        });

        console.log(response.data.id);

    } catch (error) {
        console.log(error);
    }
}

const downloadPhotos = async (url: string) => {
    const sharp = require('sharp');
    const { Readable } = require('stream');

    const { data } = await axios.get(url, {
        responseType: "arraybuffer",
    });

    const image = Buffer.from(data, "base64");
    const buffer = await sharp(image).jpeg().toBuffer();
    const stream = Readable.from(buffer);

    uploadGoogleDrive(stream);

}

//deleteFile('1UOqzDZh3szqZdKmD6iyMJCqKGlUobjnl')
//downloadPhotos('https://http2.mlstatic.com/D_NQ_NP_974500-MLB51046212485_082022-F.webp')