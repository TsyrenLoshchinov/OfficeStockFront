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
  // Дополнительные поля для отправки на бэкенд
  fiscal_number?: string | null;
  fiscal_document?: string | null;
  fiscal_sign?: string | null;
  order_name?: string | null;
}

export interface ReceiptUploadResponse {
  organization: string;
  purchaseDate: string;
  totalAmount: number;
  items: ReceiptItem[];
  // Дополнительные поля из ответа API
  fiscal_number?: string | null;
  fiscal_document?: string | null;
  fiscal_sign?: string | null;
  order_name?: string | null;
  // Флаг дубликата
  is_duplicate?: boolean;
  // Флаг успешности обработки
  success?: boolean;
  // Сообщение об ошибке
  error?: string | null;
  // Сообщение от API
  message?: string;
}

export interface ReceiptConfirmPayload {
  order_name?: string | null;
  fiscal_number?: string | null;
  fiscal_document?: string | null;
  fiscal_sign?: string | null;
  sum: number;
  date_buy: string;
  name_supplier: string;
  items: Array<{
    product_name: string;
    count_product: number;
    unit_price: number;
    sum: number;
    category_name?: string | null;
  }>;
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

// API Upload Response
export interface ReceiptUploadApiResponse {
  success: boolean;
  is_duplicate: boolean;
  message: string;
  receipt: ReceiptRead | null; // Может быть null при дубликате
  error: string | null;
}

