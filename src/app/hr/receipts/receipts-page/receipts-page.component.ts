import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadReceiptComponent } from '../upload-receipt/upload-receipt.component';
import { ReceiptPreviewComponent } from '../receipt-preview/receipt-preview.component';
import { Receipt, ReceiptUploadResponse } from '../../../core/models/receipt.model';

@Component({
  selector: 'app-receipts-page',
  standalone: true,
  imports: [CommonModule, UploadReceiptComponent, ReceiptPreviewComponent],
  templateUrl: './receipts-page.component.html',
  styleUrls: ['./receipts-page.component.css']
})
export class ReceiptsPageComponent {
  showPreview = false;
  receiptData: Receipt | null = null;

  onReceiptUploaded(response: ReceiptUploadResponse): void {
    this.receiptData = {
      organization: response.organization,
      purchaseDate: response.purchaseDate,
      totalAmount: response.totalAmount,
      items: response.items.map(item => ({ ...item }))
    };
    this.showPreview = true;
  }

  onReceiptConfirmed(receipt: Receipt): void {
    console.log('Receipt confirmed:', receipt);
    // Здесь можно добавить логику обновления списка чеков
    this.showPreview = false;
    this.receiptData = null;
  }

  onReceiptCancelled(): void {
    this.showPreview = false;
    this.receiptData = null;
  }
}

