import { logarAudioBooksController } from './logarAudioBooksController';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getRandomString } from '../util/getRandomString';
import { readJSON } from '../util/jsonConverte';
import { Result } from '../type/result';
import path from 'path';
require('dotenv').config();

interface UserData {
  username: string;
  email: string;
  password: string;
  type: string;
  isActive: boolean;
  permissions: {
    download: boolean;
    update: boolean;
    delete: boolean;
    upload: boolean;
    accessAllLibraries: boolean;
    accessAllTags: boolean;
    selectedTagsNotAccessible: boolean;
    accessExplicitContent: boolean;
  };
  librariesAccessible: string[];
  itemTagsSelected: string[];
}


export const createLoginAudioBooksController = async (username: string, contato: string): Promise<Result> => {

  let result: Result = { result: false, msg: '' };
  const { user } = readJSON(path.join(__dirname, "..", "..", "cache", "audiobooks.json"));
  const password = getRandomString();

  const userData: UserData = {
    username,
    email: contato,
    password,
    type: "user",
    isActive: true,
    permissions: {
      download: false,
      update: false,
      delete: false,
      upload: false,
      accessAllLibraries: true,
      accessAllTags: true,
      selectedTagsNotAccessible: false,
      accessExplicitContent: true
    },
    librariesAccessible: [],
    itemTagsSelected: []
  }

  const options: AxiosRequestConfig = {
    headers: {
      "authorization": `Bearer ${user.token}`,
      "content-type": "application/json",
    }
  }

  try {
    const url = process.env.URL_AUDIOBOOKS_WEB;
    const res = await axios.post(`${url}/api/users`, userData, options);
    const { user } = res.data;
    result.result = true
    result.data = { username: user.username, password }
  } catch (error) {
    const message = error?.response?.data;
    if (message === "Unauthorized") {
      await logarAudioBooksController();
    } else if (message) {
      result.msg = message;
      console.error('Erro ao criar login no audiobooks, mensagem:', message);
    } else {
      result.msg = `Erro desconhecido ao criar login no audiobooks, mensagem: ${error.message}`;
      console.error('Erro desconhecido ao criar login no audiobooks, mensagem:', error.message);
    }
  }
  return result;
}