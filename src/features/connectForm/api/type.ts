export type CheckAccountSuccessResponse =
  | {
      exist: true;
      chatId: string;
      fromCache: boolean;
    }
  | {
      exist: false;
      chatId: '';
      fromCache: boolean;
    };

export type CheckAccountErrorResponse = {
  status: false;
  reason: string;
};

export type CheckAccountResponse = CheckAccountSuccessResponse | CheckAccountErrorResponse;
