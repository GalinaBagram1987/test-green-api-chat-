/**
 * type for send message
 */

export type SendMessageData = {
  chatId: string;
  message: string;
};

export type SendMessageResponse = {
  idMessage: string;
};

/**
 * types for input message
 */

export type ReceiveNotificationParams = {
  idInstance: string;
  apiTokenInstance: string;
  receiveTimeout?: number;
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

export type NotificationBody = {
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

export type ReceiveNotificationResponse = {
  receiptId: number;
  body: NotificationBody;
};

export type DeleteNotificationParams = {
  idInstance: string;
  apiTokenInstance: string;
  receiptId: number;
};

export type DeleteNotificationResponse = {
  result: boolean;
};

// export type ReceiveNotificationResponse = {
//   receiptId: number;
//   body: {
//     typeWebhook: 'incomingMessageReceived';
//     instanceData: {
//       idInstance: number;
//       wid: string;
//       typeInstance: string;
//     };
//     timestamp: number;
//     idMessage: string;
//     senderData: {
//       chatId: string;
//       chatName: string;
//       chatType: 'user';
//       sender: string;
//       senderName: string;
//       senderType: 'user';
//       senderContactName?: string;
//       senderPhoneNumber?: number;
//     };
//     messageData: {
//       typeMessage: 'textMessage';
//       textMessageData: {
//         textMessage: string;
//       };
//     };
//   };
// } | null;
