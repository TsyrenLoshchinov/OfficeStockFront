import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from './services/categories.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(false);
  showAddModal = signal<boolean>(false);
  newCategoryName = signal<string>('');
  isSubmitting = signal<boolean>(false);

  sortedCategories = computed(() => {
    const sorted = [...this.categories()];
    return sorted.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  });

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Ошибка загрузки категорий:', error);
        this.isLoading.set(false);
        alert('Ошибка при загрузке категорий');
      }
    });
  }

  openAddModal(): void {
    this.showAddModal.set(true);
    this.newCategoryName.set('');
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
    this.newCategoryName.set('');
  }

  addCategory(): void {
    const name = this.newCategoryName().trim();
    if (!name) {
      alert('Введите название категории');
      return;
    }

    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.categoriesService.addCategory(name).subscribe({
      next: (newCategory) => {
        this.categories.update(cats => [...cats, newCategory]);
        this.isSubmitting.set(false);
        this.closeAddModal();
      },
      error: (error) => {
        console.error('Ошибка добавления категории:', error);
        this.isSubmitting.set(false);
        alert('Ошибка при добавлении категории');
      }
    });
  }

  onCategoryNameChange(value: string): void {
    this.newCategoryName.set(value);
  }

  deleteCategory(id: number): void {
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
      this.categoriesService.deleteCategory(id).subscribe({
        next: () => {
          this.categories.update(cats => cats.filter(c => c.id !== id));
        },
        error: (error) => {
          console.error('Ошибка удаления категории:', error);
          alert('Ошибка при удалении категории');
        }
      });
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeAddModal();
    }
  }
}

