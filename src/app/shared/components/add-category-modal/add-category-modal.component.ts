import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../../features/categories/services/categories.service';

@Component({
  selector: 'app-add-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.css']
})
export class AddCategoryModalComponent {
  @Output() categoryAdded = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  newCategoryName = signal<string>('');
  isSubmitting = signal<boolean>(false);
  isVisible = true;

  constructor(private categoriesService: CategoriesService) {}

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

