import type { SendMessageData, SendMessageResponse } from './types';
import { axiosInstance } from '../axiosInstance';

type SendMessageParams = SendMessageData & {
  idInstance: string;
  apiTokenInstance: string;
};

export const sendMessage = async ({
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
