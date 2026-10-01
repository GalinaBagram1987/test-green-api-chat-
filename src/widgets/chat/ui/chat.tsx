'use client';

import { useEffect } from 'react';

import { getNotificationText, startNotificationsPolling } from '@/shared/api/messages';

import type { ReceiveNotificationResponse } from '@/shared/api/messages';

import { ChatMessage } from '@/features/chat/model/types';
import { WidgetChatMessage } from '../model/types';
import { useChatStore } from '@/features/chat/model/store';

import { MessageForm } from './messageForm';
import { MessageList } from './messageList';
import { SideBar } from './sideBar';

type ChatProps = {
  idInstance: string;
  apiTokenInstance: string;
};

export const Chat = ({ idInstance, apiTokenInstance }: ChatProps) => {
  const chatId = useChatStore((state) => state.chatId);
  const error = useChatStore((state) => state.error);

  const addMessage = useChatStore((state) => state.addMessage);

  const setError = useChatStore((state) => state.setError);

  useEffect(() => {
    if (!chatId || !idInstance || !apiTokenInstance) {
      return;
    }

    const controller = new AbortController();

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

        // Уведомление должно принадлежать
        // открытому сейчас чату.
        if (!incomingChatId || incomingChatId !== chatId) {
          return;
        }

        const messageId = body.idMessage;
        const text = getNotificationText(body);

        if (!messageId || !text) {
          return;
        }

        const incomingMessage: WidgetChatMessage = {
          id: messageId,
          chatId: incomingChatId,
          text,
          timestamp: body.timestamp ?? Math.floor(Date.now() / 1000),
          direction: 'incoming',
          sendingStatus: 'sent',
        };
        addMessage(incomingMessage);
      },

      onError: (pollingError: unknown) => {
        // AbortController специально завершает запрос,
        // поэтому при отмене не показываем ошибку.
        if (controller.signal.aborted) {
          return;
        }

        console.error('Ошибка polling:', pollingError);

        setError('Не удалось получить новые сообщения');
      },
    });

    return () => {
      controller.abort();
    };
  }, [addMessage, apiTokenInstance, chatId, idInstance, setError]);

  if (!chatId) {
    return (
      <main className="flex h-dvh items-center justify-center">
        <p className="text-neutral-500">Чат не выбран</p>
      </main>
    );
  }

  return (
    <main className="flex h-dvh min-h-0">
      <SideBar chatId={chatId} />

      <section className="flex min-h-0 flex-1 flex-col">
        <MessageList />

        {error && (
          <p className="px-4 py-2 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
        <MessageForm />
      </section>
    </main>
  );
};
