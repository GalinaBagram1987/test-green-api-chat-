import axios from 'axios';

import { deleteNotification } from './delete-messages';
import { receiveNotification } from './recieveMessage';

import type { ReceiveNotificationResponse } from './types';

type StartNotificationsPollingParams = {
  idInstance: string;
  apiTokenInstance: string;
  signal: AbortSignal;
  onNotification: (notification: ReceiveNotificationResponse) => void | Promise<void>;
  onError?: (error: unknown) => void;
};

export const startNotificationsPolling = async ({
  idInstance,
  apiTokenInstance,
  signal,
  onNotification,
  onError,
}: StartNotificationsPollingParams): Promise<void> => {
  while (!signal.aborted) {
    try {
      const notification = await receiveNotification({
        idInstance,
        apiTokenInstance,
        receiveTimeout: 5,
        signal,
      });

      if (!notification) {
        continue;
      }

      // Сначала полностью обрабатываем уведомление
      await onNotification(notification);

      // Только после успешной обработки удаляем его
      await deleteNotification({
        idInstance,
        apiTokenInstance,
        receiptId: notification.receiptId,
      });
    } catch (error: unknown) {
      if (
        signal.aborted ||
        axios.isCancel(error) ||
        (error instanceof DOMException && error.name === 'AbortError')
      ) {
        return;
      }

      onError?.(error);

      // После сетевой ошибки не запускаем запросы слишком часто
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 1000);
      });
    }
  }
};
