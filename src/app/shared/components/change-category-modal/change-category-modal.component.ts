import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../../features/categories/services/categories.service';
import { Category } from '../../../core/models/category.model';
import { ModalStateService } from '../../../core/services/modal-state.service';
import { ModalContainerDirective } from '../../directives/modal-container.directive';

@Component({
  selector: 'app-change-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalContainerDirective],
  templateUrl: './change-category-modal.component.html',
  styleUrls: ['./change-category-modal.component.css']
})
export class ChangeCategoryModalComponent implements OnInit, OnDestroy {
  @Input() currentCategory: string = '';
  @Input() itemIndex: number = -1;
  @Output() categorySelected = new EventEmitter<string>();
  @Output() addCategoryRequested = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  categories = signal<Category[]>([]);
  searchQuery = signal<string>('');
  filteredCategories = signal<Category[]>([]);
  selectedCategory = signal<string | null>(null);
  showDropdown = signal<boolean>(false);
  isVisible = true;

  constructor(
    private categoriesService: CategoriesService,
    private modalStateService: ModalStateService
  ) {}

  ngOnInit(): void {
    this.modalStateService.openModal();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.modalStateService.closeModal();
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.filteredCategories.set(categories);
      },
      error: (error) => {
        console.error('Ошибка загрузки категорий:', error);
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
    this.showDropdown.set(true);
    
    const query = value.toLowerCase().trim();
    if (!query) {
      this.filteredCategories.set(this.categories());
      return;
    }

    const filtered = this.categories().filter(cat =>
      cat.name.toLowerCase().includes(query)
    );
    this.filteredCategories.set(filtered);
  }

  onCategoryClick(categoryName: string): void {
    this.selectedCategory.set(categoryName);
    this.showDropdown.set(false);
    this.searchQuery.set(categoryName);
  }

  onInputBlur(): void {
    // Закрываем выпадающий список при потере фокуса
    setTimeout(() => {
      this.showDropdown.set(false);
    }, 200);
  }

  onSelectClick(): void {
    if (this.selectedCategory()) {
      this.categorySelected.emit(this.selectedCategory()!);
      this.close();
    }
  }

  onAddCategoryClick(): void {
    this.addCategoryRequested.emit();
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

  isSelectButtonDisabled(): boolean {
    return !this.selectedCategory();
  }
}

