import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Receipt, ReceiptItem } from '../../../core/models/receipt.model';
import { ReceiptsService } from '../../../features/receipts/services/receipts.service';
import { CategoriesService } from '../../../features/categories/services/categories.service';
import { ChangeCategoryModalComponent } from '../change-category-modal/change-category-modal.component';
import { ConfirmationChangesModalComponent } from '../confirmation-changes-modal/confirmation-changes-modal.component';
import { AddCategoryModalComponent } from '../add-category-modal/add-category-modal.component';
import { ConfirmationAddModalComponent } from '../confirmation-add-modal/confirmation-add-modal.component';
import { ModalStateService } from '../../../core/services/modal-state.service';
import { ModalContainerDirective } from '../../directives/modal-container.directive';

@Component({
  selector: 'app-receipt-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ChangeCategoryModalComponent,
    ConfirmationChangesModalComponent,
    AddCategoryModalComponent,
    ConfirmationAddModalComponent,
    ModalContainerDirective
  ],
  templateUrl: './receipt-modal.component.html',
  styleUrls: ['./receipt-modal.component.css']
})
export class ReceiptModalComponent implements OnInit, OnDestroy {
  @Input() receiptData!: Receipt;
  @Input() isReadOnly: boolean = false; // Для просмотра из списка чеков
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  editedReceipt: Receipt;
  availableCategories: string[] = ['Не определёно']; // Начальное значение
  isSubmitting = false;
  errorMessage = '';
  isVisible = true;

  // Модальные окна для изменения категории
  showChangeCategoryModal = false;
  showConfirmationChangesModal = false;
  showAddCategoryModal = false;
  showConfirmationAddModal = false;
  
  currentItemIndex = -1;
  currentItemCategory = '';
  selectedNewCategory = '';
  newCategoryToAdd = '';

  constructor(
    private receiptsService: ReceiptsService,
    private categoriesService: CategoriesService,
    private modalStateService: ModalStateService
  ) {
    this.editedReceipt = {
      organization: '',
      purchaseDate: '',
      totalAmount: 0,
      items: []
    };
  }

  ngOnInit(): void {
    this.modalStateService.openModal();
    this.editedReceipt = {
      organization: this.receiptData.organization,
      purchaseDate: this.receiptData.purchaseDate,
      totalAmount: this.receiptData.totalAmount,
      items: this.receiptData.items.map(item => ({ ...item })),
      // Копируем дополнительные поля для отправки при подтверждении
      fiscal_number: this.receiptData.fiscal_number,
      fiscal_document: this.receiptData.fiscal_document,
      fiscal_sign: this.receiptData.fiscal_sign,
      order_name: this.receiptData.order_name
    };
    
    // Загружаем категории из сервиса
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.availableCategories = ['Не определёно', ...categories.map(c => c.name)];
      },
      error: (error) => {
        console.error('Ошибка загрузки категорий:', error);
        // Оставляем дефолтные категории при ошибке
        this.availableCategories = ['Аптека', 'Чай', 'Офисные принадлежности', 'Продукты', 'Не определёно'];
      }
    });
  }

  ngOnDestroy(): void {
    this.modalStateService.closeModal();
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

  openChangeCategoryModal(itemIndex: number): void {
    if (this.isReadOnly) return;
    this.currentItemIndex = itemIndex;
    this.currentItemCategory = this.editedReceipt.items[itemIndex].category || 'Не определёно';
    this.showChangeCategoryModal = true;
  }

  onCategorySelected(categoryName: string): void {
    this.selectedNewCategory = categoryName;
    this.showChangeCategoryModal = false;
    this.showConfirmationChangesModal = true;
  }

  onAddCategoryRequested(): void {
    this.showChangeCategoryModal = false;
    this.showAddCategoryModal = true;
  }

  onCategoryAdded(categoryName: string): void {
    this.newCategoryToAdd = categoryName;
    this.showAddCategoryModal = false;
    this.showConfirmationAddModal = true;
  }

  onConfirmationChangesConfirmed(): void {
    if (this.currentItemIndex >= 0 && this.selectedNewCategory) {
      this.editedReceipt.items[this.currentItemIndex].category = this.selectedNewCategory;
      this.recalculateTotal();
    }
    this.showConfirmationChangesModal = false;
    this.currentItemIndex = -1;
    this.selectedNewCategory = '';
    this.currentItemCategory = '';
  }

  onConfirmationAddConfirmed(): void {
    if (this.currentItemIndex >= 0 && this.newCategoryToAdd) {
      this.editedReceipt.items[this.currentItemIndex].category = this.newCategoryToAdd;
      // Обновляем список доступных категорий
      if (!this.availableCategories.includes(this.newCategoryToAdd)) {
        this.availableCategories.push(this.newCategoryToAdd);
      }
      // Перезагружаем категории из сервиса для обновления списка
      this.categoriesService.getCategories().subscribe({
        next: (categories) => {
          this.availableCategories = ['Не определёно', ...categories.map(c => c.name)];
        },
        error: (error) => {
          console.error('Ошибка загрузки категорий:', error);
        }
      });
      this.recalculateTotal();
    }
    this.showConfirmationAddModal = false;
    this.currentItemIndex = -1;
    this.newCategoryToAdd = '';
    this.currentItemCategory = '';
  }

  closeChangeCategoryModal(): void {
    this.showChangeCategoryModal = false;
    this.currentItemIndex = -1;
    this.currentItemCategory = '';
  }

  closeConfirmationChangesModal(): void {
    this.showConfirmationChangesModal = false;
    this.currentItemIndex = -1;
    this.selectedNewCategory = '';
    this.currentItemCategory = '';
  }

  closeAddCategoryModal(): void {
    this.showAddCategoryModal = false;
  }

  closeConfirmationAddModal(): void {
    this.showConfirmationAddModal = false;
    this.currentItemIndex = -1;
    this.newCategoryToAdd = '';
    this.currentItemCategory = '';
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
        this.confirmed.emit();
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
    this.modalStateService.closeModal();
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}

