import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from './services/categories.service';
import { Category } from '../../core/models/category.model';
import { AddCategoryModalComponent } from '../../shared/components/add-category-modal/add-category-modal.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, AddCategoryModalComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(false);
  showAddModal = signal<boolean>(false);

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
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }

  onCategoryAdded(categoryName: string): void {
    // Категория уже добавлена через сервис в модалке, просто обновляем список
    this.loadCategories();
    this.closeAddModal();
  }

  deleteCategory(name: string): void {
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
      this.categoriesService.deleteCategory(name).subscribe({
        next: () => {
          this.categories.update(cats => cats.filter(c => c.name !== name));
        },
        error: (error) => {
          console.error('Ошибка удаления категории:', error);
          alert('Ошибка при удалении категории');
        }
      });
    }
  }

}

