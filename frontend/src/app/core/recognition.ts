import { Injectable, signal } from '@angular/core';
import { RecognitionError, RecognitionResult, RecognitionStatus } from '../models/recognition.model';

@Injectable({
  providedIn: 'root',
})
export class Recognition {
  private readonly statuses = signal<RecognitionStatus[]>([
    { id: 's1', receiptId: 'r1', progress: 37, state: 'running', updatedAt: new Date() },
    { id: 's2', receiptId: 'r2', progress: 100, state: 'succeeded', updatedAt: new Date() },
  ]);

  private readonly results = signal<RecognitionResult[]>([
    {
      id: 'res1',
      receiptId: 'r2',
      total: 4100,
      items: [
        { name: 'Бумага A4', qty: 3, price: 500 },
        { name: 'Кофе', qty: 2, price: 1300 },
      ],
    },
  ]);

  private readonly errors = signal<RecognitionError[]>([
    { id: 'err1', receiptId: 'r3', message: 'Файл поврежден', code: 'FILE_CORRUPTED', occurredAt: new Date() },
  ]);

  getStatuses() {
    return this.statuses.asReadonly();
  }

  getResults() {
    return this.results.asReadonly();
  }

  getErrors() {
    return this.errors.asReadonly();
  }
}

