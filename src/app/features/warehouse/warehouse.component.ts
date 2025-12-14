import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarehouseService } from './services/warehouse.service';
import { WarehouseItem } from '../../core/models/warehouse.model';
import { AutomaticWriteOffModalComponent } from '../../shared/components/automatic-write-off-modal/automatic-write-off-modal.component';
import { NewWriteOffRuleModalComponent } from '../../shared/components/new-write-off-rule-modal/new-write-off-rule-modal.component';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, FormsModule, AutomaticWriteOffModalComponent, NewWriteOffRuleModalComponent],
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  items = signal<WarehouseItem[]>([]);
  isLoading = signal<boolean>(false);
  showAutomaticWriteOffModal = signal<boolean>(false);
  showNewRuleModal = signal<boolean>(false);
  editingItemId = signal<number | null>(null);
  editingQuantity: number = 0;

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading.set(true);
    this.warehouseService.getWarehouseItems().subscribe({
      next: (items) => {
        this.items.set(items);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Ошибка загрузки товаров:', error);
        this.isLoading.set(false);
        alert('Ошибка при загрузке товаров');
      }
    });
  }

  formatDate(dateString: string | null): string {
    if (!dateString) {
      return 'Недостаточно данных';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  startWriteOff(item: WarehouseItem): void {
    this.editingItemId.set(item.id);
    this.editingQuantity = item.quantity;
  }

  decreaseQuantity(): void {
    if (this.editingQuantity > 0) {
      this.editingQuantity--;
    }
  }

  increaseQuantity(maxQuantity: number): void {
    if (this.editingQuantity < maxQuantity) {
      this.editingQuantity++;
    }
  }

  saveQuantity(item: WarehouseItem): void {
    if (this.editingQuantity < 0) {
      alert('Количество не может быть отрицательным');
      return;
    }

    if (this.editingQuantity > item.quantity) {
      alert(`Количество не может превышать текущее количество (${item.quantity})`);
      this.editingQuantity = item.quantity;
      return;
    }

    // Отправляем новое значение rest (остаток) вместо количества для списания
    const newRest = this.editingQuantity;
    
    this.warehouseService.writeOffItem(item.id, newRest).subscribe({
      next: (updatedItem) => {
        // Обновляем список после списания
        this.loadItems();
        this.editingItemId.set(null);
        this.editingQuantity = 0;
      },
      error: (error) => {
        console.error('Ошибка списания товара:', error);
        alert('Ошибка при списании товара');
      }
    });
  }

  openAutomaticWriteOffModal(): void {
    this.showAutomaticWriteOffModal.set(true);
  }

  closeAutomaticWriteOffModal(): void {
    this.showAutomaticWriteOffModal.set(false);
  }

  openNewRuleModal(): void {
    this.showNewRuleModal.set(true);
  }

  closeNewRuleModal(): void {
    this.showNewRuleModal.set(false);
  }

  onNewRuleCreated(): void {
    this.closeNewRuleModal();
    // Обновляем модальное окно автоматического списания, если оно открыто
    // Закрываем и открываем заново для обновления списка правил
    const wasOpen = this.showAutomaticWriteOffModal();
    if (wasOpen) {
      this.closeAutomaticWriteOffModal();
      setTimeout(() => {
        this.openAutomaticWriteOffModal();
      }, 100);
    }
  }

}
