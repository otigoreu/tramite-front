export interface BaseResponse {
  success: boolean;
  errorMessage: string;
}

export interface BaseResponseGeneric<T> extends BaseResponse {
  data?: T;
}
