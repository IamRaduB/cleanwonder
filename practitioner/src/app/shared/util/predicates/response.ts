import { ResponseCodePayload } from '@core/models/response';

export function isResponseCode(param: any | ResponseCodePayload): param is ResponseCodePayload {
  return !!(param as ResponseCodePayload).status
}
