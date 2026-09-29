import { axiosInstance } from '../axiosInstance';

import type { DeleteNotificationParams, DeleteNotificationResponse } from './types';

export const deleteNotification = async ({
  idInstance,
  apiTokenInstance,
  receiptId,
}: DeleteNotificationParams): Promise<DeleteNotificationResponse> => {
  const response = await axiosInstance.delete<DeleteNotificationResponse>(
    `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
  );

  return response.data;
};
