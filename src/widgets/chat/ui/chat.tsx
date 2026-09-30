import { useCallback, useEffect, useRef, useState } from 'react';

import { getNotificationText, sendMessage, startNotificationsPolling } from '@/shared/api/messages';

import type { ReceiveNotificationResponse } from '@/shared/api/messages';

import type { ChatMessage } from '../model/types';

import { MessageForm } from './messageForm';
import { MessageList } from './messageList';
import { SideBar } from './sideBar';

type ChatProps = {
  chatId: string;

  // Первое сообщение уже было отправлено
  // до появления компонента Chat
  initialMessage?: ChatMessage;

  idInstance: string;
  apiTokenInstance: string;
};

export const Chat = ({ chatId, initialMessage, idInstance, apiTokenInstance }: ChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!initialMessage) {
      return [];
    }

    return [initialMessage];
  });

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSendingRef = useRef(false);

  const handleSendMessage = useCallback(
    async (rawText: string): Promise<void> => {
      const text = rawText.trim();

      if (!text || isSendingRef.current) {
        return;
      }

      isSendingRef.current = true;
      setIsSending(true);
      setError(null);

      try {
        const response = await sendMessage({
          idInstance,
          apiTokenInstance,
          chatId,
          message: text,
        });

        const outgoingMessage: ChatMessage = {
          id: response.idMessage,
          chatId,
          text,
          timestamp: Math.floor(Date.now() / 1000),
          direction: 'outgoing',
        };

        setMessages((currentMessages) => [...currentMessages, outgoingMessage]);
      } catch (error: unknown) {
        console.error('Ошибка отправки сообщения:', error);

        setError('Не удалось отправить сообщение');
      } finally {
        isSendingRef.current = false;
        setIsSending(false);
      }
    },
    [apiTokenInstance, chatId, idInstance],
  );

  useEffect(() => {
    if (!chatId || !idInstance || !apiTokenInstance) {
      return;
    }

    const controller = new AbortController();

    // Именно здесь запускается polling.
    // Но непрерывный while-цикл находится
    // внутри startNotificationPolling.
    void startNotificationsPolling({
      idInstance,
      apiTokenInstance,
      signal: controller.signal,

      onNotification: async (notification: ReceiveNotificationResponse): Promise<void> => {
        const { body } = notification;

        if (body.typeWebhook !== 'incomingMessageReceived') {
          return;
        }

        const incomingChatId = body.senderData?.chatId;

        if (incomingChatId !== chatId) {
          return;
        }

        const text = getNotificationText(body);

        if (!body.idMessage || !text) {
          return;
        }

        const incomingMessage: ChatMessage = {
          id: body.idMessage,
          chatId: incomingChatId,
          text,
          timestamp: body.timestamp ?? Math.floor(Date.now() / 1000),
          direction: 'incoming',
        };

        setMessages((currentMessages) => {
          const messageAlreadyExists = currentMessages.some(
            (message) => message.id === incomingMessage.id,
          );

          if (messageAlreadyExists) {
            return currentMessages;
          }

          return [...currentMessages, incomingMessage];
        });
      },

      onError: (error: unknown) => {
        console.error('Ошибка polling:', error);

        setError('Не удалось получить новые сообщения');
      },
    });

    // Выполнится при закрытии Chat
    // или при изменении chatId.
    return () => {
      controller.abort();
    };
  }, [apiTokenInstance, chatId, idInstance]);

  return (
    <main className="flex h-dvh min-h-0">
      <SideBar chatId={chatId} />

      <section className="flex min-h-0 flex-1 flex-col">
        <MessageList messages={messages} />

        {error && (
          <p className="px-4 py-2 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        <MessageForm isLoading={isSending} onSend={handleSendMessage} />
      </section>
    </main>
  );
};
