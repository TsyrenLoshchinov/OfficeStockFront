import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChequesService } from '../services/cheques.service';
import { Cheque } from '../../../core/models/cheque.model';
import { ReceiptModalComponent } from '../../../shared/components/receipt-modal/receipt-modal.component';
import { Receipt } from '../../../core/models/receipt.model';

@Component({
  selector: 'app-cheques-list',
  standalone: true,
  imports: [CommonModule, ReceiptModalComponent],
  templateUrl: './cheques-list.component.html',
  styleUrls: ['./cheques-list.component.css']
})
export class ChequesListComponent implements OnInit {
  cheques = signal<Cheque[]>([]);
  sortOrder = signal<'newest' | 'oldest'>('newest');
  isLoading = signal<boolean>(false);
  selectedCheque: Receipt | null = null;
  showModal = signal<boolean>(false);

  sortedCheques = computed(() => {
    const sorted = [...this.cheques()];
    if (this.sortOrder() === 'newest') {
      return sorted.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
    } else {
      return sorted.sort((a, b) => 
        new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
      );
    }
  });

  constructor(
    private chequesService: ChequesService
  ) {}

  ngOnInit(): void {
    this.loadCheques();
  }

  loadCheques(): void {
    this.isLoading.set(true);
    this.chequesService.getCheques().subscribe({
      next: (cheques) => {
        this.cheques.set(cheques);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Ошибка загрузки чеков:', error);
        this.isLoading.set(false);
      }
    });
  }

  onSortChange(value: string): void {
    if (value === 'all' || value === 'newest') {
      this.sortOrder.set('newest');
    } else {
      this.sortOrder.set('oldest');
    }
  }

  deleteCheque(id: number): void {
    if (confirm('Вы уверены, что хотите удалить этот чек?')) {
      this.chequesService.deleteCheque(id).subscribe({
        next: () => {
          this.cheques.update(cheques => cheques.filter(c => c.id !== id));
        },
        error: (error) => {
          console.error('Ошибка удаления чека:', error);
          alert('Ошибка при удалении чека');
        }
      });
    }
  }

  clearAll(): void {
    if (confirm('Вы уверены, что хотите удалить все чеки?')) {
      this.chequesService.deleteAllCheques().subscribe({
        next: () => {
          this.cheques.set([]);
        },
        error: (error) => {
          console.error('Ошибка удаления всех чеков:', error);
          alert('Ошибка при удалении чеков');
        }
      });
    }
  }

  viewDetails(id: number): void {
    // Загружаем полные данные чека с товарами для модального окна
    this.chequesService.getReceiptById(id).subscribe({
      next: (receipt) => {
        this.selectedCheque = receipt;
        this.showModal.set(true);
      },
      error: (error) => {
        console.error('Ошибка загрузки чека:', error);
        alert('Ошибка при загрузке данных чека');
      }
    });
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedCheque = null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}

