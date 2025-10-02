export type StockItem = {
  stockId?: string;
  storeId: string;
  storeName: string;
  quantity: number;
  updatedAt: string | null;
};

export type ApiStockRaw = {
  id?: string;
  stockId?: string;
  _id?: string;
  stock_id?: string;
  storeId: string;
  storeName?: string | null;
  store?: { name?: string };
  quantity?: number;
  updatedAt?: string | null;
};

export type ApiListResponse<T> = {
  success?: boolean;
  data?: { items?: T[] } | T[];
};

export type LocalStock = StockItem;
