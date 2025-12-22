import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarehouseService } from '../../../features/warehouse/services/warehouse.service';
import { WarehouseItem, CreateWriteOffRulePayload, WriteOffRule } from '../../../core/models/warehouse.model';
import { ModalContainerDirective } from '../../directives/modal-container.directive';
import { ModalStateService } from '../../../core/services/modal-state.service';

@Component({
  selector: 'app-new-write-off-rule-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalContainerDirective],
  templateUrl: './new-write-off-rule-modal.component.html',
  styleUrls: ['./new-write-off-rule-modal.component.css']
})
export class NewWriteOffRuleModalComponent implements OnInit, OnDestroy {
  @Input() warehouseItems: WarehouseItem[] = [];
  @Input() editMode = false;
  @Input() editingRule: WriteOffRule | null = null;
  @Output() ruleCreated = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  searchQuery = signal<string>('');
  filteredItems = signal<WarehouseItem[]>([]);
  selectedItem = signal<WarehouseItem | null>(null);
  intervalDays = signal<number>(3);
  quantityPerWriteoff = signal<number>(1);
  showDropdown = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  isVisible = true;
  isItemTouched = signal<boolean>(false);

  constructor(
    private warehouseService: WarehouseService,
    private modalStateService: ModalStateService
  ) { }

  ngOnInit(): void {
    this.modalStateService.openModal();
    this.filteredItems.set(this.warehouseItems);

    // If in edit mode, pre-fill the values
    if (this.editMode && this.editingRule) {
      this.intervalDays.set(this.editingRule.intervalDays);
      this.quantityPerWriteoff.set(this.editingRule.quantityPerWriteoff);

      const item = this.warehouseItems.find(i => i.productId === this.editingRule!.productId);
      if (item) {
        this.selectedItem.set(item);
        this.searchQuery.set(item.name);
      }
    }
  }

  ngOnDestroy(): void {
    this.modalStateService.closeModal();
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.showDropdown.set(true);

    const query = value.toLowerCase().trim();
    if (!query) {
      this.filteredItems.set(this.warehouseItems);
      return;
    }

    const filtered = this.warehouseItems.filter(item =>
      item.name.toLowerCase().includes(query)
    );
    this.filteredItems.set(filtered);
  }

  onItemClick(item: WarehouseItem): void {
    this.selectedItem.set(item);
    this.showDropdown.set(false);
    this.searchQuery.set(item.name);
    this.isItemTouched.set(true);
  }

  onIntervalChange(value: number): void {
    if (value >= 1 && value <= 365) {
      this.intervalDays.set(value);
    } else if (value > 365) {
      this.intervalDays.set(365);
    } else if (value < 1) {
      this.intervalDays.set(1);
    }
  }

  onQuantityChange(value: number): void {
    if (value >= 1 && value <= 1000) {
      this.quantityPerWriteoff.set(value);
    } else if (value > 1000) {
      this.quantityPerWriteoff.set(1000);
    } else if (value < 1) {
      this.quantityPerWriteoff.set(1);
    }
  }

  incrementInterval(): void {
    if (this.intervalDays() < 365) {
      this.intervalDays.update(d => d + 1);
    }
  }

  decrementInterval(): void {
    if (this.intervalDays() > 1) {
      this.intervalDays.update(d => d - 1);
    }
  }

  incrementQuantity(): void {
    if (this.quantityPerWriteoff() < 1000) {
      this.quantityPerWriteoff.update(q => q + 1);
    }
  }

  decrementQuantity(): void {
    if (this.quantityPerWriteoff() > 1) {
      this.quantityPerWriteoff.update(q => q - 1);
    }
  }

  createRule(): void {
    this.isItemTouched.set(true);
    if (!this.selectedItem() || this.intervalDays() < 1 || this.intervalDays() > 365 || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    const payload: CreateWriteOffRulePayload = {
      productId: this.selectedItem()!.productId,
      intervalDays: this.intervalDays(),
      quantityPerWriteoff: this.quantityPerWriteoff()
    };

    this.warehouseService.createWriteOffRule(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.ruleCreated.emit();
        this.close();
      },
      error: (error) => {
        console.error('Ошибка создания правила:', error);
        this.isSubmitting.set(false);
        alert('Ошибка при создании правила');
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

  onInputBlur(): void {
    setTimeout(() => {
      this.showDropdown.set(false);
    }, 200);
  }

  isConfirmButtonDisabled(): boolean {
    return !this.selectedItem() || this.intervalDays() < 1 || this.intervalDays() > 365 ||
      this.quantityPerWriteoff() < 1 || this.isSubmitting();
  }

  getItemError(): string {
    if (!this.isItemTouched()) return '';
    if (!this.selectedItem()) return 'Необходимо выбрать товар';
    return '';
  }

  hasItemError(): boolean {
    return !!this.getItemError();
  }

  getIntervalError(): string {
    const interval = this.intervalDays();
    if (interval < 1) return 'Минимальное значение: 1 день';
    if (interval > 365) return 'Максимальное значение: 365 дней';
    return '';
  }

  hasIntervalError(): boolean {
    return !!this.getIntervalError();
  }

  getQuantityError(): string {
    const qty = this.quantityPerWriteoff();
    if (qty < 1) return 'Минимальное значение: 1';
    if (qty > 1000) return 'Максимальное значение: 1000';
    return '';
  }

  hasQuantityError(): boolean {
    return !!this.getQuantityError();
  }

  getModalTitle(): string {
    return this.editMode ? 'Редактирование правила' : 'Новое правило списания';
  }

  getButtonText(): string {
    if (this.isSubmitting()) {
      return this.editMode ? 'Сохранение...' : 'Создание...';
    }
    return 'Подтвердить';
  }
}
