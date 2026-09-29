import type { CheckAccountResponse } from '../api/type';

export type CheckAccountStatus = 'idle' | 'loading' | 'success' | 'error'; //idle - ждем пользователя

export interface CheckAccountState {
  status: CheckAccountStatus;
  result: CheckAccountResponse | null;
  error: string | null;

  checkAccount: (
    // это функция, которая вызывает API и обновляет состояние стора.
    idInstance: string,
    apiTokenInstance: string,
    phoneNumber: number,
  ) => Promise<void>;

  reset: () => void;
}
