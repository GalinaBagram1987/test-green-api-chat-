'use client';

import { useState, FormEvent } from 'react';
import { checkAccountRequest } from '../api/connect';
import { useRouter } from 'next/navigation';

/**
 * Пропсы для формы подключения
 */

export type ConnectInstanceFormProps = {
  idInstaсe: string;
  apiTokenInstaсe: string;
  phoneNumber: number;
};

/**
 * Форма запроса
 */

export const ConnectInstanseForm = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSumit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError('');

    if (!idInstance.trim() || !apiTokenInstance.trim() || !phoneNumber) {
      setError('Заполните все поля');
      return;
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-xl max-h-max p-10 w-100 h-200 bg-neutral-50 rounded-2xl border-neutral-400 border-2 border-solid shadow-2xl">
        <form className="flex flex-col gap-8" onSubmit={handleSumit}>
          <h1>Введите данные для подключения</h1>

          <input
            type="text"
            required
            value={idInstance}
            onChange={(event) => setIdInstance(event.target.value)}
            placeholder="Введите Id Istance"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          ></input>

          <input
            type="text"
            required
            value={apiTokenInstance}
            onChange={(event) => setApiTokenInstance(event.target.value)}
            placeholder="Введите Api Token Instaсe"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          ></input>

          <input
            id="number"
            type="tel"
            required
            value={phoneNumber}
            minLength={11}
            onChange={(event) => setphoneNumber(event.target.value)}
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
            Подключиться
          </button>
        </form>
      </div>
    </div>
  );
};
