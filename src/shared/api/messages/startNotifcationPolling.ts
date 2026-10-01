import { receiveMessage } from './recieveMessage';

const isCanceledRequest = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const requestError = error as {
    name?: unknown;
    code?: unknown;
  };

  return requestError.name === 'CanceledError' || requestError.code === 'ERR_CANCELED';
};

export const startNotificationsPolling = async ({
  idInstance,
  apiTokenInstance,
  signal,
  onNotification,
  onError,
}: {
  idInstance: string;
  apiTokenInstance: string;
  signal: AbortSignal;
  onNotification: (
    notification: NonNullable<Awaited<ReturnType<typeof receiveMessage>>>,
  ) => Promise<void> | void;
  onError?: (error: unknown) => void;
}): Promise<void> => {
  console.log('[polling] LOOP START');

  while (!signal.aborted) {
    try {
      console.log('[polling] WAIT NOTIFICATION');

      // Именно этот вызов запускает запрос,
      // находящийся внутри receiveMessage.
      const notification = await receiveMessage({
        idInstance,
        apiTokenInstance,
        signal,
      });

      if (signal.aborted) {
        console.log('[polling] ABORTED');

        return;
      }

      if (!notification) {
        console.log('[polling] EMPTY RESPONSE');

        continue;
      }

      console.log('[polling] NOTIFICATION RECEIVED', {
        receiptId: notification.receiptId,
        typeWebhook: notification.body?.typeWebhook,
      });

      await onNotification(notification);
    } catch (error: unknown) {
      if (signal.aborted || isCanceledRequest(error)) {
        console.log('[polling] REQUEST CANCELLED');

        return;
      }

      console.error('[polling] REQUEST FAILED', error instanceof Error ? error.message : error);

      onError?.(error);

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 1000);
      });
    }
  }
};
