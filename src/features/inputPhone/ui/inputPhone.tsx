'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Пропсы для формы ввода телефона
 */

export type ConnectInstanceFormProps = {
  phone: number;
};

export const InputPhone = () => {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    router.replace('/chat');
  }, [status, router]);

  const handleSumit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setValidationError('');

    const preparedPhoneNumber = Number(phone.trim());

    if (!preparedPhoneNumber) {
      setValidationError('Введите номер');
      return;
    }

    // функция запроса
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-xl max-h-max p-10 w-100 h-200 bg-neutral-50 rounded-2xl border-neutral-400 border-2 border-solid shadow-2xl">
        <form className="flex flex-col gap-8" onSubmit={handleSumit}>
          <h1>Введите номер телефона для отправки сообщений</h1>

          <input
            id="number"
            type="tel"
            required
            value={phone}
            minLength={11}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Введите ваш phonе 700000000000"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          ></input>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-sky-500 px-4 py-3 font-medium text-white hover:bg-sky-600"
          >
            Начать чат
          </button>
        </form>
      </div>
    </div>
  );
};
