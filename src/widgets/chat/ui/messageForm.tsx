'use client';

import { type FormEvent, useState } from 'react';

type MessageFormProps = {
  isLoading: boolean;
  onSend: (message: string) => Promise<void>;
};

export const MessageForm = ({ isLoading, onSend }: MessageFormProps) => {
  const [message, setMessage] = useState('');
  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const preparedMessage = message.trim();

    if (!preparedMessage || isLoading) {
      return;
    }

    await onSend(preparedMessage);
    setMessage('');
  };

  return (
    <form
      className="flex flex-row justify-between border-2 border-neutral-400 bg-neutral-50 shadow-2xl rounded-2xl m-10 p-4"
      onSubmit={handleSubmit}
    >
      <input
        className="min-w-0 flex-1 bg-transparent outline-none ring-0 hover:border-none hover:outline-none hover:ring-0 focus:border-none focus:outline-none focus:ring-0"
        type="text"
        value={message}
        disabled={isLoading}
        placeholder="Введите сообщение"
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />

      <button
        type="submit"
        className="px-4 py-2 m-2 text-sm bg-sky-400 rounded-xl border-solid"
        disabled={isLoading || !message.trim()}
      >
        {isLoading ? 'Отправка...' : 'Отправить'}
      </button>
    </form>
  );
};
