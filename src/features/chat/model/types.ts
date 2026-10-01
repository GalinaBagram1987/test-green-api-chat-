export type ChatStatus = 'idle' | 'loading' | 'success' | 'error';

export type MessageDirection = 'incoming' | 'outgoing';

export type MessageSendingStatus = 'sending' | 'sent' | 'error';

export interface ChatMessage {
  id: string;
  text: string;
  timestamp: number;
  direction: MessageDirection;
  sendingStatus: MessageSendingStatus;
}

export interface ChatState {
  phoneNumber: string;
  chatId: string;
  messages: ChatMessage[];

  status: ChatStatus;
  isSending: boolean;
  error: string | null;

  setChat: (phoneNumber: string) => void;

  startChat: (phoneNumber: string, firstMessage?: string) => Promise<boolean>;

  loadMessages: () => Promise<void>;

  sendMessage: (message: string) => Promise<void>;

  reset: () => void;
}
