import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-changes-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-changes-modal.component.html',
  styleUrls: ['./confirmation-changes-modal.component.css']
})
export class ConfirmationChangesModalComponent {
  @Input() oldCategory: string = '';
  @Input() newCategory: string = '';
  @Output() confirmed = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  isVisible = true;

  confirm(): void {
    this.confirmed.emit();
    this.close();
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

