export interface ResponseSuccess {
  success: true;
  message: string;
  data?: any;
}

export interface ResponseError {
  success: false;
  message: string;
  code: string;
  error?: any;
}
