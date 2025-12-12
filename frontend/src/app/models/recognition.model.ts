export interface RecognitionStatus {
  id: string;
  receiptId: string;
  progress: number;
  state: 'queued' | 'running' | 'succeeded' | 'failed';
  updatedAt: Date;
}

export interface RecognitionResult {
  id: string;
  receiptId: string;
  total: number;
  items: Array<{ name: string; qty: number; price: number }>;
}

export interface RecognitionError {
  id: string;
  receiptId: string;
  message: string;
  code?: string;
  occurredAt: Date;
}

