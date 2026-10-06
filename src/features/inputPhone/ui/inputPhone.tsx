'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/features/chat/model/store';

export const InputPhone = () => {
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [validationError, setValidationError] = useState('');
  const [criticalError, setCriticalError] = useState('');

  const startChat = useChatStore((state) => state.startChat);

  const isLoading = useChatStore((state) => state.isSending);

  const chatError = useChatStore((state) => state.error);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setValidationError('');
    setCriticalError('');

    let preparedPhoneNumber = phone.replace(/\D/g, '');

    if (preparedPhoneNumber.length === 11 && preparedPhoneNumber.startsWith('8')) {
      preparedPhoneNumber = `7${preparedPhoneNumber.slice(1)}`;
    }

    if (!/^7\d{10}$/.test(preparedPhoneNumber)) {
      setValidationError('Введите российский номер в формате 79991234567');

      return;
    }

    let isChatStarted = false;

    try {
      isChatStarted = await startChat(preparedPhoneNumber, 'Привет! Поболтаем?');
    } catch (error: any) {
      console.error('Ошибка отправки 1 сообщения, начала чата:', error);
      setCriticalError('Не удалось начать чат. Проверьте подключение.');
    }

    if (isChatStarted) {
      router.push('/chat');
    }
  };

  const currentError = validationError || chatError || criticalError;

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-h-max w-100 max-w-xl rounded-2xl border-2 border-solid border-neutral-400 bg-neutral-50 p-10 shadow-2xl">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <h1>Введите номер телефона для отправки сообщений</h1>

          <input
            id="number"
            type="tel"
            required
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setValidationError('');
            }}
            placeholder="79991234567"
            autoComplete="tel"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />

          {currentError && (
            <p className="text-sm text-red-600" role="alert">
              {currentError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-sky-500 px-4 py-3 font-medium text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Подключение...' : 'Начать чат'}
          </button>
        </form>
      </div>
    </div>
  );
};
