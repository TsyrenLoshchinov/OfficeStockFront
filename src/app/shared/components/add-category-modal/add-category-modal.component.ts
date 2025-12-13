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
  isTouched = signal<boolean>(false);

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
    this.isTouched.set(true);
  }

  addCategory(): void {
    this.isTouched.set(true);
    const name = this.newCategoryName().trim();
    if (!name || name.length < 2 || name.length > 50 || this.isSubmitting()) {
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
    const name = this.newCategoryName().trim();
    return !name || name.length < 2 || name.length > 50 || this.isSubmitting();
  }

  getCategoryError(): string {
    const name = this.newCategoryName().trim();
    if (!this.isTouched()) return '';
    if (!name) return 'Название категории обязательно';
    if (name.length < 2) return 'Минимальная длина: 2 символа';
    if (name.length > 50) return 'Максимальная длина: 50 символов';
    return '';
  }

  hasCategoryError(): boolean {
    return !!this.getCategoryError();
  }
}

