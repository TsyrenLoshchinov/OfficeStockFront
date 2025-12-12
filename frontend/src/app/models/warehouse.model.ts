export interface Category {
  id: string;
  name: string;
  itemsCount: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  unit: string;
}

export interface StockItem {
  productId: string;
  quantity: number;
  threshold: number;
}

export interface WriteOff {
  id: string;
  productId: string;
  quantity: number;
  reason: string;
  date: Date;
}

export interface ForecastEntry {
  productId: string;
  expectedNeed: number;
  period: string;
}

