'use client';

import { type FormEvent, useState } from 'react';

import { useChatStore } from '@/features/chat/model/store';

export const MessageForm = () => {
  const [message, setMessage] = useState('');

  const isSending = useChatStore((state) => state.isSending);

  const sendMessage = useChatStore((state) => state.sendMessage);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const preparedMessage = message.trim();

    if (!preparedMessage || isSending) {
      return;
    }

    try {
      await sendMessage(preparedMessage);
      setMessage('');
    } catch {
      // При ошибке поле остаётся заполненным.
    }
  };

  return (
    <form
      className="m-10 flex flex-row justify-between rounded-2xl border-2 border-neutral-400 bg-neutral-50 p-4 shadow-2xl"
      onSubmit={handleSubmit}
    >
      <input
        className="min-w-0 flex-1 bg-transparent outline-none ring-0 hover:border-none hover:outline-none hover:ring-0 focus:border-none focus:outline-none focus:ring-0"
        type="text"
        value={message}
        disabled={isSending}
        placeholder="Введите сообщение"
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />

      <button
        type="submit"
        className="m-2 rounded-xl border-solid bg-sky-400 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSending || !message.trim()}
      >
        {isSending ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  );
};
