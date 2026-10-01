import { axiosInstance } from '@/shared/api/axiosInstance';

export interface GetChatHistoryParams {
  idInstance: string;
  apiTokenInstance: string;
  chatId: string;
  count?: number;
}

export interface SendMessageParams {
  idInstance: string;
  apiTokenInstance: string;
  chatId: string;
  message: string;
}

export interface ChatHistoryItem {
  idMessage: string;
  timestamp: number;
  type: 'incoming' | 'outgoing';
  typeMessage?: string;
  textMessage?: string;

  extendedTextMessage?: {
    text?: string;
  };
}
export interface SendMessageResponse {
  idMessage: string;
}

export const getChatHistoryRequest = async ({
  idInstance,
  apiTokenInstance,
  chatId,
  count = 50,
}: GetChatHistoryParams): Promise<ChatHistoryItem[]> => {
  const response = await axiosInstance.post<ChatHistoryItem[]>(
    `/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`,
    {
      chatId,
      count,
    },
  );

  return response.data;
};

export const sendMessageRequest = async ({
  idInstance,
  apiTokenInstance,
  chatId,
  message,
}: SendMessageParams): Promise<SendMessageResponse> => {
  const response = await axiosInstance.post<SendMessageResponse>(
    `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
    {
      chatId,
      message,
    },
  );

  return response.data;
};
