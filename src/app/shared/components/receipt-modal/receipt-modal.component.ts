import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Receipt, ReceiptItem } from '../../../core/models/receipt.model';
import { ReceiptsService } from '../../../features/receipts/services/receipts.service';

@Component({
  selector: 'app-receipt-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './receipt-modal.component.html',
  styleUrls: ['./receipt-modal.component.css']
})
export class ReceiptModalComponent implements OnInit {
  @Input() receiptData!: Receipt;
  @Input() isReadOnly: boolean = false; // Для просмотра из списка чеков
  @Output() closed = new EventEmitter<void>();

  editedReceipt: Receipt;
  availableCategories = ['Аптека', 'Чай', 'Офисные принадлежности', 'Продукты', 'Не определёно'];
  isSubmitting = false;
  errorMessage = '';
  isVisible = true;

  constructor(private receiptsService: ReceiptsService) {
    this.editedReceipt = {
      organization: '',
      purchaseDate: '',
      totalAmount: 0,
      items: []
    };
  }

  ngOnInit(): void {
    this.editedReceipt = {
      organization: this.receiptData.organization,
      purchaseDate: this.receiptData.purchaseDate,
      totalAmount: this.receiptData.totalAmount,
      items: this.receiptData.items.map(item => ({ ...item }))
    };
  }

  updateItemName(item: ReceiptItem, newName: string): void {
    if (this.isReadOnly) return;
    item.name = newName;
    this.recalculateTotal();
  }

  updateItemQuantity(item: ReceiptItem, newQuantity: number): void {
    if (this.isReadOnly) return;
    item.quantity = newQuantity;
    this.recalculateTotal();
  }

  updateItemCategory(item: ReceiptItem, category: string): void {
    if (this.isReadOnly) return;
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
    const date = new Date(this.editedReceipt.purchaseDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}${month}`;
  }

  confirmReceipt(): void {
    if (this.isSubmitting || this.isReadOnly) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.receiptsService.confirmReceipt(this.editedReceipt).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.close();
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Ошибка при подтверждении чека. Попробуйте еще раз.';
      }
    });
  }

  close(): void {
    this.isVisible = false;
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}

