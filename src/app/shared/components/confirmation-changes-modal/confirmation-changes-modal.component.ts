import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalStateService } from '../../../core/services/modal-state.service';
import { ModalContainerDirective } from '../../directives/modal-container.directive';

@Component({
  selector: 'app-confirmation-changes-modal',
  standalone: true,
  imports: [CommonModule, ModalContainerDirective],
  templateUrl: './confirmation-changes-modal.component.html',
  styleUrls: ['./confirmation-changes-modal.component.css']
})
export class ConfirmationChangesModalComponent implements OnInit, OnDestroy {
  @Input() oldCategory: string = '';
  @Input() newCategory: string = '';
  @Output() confirmed = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  isVisible = true;

  constructor(private modalStateService: ModalStateService) {}

  ngOnInit(): void {
    this.modalStateService.openModal();
  }

  ngOnDestroy(): void {
    this.modalStateService.closeModal();
  }

  confirm(): void {
    this.confirmed.emit();
    this.close();
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

