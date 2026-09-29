import { axiosInstance } from '@/shared/api/axiosInstance';
import { CheckAccountResponse } from './type';

interface CheckAccountData {
  phoneNumber: number;
  force?: boolean;
}

export interface CheckAccountRequestParams {
  idInstance: string;
  apiTokenInstance: string;
  data: CheckAccountData;
}

export const checkAccountRequest = async ({
  idInstance,
  apiTokenInstance,
  data,
}: CheckAccountRequestParams): Promise<CheckAccountResponse> => {
  const response = await axiosInstance.post<CheckAccountResponse>(
    `/waInstance${idInstance}/checkAccount/${apiTokenInstance}`,
    data,
  );

  return response.data;
};
