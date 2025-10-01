export type RajaOngkirErrorMeta = {
  message: string;
  code: number;
  status: string;
};

export type RajaOngkirErrorResponse = {
  message?: string;
  error?: {
    meta?: RajaOngkirErrorMeta;
    data?: unknown;
  };
};
