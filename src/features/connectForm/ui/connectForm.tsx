'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckAccountStore } from '../module/store';

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

  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationError, setValidationError] = useState('');

  const checkAccount = useCheckAccountStore((state) => state.checkAccount);

  const status = useCheckAccountStore((state) => state.status);

  const requestError = useCheckAccountStore((state) => state.error);

  useEffect(() => {
    if (status === 'success') {
      router.replace('/create-chat');
    }
  }, [status, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setValidationError('');

    const preparedIdInstance = idInstance.trim();
    const preparedApiTokenInstance = apiTokenInstance.trim();
    const preparedPhoneNumber = phoneNumber.trim();

    if (!preparedIdInstance || !preparedApiTokenInstance || !preparedPhoneNumber) {
      setValidationError('Заполните все поля');
      return;
    }

    await checkAccount(preparedIdInstance, preparedApiTokenInstance, preparedPhoneNumber);
  };

  const error = validationError || requestError;

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="max-h-max w-full max-w-xl rounded-2xl border-2 border-neutral-400 bg-neutral-50 p-10 shadow-2xl">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <h1>Введите данные для подключения</h1>

          <input
            type="text"
            required
            value={idInstance}
            onChange={(event) => {
              setIdInstance(event.target.value);
              setValidationError('');
            }}
            placeholder="Введите Id Instance"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />

          <input
            type="text"
            required
            value={apiTokenInstance}
            onChange={(event) => {
              setApiTokenInstance(event.target.value);
              setValidationError('');
            }}
            placeholder="Введите Api Token Instance"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />

          <input
            id="number"
            type="tel"
            required
            value={phoneNumber}
            minLength={11}
            onChange={(event) => {
              setPhoneNumber(event.target.value);
              setValidationError('');
            }}
            placeholder="Введите ваш phone 700000000000"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-sky-500"
          />

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-lg bg-sky-500 px-4 py-3 font-medium text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === 'loading' ? 'Подключение...' : 'Подключиться'}
          </button>
        </form>
      </div>
    </div>
  );
};
