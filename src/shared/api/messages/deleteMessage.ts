import { axiosInstance } from '../axiosInstance';

import type { DeleteMessageParams, DeleteMessageResponse } from './types';

export const deleteMessage = async ({
  idInstance,
  apiTokenInstance,
  receiptId,
}: DeleteMessageParams): Promise<DeleteMessageResponse> => {
  const response = await axiosInstance.delete<DeleteMessageResponse>(
    `/waInstance${idInstance}/deleteMessage/${apiTokenInstance}/${receiptId}`,
  );

  return response.data;
};
