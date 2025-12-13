import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadReceiptComponent } from '../upload-receipt/upload-receipt.component';
import { ReceiptModalComponent } from '../../../shared/components/receipt-modal/receipt-modal.component';
import { Receipt, ReceiptUploadResponse } from '../../../core/models/receipt.model';

@Component({
  selector: 'app-receipts-page',
  standalone: true,
  imports: [CommonModule, UploadReceiptComponent, ReceiptModalComponent],
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

  onReceiptConfirmed(): void {
    // После подтверждения чека закрываем модальное окно
    this.showPreview = false;
    this.receiptData = null;
  }

  onReceiptCancelled(): void {
    this.showPreview = false;
    this.receiptData = null;
  }
}

