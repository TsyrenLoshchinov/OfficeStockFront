import { Injectable, signal } from '@angular/core';

export interface Cheque {
  id: string;
  number: string;
  date: Date;
  fileName: string;
  uploadedAt: Date;
  organization?: string;
  total?: number;
  status: 'pending' | 'processed' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class ChequeService {
  private readonly cheques = signal<Cheque[]>([
    {
      id: '1',
      number: '001',
      date: new Date('2024-11-24'),
      fileName: 'Gklro_87r7.jpg',
      uploadedAt: new Date('2025-11-20'),
      organization: 'ПАО «Магнит»',
      total: 485.0,
      status: 'processed',
    },
    {
      id: '2',
      number: '001',
      date: new Date('2025-06-19'),
      fileName: 'Gklro_87r7.jpg',
      uploadedAt: new Date('2025-11-20'),
      status: 'processed',
    },
    {
      id: '3',
      number: '001',
      date: new Date('2025-01-10'),
      fileName: 'Gklro_87r7.jpg',
      uploadedAt: new Date('2025-11-20'),
      status: 'processed',
    },
    {
      id: '4',
      number: '001',
      date: new Date('2024-09-23'),
      fileName: 'Gklro_87r7.jpg',
      uploadedAt: new Date('2025-11-20'),
      status: 'processed',
    },
    {
      id: '5',
      number: '001',
      date: new Date('2024-02-02'),
      fileName: 'Gklro_87r7.jpg',
      uploadedAt: new Date('2025-11-20'),
      status: 'processed',
    },
  ]);

  getCheques() {
    return this.cheques.asReadonly();
  }

  getChequeById(id: string): Cheque | undefined {
    return this.cheques().find((c) => c.id === id);
  }

  addCheque(cheque: Omit<Cheque, 'id'>): void {
    const newCheque: Cheque = {
      ...cheque,
      id: Date.now().toString(),
    };
    this.cheques.update((cheques) => [newCheque, ...cheques]);
  }

  deleteCheque(id: string): void {
    this.cheques.update((cheques) => cheques.filter((c) => c.id !== id));
  }
}

