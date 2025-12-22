import { Component, OnInit, OnDestroy, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarehouseService } from '../../../features/warehouse/services/warehouse.service';
import { WriteOffRule, UpdateWriteOffRulePayload } from '../../../core/models/warehouse.model';
import { ModalContainerDirective } from '../../directives/modal-container.directive';
import { ModalStateService } from '../../../core/services/modal-state.service';

@Component({
  selector: 'app-automatic-write-off-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalContainerDirective],
  templateUrl: './automatic-write-off-modal.component.html',
  styleUrls: ['./automatic-write-off-modal.component.css']
})
export class AutomaticWriteOffModalComponent implements OnInit, OnDestroy {
  @Output() addRuleRequested = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  rules = signal<WriteOffRule[]>([]);
  isLoading = signal<boolean>(false);
  isVisible = true;

  // Edit mode state
  editingRuleId = signal<number | null>(null);
  editIntervalDays = signal<number>(1);
  editQuantityPerWriteoff = signal<number>(1);

  constructor(
    private warehouseService: WarehouseService,
    private modalStateService: ModalStateService
  ) { }

  ngOnInit(): void {
    this.modalStateService.openModal();
    this.loadRules();
  }

  ngOnDestroy(): void {
    this.modalStateService.closeModal();
  }

  loadRules(): void {
    this.isLoading.set(true);
    // First load warehouse items to cache product names
    this.warehouseService.getWarehouseItems().subscribe({
      next: () => {
        // Then load rules
        this.warehouseService.getWriteOffRules().subscribe({
          next: (rules) => {
            this.rules.set(rules);
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('Ошибка загрузки правил списания:', error);
            this.isLoading.set(false);
            alert('Ошибка при загрузке правил списания');
          }
        });
      },
      error: (error) => {
        console.error('Ошибка загрузки товаров:', error);
        this.isLoading.set(false);
      }
    });
  }

  formatFrequency(rule: WriteOffRule): string {
    const days = rule.intervalDays;
    if (days === 1) {
      return '1 день';
    } else if (days >= 2 && days <= 4) {
      return `${days} дня`;
    } else {
      return `${days} дней`;
    }
  }

  formatQuantity(rule: WriteOffRule): string {
    return `${rule.quantityPerWriteoff} шт.`;
  }

  startEdit(rule: WriteOffRule): void {
    this.editingRuleId.set(rule.id);
    this.editIntervalDays.set(rule.intervalDays);
    this.editQuantityPerWriteoff.set(rule.quantityPerWriteoff);
  }

  cancelEdit(): void {
    this.editingRuleId.set(null);
  }

  saveEdit(rule: WriteOffRule): void {
    const payload: UpdateWriteOffRulePayload = {
      intervalDays: this.editIntervalDays(),
      quantityPerWriteoff: this.editQuantityPerWriteoff()
    };

    this.warehouseService.updateWriteOffRule(rule.id, payload).subscribe({
      next: (updatedRule) => {
        this.rules.update(rules =>
          rules.map(r => r.id === rule.id ? updatedRule : r)
        );
        this.editingRuleId.set(null);
      },
      error: (error) => {
        console.error('Ошибка обновления правила:', error);
        alert('Ошибка при обновлении правила');
      }
    });
  }

  toggleRuleActive(rule: WriteOffRule): void {
    const payload: UpdateWriteOffRulePayload = {
      isActive: !rule.isActive
    };

    this.warehouseService.updateWriteOffRule(rule.id, payload).subscribe({
      next: (updatedRule) => {
        this.rules.update(rules =>
          rules.map(r => r.id === rule.id ? updatedRule : r)
        );
      },
      error: (error) => {
        console.error('Ошибка изменения статуса:', error);
        alert('Ошибка при изменении статуса правила');
      }
    });
  }

  deleteRule(ruleId: number): void {
    if (confirm('Вы уверены, что хотите удалить это правило?')) {
      this.warehouseService.deleteWriteOffRule(ruleId).subscribe({
        next: () => {
          this.rules.update(rules => rules.filter(r => r.id !== ruleId));
        },
        error: (error) => {
          console.error('Ошибка удаления правила:', error);
          alert('Ошибка при удалении правила');
        }
      });
    }
  }

  deleteAllRules(): void {
    if (confirm('Вы уверены, что хотите удалить все правила?')) {
      const allRules = this.rules();
      let deleted = 0;
      let errors = 0;

      allRules.forEach(rule => {
        this.warehouseService.deleteWriteOffRule(rule.id).subscribe({
          next: () => {
            deleted++;
            if (deleted + errors === allRules.length) {
              this.rules.set([]);
              if (errors > 0) {
                alert(`Удалено ${deleted} правил, ошибок: ${errors}`);
              }
            }
          },
          error: () => {
            errors++;
            if (deleted + errors === allRules.length) {
              this.loadRules();
              alert(`Удалено ${deleted} правил, ошибок: ${errors}`);
            }
          }
        });
      });

      if (allRules.length === 0) {
        this.rules.set([]);
      }
    }
  }

  close(): void {
    this.isVisible = false;
    this.modalStateService.closeModal();
    this.closed.emit();
  }

  onAddClick(): void {
    this.addRuleRequested.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onIntervalChange(value: number): void {
    if (value >= 1 && value <= 365) {
      this.editIntervalDays.set(value);
    }
  }

  onQuantityChange(value: number): void {
    if (value >= 1) {
      this.editQuantityPerWriteoff.set(value);
    }
  }
}
