import axios from 'axios';
import { create } from 'zustand';

import { checkAccountRequest } from '../api/connect';
import type { CheckAccountState } from './types';

export const useCheckAccountStore = create<CheckAccountState>((set) => ({
  status: 'idle',
  result: null,
  error: null,

  checkAccount: async (idInstance, apiTokenInstance, phoneNumber) => {
    set({
      status: 'loading',
      result: null,
      error: null,
    });

    try {
      const result = await checkAccountRequest({
        idInstance,
        apiTokenInstance,
        data: {
          phoneNumber,
          force: true,
        },
      });

      set({
        status: 'success',
        result,
        error: null,
      });
    } catch (error: unknown) {
      let message = 'Не удалось проверить аккаунт';

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const reason = error.response?.data?.reason;

        if (status === 469) {
          message = 'Превышен лимит проверок. Повторите попытку позже.';
        } else if (typeof reason === 'string') {
          message = reason;
        } else if (status === 400) {
          message = 'Проверьте правильность номера телефона';
        }
      }

      set({
        status: 'error',
        result: null,
        error: message,
      });
    }
  },

  reset: () => {
    set({
      status: 'idle',
      result: null,
      error: null,
    });
  },
}));
