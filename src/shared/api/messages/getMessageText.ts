import type { MessageBody } from './types';

export const getMessageText = (body: MessageBody): string | null => {
  const messageData = body.messageData;

  if (!messageData) {
    return null;
  }

  if (messageData.typeMessage === 'textMessage') {
    return messageData.textMessageData?.textMessage ?? null;
  }

  if (messageData.typeMessage === 'extendedTextMessage') {
    return messageData.extendedTextMessageData?.text ?? null;
  }

  return null;
};
