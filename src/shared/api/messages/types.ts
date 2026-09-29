export type SendMessageData = {
  chatId: string;
  message: string;
};

export type SendMessageResponse = {
  idMessage: string;
};

export type ReceiveNotificationResponse = {
  receiptId: number;
  body: {
    typeWebhook: 'incomingMessageReceived';
    instanceData: {
      idInstance: number;
      wid: string;
      typeInstance: string;
    };
    timestamp: number;
    idMessage: string;
    senderData: {
      chatId: string;
      chatName: string;
      chatType: 'user';
      sender: string;
      senderName: string;
      senderType: 'user';
      senderContactName?: string;
      senderPhoneNumber?: number;
    };
    messageData: {
      typeMessage: 'textMessage';
      textMessageData: {
        textMessage: string;
      };
    };
  };
} | null;
