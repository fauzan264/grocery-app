export interface RajaOngkirErrorMeta {
  message: string;
  code: number;
  status: string;
}

export interface RajaOngkirErrorResponse {
  message?: string;
  error?: {
    meta?: RajaOngkirErrorMeta;
    data?: unknown;
  };
}

export interface RajaOngkirDataResponse {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface RajaOngkirSuccessResponse {
  meta: RajaOngkirErrorMeta;
  data: RajaOngkirDataResponse[];
}
