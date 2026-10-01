export type WidgetMessageDirection = 'incoming' | 'outgoing';

export type WidgetMessageSendingStatus = 'sending' | 'sent' | 'error';

export type WidgetChatMessage = {
  id: string;
  chatId: string;
  text: string;
  timestamp: number;
  direction: WidgetMessageDirection;
  sendingStatus: WidgetMessageSendingStatus;
};

export type UseChatParams = {
  chatId: string;
  idInstance: string;
  apiTokenInstance: string;
};
