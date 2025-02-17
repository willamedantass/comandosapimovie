import { extractCommandAndArgs } from "../function";

interface DeviceListMetadata {
    senderTimestamp: string;
    recipientKeyHash: string;
    recipientTimestamp: string;
}

interface MessageContextInfo {
    deviceListMetadata: DeviceListMetadata;
    deviceListMetadataVersion: number;
    messageSecret: string;
}

interface Key {
    remoteJid: string;
    fromMe: boolean;
    id: string;
}

interface Data {
    key: Key;
    pushName: string;
    status: string;
    message: {
        conversation: string;
        messageContextInfo: MessageContextInfo;
    };
    messageType: string;
    messageTimestamp: number;
    instanceId: string;
    source: string;
}

export interface WhatsAppEvent {
    event: string;
    instance: string;
    data: Data;
    destination: string;
    date_time: string;
    sender: string;
    server_url: string;
    apikey: string;
}

export interface ConvertWhatsAppEvent {
    event: string;
    instance: string;
    pushName: string;
    status: string;
    conversation: string;
    messageType: string;
    messageTimestamp: number;
    instanceId: string;
    source: string;
    destination: string;
    date_time: string;
    sender: string;
    server_url: string;
    apikey: string;
    remoteJid: string;
    owner: boolean;
    id: string;
    senderTimestamp: string;
    recipientKeyHash: string;
    recipientTimestamp: string;
    deviceListMetadataVersion: number;
    messageSecret: string;
    args: string,
    command: string
  }
  

export const convertWhatsAppEvent = (event: WhatsAppEvent): ConvertWhatsAppEvent => {
    const { command, args } = extractCommandAndArgs(event.data.message.conversation);
    return {
        event: event.event,
        instance: event.instance,
        pushName: event.data.pushName,
        status: event.data.status,
        conversation: event.data.message.conversation,
        messageType: event.data.messageType,
        messageTimestamp: event.data.messageTimestamp,
        instanceId: event.data.instanceId,
        source: event.data.source,
        destination: event.destination,
        date_time: event.date_time,
        sender: event.sender,
        server_url: event.server_url,
        apikey: event.apikey,
        remoteJid: event.data.key.remoteJid,
        owner: event.data.key.fromMe,
        id: event.data.key.id,
        senderTimestamp: event.data.message.messageContextInfo.deviceListMetadata.senderTimestamp,
        recipientKeyHash: event.data.message.messageContextInfo.deviceListMetadata.recipientKeyHash,
        recipientTimestamp: event.data.message.messageContextInfo.deviceListMetadata.recipientTimestamp,
        deviceListMetadataVersion: event.data.message.messageContextInfo.deviceListMetadataVersion,
        messageSecret: event.data.message.messageContextInfo.messageSecret,
        args: args,
        command: command
    };
};
