export interface HttpRequestOptions extends RequestInit {
  expectJson?: boolean;
}

export type HttpSuccess<T> = {
  ok: true;
  data: T;
  status: number;
};

export type HttpFailure = {
  ok: false;
  error: string;
  status: number;
};

export type HttpResult<T> = HttpSuccess<T> | HttpFailure;
