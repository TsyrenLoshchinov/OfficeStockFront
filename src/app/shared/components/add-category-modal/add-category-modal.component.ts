import { Component, Output, EventEmitter, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../../features/categories/services/categories.service';
import { ModalContainerDirective } from '../../directives/modal-container.directive';
import { ModalStateService } from '../../../core/services/modal-state.service';

@Component({
  selector: 'app-add-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalContainerDirective],
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.css']
})
export class AddCategoryModalComponent implements OnInit, OnDestroy {
  @Output() categoryAdded = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  newCategoryName = signal<string>('');
  isSubmitting = signal<boolean>(false);
  isVisible = true;

  constructor(
    private categoriesService: CategoriesService,
    private modalStateService: ModalStateService
  ) {}

  ngOnInit(): void {
    this.modalStateService.openModal();
  }

  ngOnDestroy(): void {
    this.modalStateService.closeModal();
  }

  onCategoryNameChange(value: string): void {
    this.newCategoryName.set(value);
  }

  addCategory(): void {
    const name = this.newCategoryName().trim();
    if (!name || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.categoriesService.addCategory(name).subscribe({
      next: (newCategory) => {
        this.isSubmitting.set(false);
        this.categoryAdded.emit(newCategory.name);
        this.close();
      },
      error: (error) => {
        console.error('Ошибка добавления категории:', error);
        this.isSubmitting.set(false);
        alert('Ошибка при добавлении категории');
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

  isAddButtonDisabled(): boolean {
    return !this.newCategoryName().trim() || this.isSubmitting();
  }
}

