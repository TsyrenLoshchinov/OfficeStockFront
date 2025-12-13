import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarehouseService } from '../../../features/warehouse/services/warehouse.service';
import { WarehouseItem, CreateWriteOffRulePayload } from '../../../core/models/warehouse.model';

@Component({
  selector: 'app-new-write-off-rule-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-write-off-rule-modal.component.html',
  styleUrls: ['./new-write-off-rule-modal.component.css']
})
export class NewWriteOffRuleModalComponent implements OnInit {
  @Input() warehouseItems: WarehouseItem[] = [];
  @Output() ruleCreated = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  searchQuery = signal<string>('');
  filteredItems = signal<WarehouseItem[]>([]);
  selectedItem = signal<WarehouseItem | null>(null);
  frequency = signal<number>(3);
  showDropdown = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  isVisible = true;

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    this.filteredItems.set(this.warehouseItems);
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
  }

  onFrequencyChange(value: number): void {
    if (value >= 1) {
      this.frequency.set(value);
    }
  }

  incrementFrequency(): void {
    this.frequency.update(f => f + 1);
  }

  decrementFrequency(): void {
    if (this.frequency() > 1) {
      this.frequency.update(f => f - 1);
    }
  }

  createRule(): void {
    if (!this.selectedItem() || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    const payload: CreateWriteOffRulePayload = {
      itemId: this.selectedItem()!.id,
      frequency: this.frequency(),
      frequencyUnit: 'days'
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
    return !this.selectedItem() || this.isSubmitting();
  }
}

