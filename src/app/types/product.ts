export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  publicId?: string | null;
  altText?: string | null;
  isPrimary: boolean;
  createdAt: string;
}

export interface StockPerStore {
  storeId: string;
  storeName: string;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  slug?: string | null;
}

export interface Product {
  id: string;
  name: string;
  sku?: string; 
  description?: string; 
  price: number;
  isActive: boolean;
  categoryId?: string;
  category?: Category;
  images: ProductImage[];
  totalStock: number;
  weight_g?: number;
  storeId?: string;
  storeName: string;
  initialStock?: number;
  stocksPerStore?: StockPerStore[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail extends Product {
  stocksPerStore: StockPerStore[];
}
