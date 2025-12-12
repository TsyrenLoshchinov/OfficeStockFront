export interface ReceiptUpload {
  id: string;
  fileName: string;
  status: 'new' | 'processing' | 'done' | 'error';
  uploadedAt: Date;
  sizeMb: number;
}

export interface ReceiptLine {
  text: string;
  amount?: number;
}

