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
  const [phoneNumber, setphoneNumber] = useState('');
  const [validationError, setValidationError] = useState('');

  const checkAccount = useCheckAccountStore((state) => state.checkAccount);
  const status = useCheckAccountStore((state) => state.status);
  const requestError = useCheckAccountStore((state) => state.error);

  useEffect(() => {
    router.replace('/create-chat');
  }, [status, router]);

  const handleSumit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
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
