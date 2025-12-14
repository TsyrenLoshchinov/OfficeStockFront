export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
}

export interface Receipt {
  organization: string;
  purchaseDate: string;
  totalAmount: number;
  items: ReceiptItem[];
}

export interface ReceiptUploadResponse {
  organization: string;
  purchaseDate: string;
  totalAmount: number;
  items: ReceiptItem[];
}

export interface ReceiptConfirmPayload {
  receiptData: Receipt;
}

// API Response interfaces
export interface ReceiptItemRead {
  id: number;
  receipt_id: number;
  product_name: string;
  count_product: number;
  unit_price: number;
  sum: number;
  product_id?: number | null;
  category_name?: string | null;
}

export interface ReceiptRead {
  id?: number | null;
  fiscal_number?: string | null;
  fiscal_document?: string | null;
  fiscal_sign?: string | null;
  sum: number;
  date_buy: string;
  name_supplier?: string | null;
  order_name?: string | null;
  user_id?: number | null;
  date_create?: string | null;
  items: ReceiptItemRead[];
}

