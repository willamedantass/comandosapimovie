import axios, { AxiosResponse } from 'axios';
import { writeJSON } from '../util/jsonConverte';
import path from 'path';
require('dotenv').config();

interface LoginData {
  username: string;
  password: string;
}

export const logarAudioBooksController = async () => {

  const url = process.env.URL_AUDIOBOOKS_WEB;
  const username = process.env.LOGIN_AUDIOBOOK_USUARIO;
  const password = process.env.LOGIN_AUDIOBOOK_SENHA;

  if (url && username && password) {
    const data: LoginData = {
      username,
      password
    }

    await axios.post(`${url}/login`, data)
      .then((response: AxiosResponse) => {
        writeJSON(path.join(__dirname, "..", "..", "cache", "audiobooks.json"), response.data);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  } else {
    throw new Error('Error ao obter dados de login para audiobook, defina as variáveis no arquivo env.');
  }
}
