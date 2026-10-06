import { axiosInstance } from '../axiosInstance';
import type { ReceiveMessageResponse, ReceiveMessageParams } from './types';

type Params = ReceiveMessageParams & {
  signal?: AbortSignal;
};

export const receiveMessage = async ({
  idInstance,
  apiTokenInstance,
  receiveTimeout = 20,
  signal,
}: Params): Promise<ReceiveMessageResponse | null> => {
  console.log('[RM-TEST] function called in context');

  try {
    const response = await axiosInstance.get<ReceiveMessageResponse | null>(
      `/waInstance${idInstance}/receiveMessage/${apiTokenInstance}`,
      {
        params: {
          receiveTimeout,
        },
        signal,
        timeout: 35000,
      },
    );

    // Если бэк вернул 204 No Content или пустые данные, возвращаем null для следующего круга
    if (response.status === 204 || !response.data) {
      return null;
    }

    // Когда сообщение реально придет, сработает этот лог:
    console.log(`[RM-TEST] Request from back OK! Data:`, response.data);
    return response.data;
  } catch (error: any) {
    // Безопасное логирование ошибки без паники рантайма
    console.log(
      '[RM-TEST] Request completed with status:',
      error?.response?.status || error?.message,
    );

    // Возвращаем null, чтобы поллинг спокойно пошел на следующий круг
    return null;
  }
};
