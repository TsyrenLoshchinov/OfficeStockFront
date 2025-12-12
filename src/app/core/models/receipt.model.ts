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

