'use client';

import { useEffect, useRef } from 'react';

import { getMessageText, startMessagePolling } from '@/shared/api/messages';
import { deleteMessage } from '@/shared/api/messages';
import type { ReceiveMessageResponse } from '@/shared/api/messages';

import { WidgetChatMessage } from '../model/types';
import { useChatStore } from '@/features/chat/model/store';
import { useCheckAccountStore } from '@/features/connectForm/module/store';

import { MessageForm } from './messageForm';
import { MessageList } from './messageList';
import { SideBar } from './sideBar';

export const Chat = () => {
  const chatId = useChatStore((state) => state.chatId);

  const addMessage = useChatStore((state) => state.addMessage);

  const error = useChatStore((state) => state.error);

  const setError = useChatStore((state) => state.setError);

  const idInstance = useCheckAccountStore((state) => state.idInstance);

  const apiTokenInstance = useCheckAccountStore((state) => state.apiTokenInstance);

  const messages = useChatStore((state) => state.messages);

  // Внутри компонента чата за рамками useEffect фиксируем рефы:
  const credentialsRef = useRef({ idInstance, apiTokenInstance });
  credentialsRef.current = { idInstance, apiTokenInstance };

  useEffect(() => {
    // Если chatId еще пустой (идет инициализация стора) или нет токенов, мгновенно выходим
    if (
      !chatId ||
      chatId.trim() === '' ||
      !chatId.includes('@c.us') ||
      !credentialsRef.current.idInstance ||
      !credentialsRef.current.apiTokenInstance
    ) {
      return;
    }

    const controller = new AbortController();

    console.warn('[Chat] POLLING START', { chatId });

    void startMessagePolling({
      idInstance: credentialsRef.current.idInstance,
      apiTokenInstance: credentialsRef.current.apiTokenInstance,
      signal: controller.signal,

      onMessage: async (Message: ReceiveMessageResponse): Promise<void> => {
        const { body, receiptId } = Message;

        // Оборачиваем обработку в try/finally.
        // Блок finally выполнится В ЛЮБОМ СЛУЧАЕ, даже если сработал один из return
        try {
          if (body.typeWebhook !== 'incomingMessageReceived') {
            return;
          }

          const incomingChatId = body.senderData?.chatId;

          // Уведомление должно принадлежать открытому сейчас чату.
          if (!incomingChatId || incomingChatId !== chatId) {
            return;
          }

          const messageId = body.idMessage;
          const text = getMessageText(body);

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
        } finally {
          // подтверждаем и удаляем ЛЮБОЙ вебхук, чтобы очередь двигалась дальше
          try {
            await deleteMessage({
              idInstance: credentialsRef.current.idInstance,
              apiTokenInstance: credentialsRef.current.apiTokenInstance,
              receiptId: receiptId, // Стираем вебхук из базы Green API
            });
            console.log(`[Chat] Message ${receiptId} successfully deleted`);
          } catch (deleteError) {
            console.error('[Chat] Failed to delete Message:', deleteError);
          }
        }
      },

      onError: (pollingError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        console.error('Ошибка polling:', pollingError);
        setError('Не удалось получить новые сообщения');
      },
    });

    return () => {
      console.warn('[Chat] POLLING CLEANUP', { chatId });
      controller.abort(); // Сработает ТОЛЬКО при реальной смене chatId или закрытии экрана!
    };
  }, [chatId]);

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
        <MessageForm />
      </section>
    </main>
  );
};
