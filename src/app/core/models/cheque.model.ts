export interface Cheque {
  id: number;
  number: string;
  date: string;
  fileName: string;
  uploadedAt: string;
  organization?: string;
  totalAmount?: number;
  status?: 'pending' | 'confirmed' | 'rejected';
}

