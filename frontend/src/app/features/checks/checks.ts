import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ChequeService } from '../../core/cheque.service';

@Component({
  selector: 'app-checks',
  standalone: false,
  templateUrl: './checks.html',
  styleUrl: './checks.scss',
})
export class ChecksPage {
  protected readonly cheques = computed(() => this.chequeService.getCheques()());
  protected readonly sortOrder = signal<'newest' | 'oldest'>('newest');

  constructor(
    private readonly chequeService: ChequeService,
    private readonly router: Router
  ) {}

  protected sortedCheques() {
    const list = [...this.cheques()];
    if (this.sortOrder() === 'newest') {
      return list.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    return list.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  protected onSortChange(value: string): void {
    this.sortOrder.set(value === 'all' ? 'newest' : 'oldest');
  }

  protected deleteCheque(id: string): void {
    this.chequeService.deleteCheque(id);
  }

  protected viewDetails(id: string): void {
    this.router.navigate(['/checks', id]);
  }

  protected formatDate(date: Date): string {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }
}

