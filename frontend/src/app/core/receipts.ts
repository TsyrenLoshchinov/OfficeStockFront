import { Injectable } from '@angular/core';
import { ReceiptLine, ReceiptUpload } from '../models/receipt.model';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Receipts {
  private readonly uploads = signal<ReceiptUpload[]>([
    { id: 'r1', fileName: '47594_PN0hg.jpg', status: 'processing', uploadedAt: new Date(), sizeMb: 1.4 },
    { id: 'r2', fileName: 'office_supplies.pdf', status: 'done', uploadedAt: new Date(), sizeMb: 0.8 },
  ]);

  private readonly lastLines = signal<ReceiptLine[]>([
    { text: 'Канцелярия: бумага А4 — 3 шт', amount: 1500 },
    { text: 'Кофе зерновой — 2 кг', amount: 2600 },
  ]);

  getUploads() {
    return this.uploads.asReadonly();
  }

  getLastLines() {
    return this.lastLines.asReadonly();
  }

  addUpload(fileName: string, sizeMb: number) {
    const newUpload: ReceiptUpload = {
      id: crypto.randomUUID(),
      fileName,
      status: 'new',
      uploadedAt: new Date(),
      sizeMb,
    };
    this.uploads.update((items) => [newUpload, ...items]);
    return newUpload;
  }
}
