import { axiosInstance } from '../axiosInstance';
import type { ReceiveNotificationResponse, ReceiveNotificationParams } from './types';

type Params = ReceiveNotificationParams & {
  signal?: AbortSignal;
};

export const receiveNotification = async ({
  idInstance,
  apiTokenInstance,
  receiveTimeout = 5,
  signal,
}: Params): Promise<ReceiveNotificationResponse | null> => {
  const response = await axiosInstance.get<ReceiveNotificationResponse | null>(
    `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
    {
      params: {
        receiveTimeout,
      },
      signal,
    },
  );

  return response.data;
};
