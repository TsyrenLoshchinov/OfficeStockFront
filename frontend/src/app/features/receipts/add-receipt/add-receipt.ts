import { Component, signal } from '@angular/core';

type ReceiptState = 'default' | 'added' | 'process';

@Component({
  selector: 'app-add-receipt',
  standalone: false,
  templateUrl: './add-receipt.html',
  styleUrl: './add-receipt.scss',
})
export class AddReceipt {
  protected readonly state = signal<ReceiptState>('default');
  protected readonly fileName = signal('47594_PN0hg.jpg');
  protected readonly progress = signal(37);

  protected showAdded(): void {
    this.state.set('added');
  }

  protected startProcess(): void {
    this.state.set('process');
  }

  protected reset(): void {
    this.state.set('default');
    this.progress.set(37);
  }
}
