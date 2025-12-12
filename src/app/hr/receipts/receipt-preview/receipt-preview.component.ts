import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Receipt, ReceiptItem } from '../../../core/models/receipt.model';
import { ReceiptsService } from '../../services/receipts.service';

@Component({
  selector: 'app-receipt-preview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receipt-preview.component.html',
  styleUrls: ['./receipt-preview.component.css']
})
export class ReceiptPreviewComponent implements OnInit {
  @Input() receiptData!: Receipt;
  @Output() confirmed = new EventEmitter<Receipt>();
  @Output() cancelled = new EventEmitter<void>();

  editedReceipt: Receipt;
  availableCategories = ['Аптека', 'Чай', 'Офисные принадлежности', 'Продукты', 'Не определёно'];
  isSubmitting = false;
  errorMessage = '';

  constructor(private receiptsService: ReceiptsService) {
    this.editedReceipt = {
      organization: '',
      purchaseDate: '',
      totalAmount: 0,
      items: []
    };
  }

  ngOnInit(): void {
    // Создаем копию для редактирования
    this.editedReceipt = {
      organization: this.receiptData.organization,
      purchaseDate: this.receiptData.purchaseDate,
      totalAmount: this.receiptData.totalAmount,
      items: this.receiptData.items.map(item => ({ ...item }))
    };
  }

  updateItemName(item: ReceiptItem, newName: string): void {
    item.name = newName;
    this.recalculateTotal();
  }

  updateItemQuantity(item: ReceiptItem, newQuantity: number): void {
    item.quantity = newQuantity;
    this.recalculateTotal();
  }

  updateItemCategory(item: ReceiptItem, category: string): void {
    item.category = category;
  }

  recalculateTotal(): void {
    this.editedReceipt.totalAmount = this.editedReceipt.items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  }

  getReceiptNumber(): string {
    // Генерируем номер чека на основе даты
    const date = new Date(this.editedReceipt.purchaseDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}${month}`;
  }

  confirmReceipt(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.receiptsService.confirmReceipt(this.editedReceipt).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.confirmed.emit(this.editedReceipt);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Ошибка при подтверждении чека. Попробуйте еще раз.';
      }
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }
}

