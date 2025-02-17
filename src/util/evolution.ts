import axios from "axios";
import { general } from "../configuration/general";
require('dotenv').config();

interface RequestParams {
  endpoint: string;
  payload: Record<string, any>;
}

export interface PresenceParams {
  presence: "unavailable" | "available" | "composing" | "recording" | "paused";
}

const baseurl = process.env.BASEURL_EVOLUTION;
const instance = process.env.INSTANCE_EVOLUTION;
const apikey = process.env.APIKEY_EVOLUTION || "";

if (!baseurl || !instance || !apikey) {
  throw new Error("As variáveis de ambiente BASEURL_EVOLUTION, INSTANCE_EVOLUTION e APIKEY_EVOLUTION devem estar definidas.");
}

const makeRequest = async ({ endpoint, payload }: RequestParams): Promise<any> => {
  try {
    const url = `${baseurl}${endpoint}/${instance}`;
    const headers = { apikey };

    const response = await axios.post(url, payload, { headers });

    console.log(`Mensagem enviada para ${payload?.number} com status ${response?.status}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao enviar mensagem: ${endpoint}:`, error.code);
    throw error;
  }
};

export const sendText = async (number: string, texto: string, isAssinar: boolean, quotedMessageId?: string): Promise<void> => {
  const assinatura = isAssinar ? `${general.prefixEmoji} *${general.botName}* \n\n` : "";
  const text = `${assinatura}${texto}`;
  const payload: Record<string, any> = { number, text };

  // Adiciona a citação da mensagem, se o ID da mensagem citada for fornecido
  if (quotedMessageId) {
    payload.quoted = { key: { id: quotedMessageId } };
  }

  await sendPresence("composing", number, 500);

  await makeRequest({
    endpoint: "/message/sendText",
    payload,
  });
};

export const sendImage = async (number: string, imageUrl: string, caption?: string): Promise<void> => {
  const mediatype = "image";
  const mimetype = "image/png";
  const fileName = "Imagem.png";
  await makeRequest({
    endpoint: "/message/sendMedia",
    payload: { number, mediatype, mimetype, imageUrl, caption, fileName }
  });
};

export const sendDocument = async (number: string, documentUrl: string, fileName: string): Promise<void> => {
  await makeRequest({
    endpoint: "/message/sendDocument",
    payload: { number, documentUrl, fileName }
  });
};

export const sendPresence = async (presence: "unavailable" | "available" | "composing" | "recording" | "paused", number: string, delay: number): Promise<void> => {
  await makeRequest({
    endpoint: "/chat/sendPresence",
    payload: { presence, number, delay }
  });
};

export const readMessages = async (messages: { remoteJid: string; fromMe: boolean; id: string }[]): Promise<void> => {
  await makeRequest({
    endpoint: "/chat/markMessageAsRead",
    payload: { readMessages: messages }
  });
};
