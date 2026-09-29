export type MessageDirection = 'incoming' | 'outgoing';

export type ChatMessage = {
  id: string;
  chatId: string;
  text: string;
  timestamp: number;
  direction: 'incoming' | 'outgoing';
};

export type UseChatParams = {
  chatId: string;
  idInstance: string;
  apiTokenInstance: string;
};
