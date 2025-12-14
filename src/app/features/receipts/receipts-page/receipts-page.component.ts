import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {}

  onReceiptUploaded(response: ReceiptUploadResponse): void {
    // После успешной загрузки фотографии открываем модальное окно с информацией о чеке
    this.receiptData = {
      organization: response.organization,
      purchaseDate: response.purchaseDate,
      totalAmount: response.totalAmount,
      items: response.items.map(item => ({ ...item })),
      // Сохраняем дополнительные поля для отправки при подтверждении
      fiscal_number: response.fiscal_number,
      fiscal_document: response.fiscal_document,
      fiscal_sign: response.fiscal_sign,
      order_name: response.order_name
    };
    this.showPreview = true; // Показываем модальное окно, скрываем компонент загрузки
  }

  onReceiptConfirmed(): void {
    // После подтверждения чека закрываем модальное окно и перенаправляем на список чеков
    this.showPreview = false;
    this.receiptData = null;
    // Перенаправляем на страницу списка чеков
    this.router.navigate(['/app/receipts']);
  }

  onReceiptCancelled(): void {
    // При отмене закрываем модальное окно и сбрасываем состояние
    this.showPreview = false;
    this.receiptData = null;
  }
}

