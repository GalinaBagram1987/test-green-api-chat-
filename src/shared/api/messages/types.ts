/**
 * Type for sending a message
 */

export type SendMessageData = {
  chatId: string;
  message: string;
};

export type SendMessageResponse = {
  idMessage: string;
};

/**
 * Types for receiving messages
 */

export type ReceiveMessageParams = {
  idInstance: string;
  apiTokenInstance: string;
  receiveTimeout?: number;
  signal?: AbortSignal;
};

export type SenderData = {
  chatId: string;
  chatName?: string;
  sender: string;
  senderName?: string;
  senderContactName?: string;
};

export type TextMessageData = {
  textMessage: string;
};

export type ExtendedTextMessageData = {
  text: string;
  description?: string;
  title?: string;
  previewType?: string;
  jpegThumbnail?: string;
};

export type MessageData = {
  typeMessage: string;
  textMessageData?: TextMessageData;
  extendedTextMessageData?: ExtendedTextMessageData;

  // Для остальных типов сообщений
  [key: string]: unknown;
};

export type MessageBody = {
  typeWebhook: string;

  instanceData?: {
    idInstance: number;
    wid: string;
    typeInstance: string;
  };

  timestamp?: number;
  idMessage?: string;
  senderData?: SenderData;
  messageData?: MessageData;

  [key: string]: unknown;
};

export type ReceiveMessageResponse = {
  receiptId: number;
  body: MessageBody;
};

export type ReceiveMessageResult = ReceiveMessageResponse | null;

export type DeleteMessageParams = {
  idInstance: string;
  apiTokenInstance: string;
  receiptId: number;
};

export type DeleteMessageResponse = {
  result: boolean;
};
