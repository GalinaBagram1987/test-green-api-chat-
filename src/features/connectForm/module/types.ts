import type { CheckAccountResponse } from '../api/type';

export type CheckAccountStatus = 'idle' | 'loading' | 'success' | 'error'; //idle - ждем пользователя

export interface CheckAccountState {
  idInstance: string;
  apiTokenInstance: string;

  status: 'idle' | 'loading' | 'success' | 'error';
  result: CheckAccountResponse | null;
  error: string | null;

  checkAccount: (
    idInstance: string,
    apiTokenInstance: string,
    phoneNumber: string,
  ) => Promise<void>;

  reset: () => void;
}
