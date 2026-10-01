'use client';

import { useChatStore } from '@/features/chat/model/store';

import { MessageItem } from './messageItem';

export const MessageList = () => {
  // сообщения получаем непосредственно из store.
  const messages = useChatStore((state) => state.messages);

  if (messages.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-1 items-center justify-center p-4">
        <p className="text-sm text-neutral-500">Сообщений пока нет</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[200px] flex-1 flex-col gap-2 overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};
