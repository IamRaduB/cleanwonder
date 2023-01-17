import { ResponseCodes } from '../constants';

export interface ResponseCodePayload {
  status: ResponseCodes
}

export interface BackendErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  token?: string;
}
