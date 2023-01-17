export interface CustomResponse {
  status: ResponseCodes;
  message: string;
}

export enum ResponseCodes {
  SUCCESS = 1000,
  /**
   * Email link has already been clicked
   */
  ALREADY_VALIDATED = 1001,
  /**
   * Email link has not been clicked
   */
  NOT_VALIDATED = 1002,
  /**
   * Profile data has not been completed
   */
  NO_PROFILE = 1003,
}
