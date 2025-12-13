import { Component, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseService } from '../../../features/warehouse/services/warehouse.service';
import { WriteOffRule } from '../../../core/models/warehouse.model';

@Component({
  selector: 'app-automatic-write-off-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './automatic-write-off-modal.component.html',
  styleUrls: ['./automatic-write-off-modal.component.css']
})
export class AutomaticWriteOffModalComponent implements OnInit {
  @Output() addRuleRequested = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  rules = signal<WriteOffRule[]>([]);
  isLoading = signal<boolean>(false);
  isVisible = true;

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(): void {
    this.isLoading.set(true);
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
  }

  formatFrequency(rule: WriteOffRule): string {
    if (rule.frequencyUnit === 'days') {
      return `${rule.frequency} ${rule.frequency === 1 ? 'день' : rule.frequency < 5 ? 'дня' : 'дней'}`;
    } else if (rule.frequencyUnit === 'weeks') {
      return `${rule.frequency} ${rule.frequency === 1 ? 'неделя' : rule.frequency < 5 ? 'недели' : 'недель'}`;
    } else {
      return `${rule.frequency} ${rule.frequency === 1 ? 'месяц' : rule.frequency < 5 ? 'месяца' : 'месяцев'}`;
    }
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
      this.warehouseService.deleteAllWriteOffRules().subscribe({
        next: () => {
          this.rules.set([]);
        },
        error: (error) => {
          console.error('Ошибка удаления всех правил:', error);
          alert('Ошибка при удалении правил');
        }
      });
    }
  }

  close(): void {
    this.isVisible = false;
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
}

