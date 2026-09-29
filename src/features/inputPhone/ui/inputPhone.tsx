'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { sendMessage } from '@/shared/api/messages';
import { useCheckAccountStore } from '@/features/connectForm/module/store';

/**
 * Пропсы для формы ввода телефона
 */

export const InputPhone = () => {
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const idInstance = useCheckAccountStore((state) => state.idInstance);

  const apiTokenInstance = useCheckAccountStore((state) => state.apiTokenInstance);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setValidationError('');

    let preparedPhoneNumber = phone.replace(/\D/g, '');

    // Преобразуем 89991234567 в 79991234567
    if (preparedPhoneNumber.length === 11 && preparedPhoneNumber.startsWith('8')) {
      preparedPhoneNumber = `7${preparedPhoneNumber.slice(1)}`;
    }

    if (!/^7\d{10}$/.test(preparedPhoneNumber)) {
      setValidationError('Введите российский номер в формате 79991234567');
      return;
    }

    if (!idInstance || !apiTokenInstance) {
      setValidationError('Данные подключения не найдены. Подключитесь повторно.');
      return;
    }

    const chatId = `${preparedPhoneNumber}@c.us`;
    const message = 'Привет! Поболтаем?';

    try {
      setIsLoading(true);

      await sendMessage({
        idInstance,
        apiTokenInstance,
        chatId,
        message,
      });

      router.push(`/chat?chatId=${encodeURIComponent(chatId)}`);
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Не удалось отправить сообщение');
    } finally {
      setIsLoading(false);
    }
  };

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

          {validationError && (
            <p className="text-sm text-red-600" role="alert">
              {validationError}
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
