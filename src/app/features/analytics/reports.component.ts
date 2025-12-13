import { Component, OnInit, signal, computed, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarehouseService } from '../warehouse/services/warehouse.service';
import { WarehouseItem } from '../../core/models/warehouse.model';
import { CategoriesService } from '../categories/services/categories.service';
import { ModalContainerDirective } from '../../shared/directives/modal-container.directive';
import { ModalStateService } from '../../core/services/modal-state.service';

interface BalanceItem {
  name: string;
  category: string;
  quantity: number;
}

interface ExpenseItem {
  name: string;
  category: string;
  amount: number;
}

interface SupplierItem {
  name: string;
  checksCount: number;
  totalAmount: number;
  averageCheck: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalContainerDirective],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChart') donutChartRef!: ElementRef<HTMLCanvasElement>;

  activeTab = signal<'balances' | 'expenses' | 'suppliers'>('balances');
  showVisualization = signal(false);
  
  warehouseItems = signal<WarehouseItem[]>([]);
  selectedItems = signal<number[]>([]);
  selectedCategories = signal<string[]>([]);
  dateFrom = signal<string>('');
  dateTo = signal<string>('');
  openFilterSections = signal<Set<string>>(new Set(['categories', 'products', 'period']));

  // Исходные данные
  private allBalancesData: BalanceItem[] = [
    { name: 'Вафли «Яшкино»', category: 'Вафли', quantity: 5 },
    { name: 'Пластырь прозрачный 3шт.', category: 'Аптека', quantity: 3 },
    { name: 'Чай зеленый «Fantasy Peach»', category: 'Чай', quantity: 1 }
  ];

  // Отфильтрованные данные
  balancesData = computed(() => {
    let filtered = [...this.allBalancesData];

    // Фильтр по категориям
    if (this.selectedCategories().length > 0) {
      filtered = filtered.filter(item => this.selectedCategories().includes(item.category));
    }

    // Фильтр по товарам
    if (this.selectedItems().length > 0) {
      const selectedNames = this.warehouseItems()
        .filter(item => this.selectedItems().includes(item.id))
        .map(item => item.name);
      filtered = filtered.filter(item => selectedNames.includes(item.name));
    }

    return filtered;
  });

  expensesData = signal<ExpenseItem[]>([
    { name: 'Вафли «Яшкино»', category: 'Вафли', amount: 445.00 },
    { name: 'Пластырь прозрачный 3шт.', category: 'Аптека', amount: 378.00 },
    { name: 'Чай зеленый «Fantasy Peach»', category: 'Чай', amount: 163.00 }
  ]);

  suppliersData = signal<SupplierItem[]>([
    { name: 'ООО «Магнит»', checksCount: 1, totalAmount: 986.00, averageCheck: 445.00 },
    { name: 'ООО «Ярче»', checksCount: 2, totalAmount: 745.00, averageCheck: 372.50 }
  ]);

  private barChart: any = null;
  private donutChart: any = null;

  constructor(
    private warehouseService: WarehouseService,
    private categoriesService: CategoriesService,
    private modalStateService: ModalStateService
  ) {
    // Устанавливаем даты по умолчанию (текущий месяц)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    this.dateFrom.set(this.formatDateForInput(firstDay));
    this.dateTo.set(this.formatDateForInput(lastDay));
  }

  ngOnInit(): void {
    this.loadWarehouseItems();
    this.loadCategories();
  }

  availableCategories = computed(() => {
    const categories = new Set<string>();
    this.balancesData().forEach(item => {
      categories.add(item.category);
    });
    return Array.from(categories).sort();
  });

  ngAfterViewInit(): void {
    // Инициализация графиков будет при открытии модалки
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  loadWarehouseItems(): void {
    this.warehouseService.getWarehouseItems().subscribe({
      next: (items) => {
        this.warehouseItems.set(items);
      },
      error: (error) => {
        console.error('Ошибка загрузки товаров:', error);
      }
    });
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (categories) => {
        // Категории уже загружены через availableCategories computed
      },
      error: (error) => {
        console.error('Ошибка загрузки категорий:', error);
      }
    });
  }

  setActiveTab(tab: 'balances' | 'expenses' | 'suppliers'): void {
    this.activeTab.set(tab);
    // Обновляем открытые секции фильтров в зависимости от вкладки
    if (tab === 'balances') {
      this.openFilterSections.set(new Set(['categories', 'products', 'period']));
    } else {
      this.openFilterSections.set(new Set(['period']));
    }
  }

  toggleFilterSection(section: string): void {
    const sections = new Set(this.openFilterSections());
    if (sections.has(section)) {
      sections.delete(section);
    } else {
      sections.add(section);
    }
    this.openFilterSections.set(sections);
  }

  isFilterSectionOpen(section: string): boolean {
    return this.openFilterSections().has(section);
  }

  toggleItem(itemId: number): void {
    const selected = new Set(this.selectedItems());
    if (selected.has(itemId)) {
      selected.delete(itemId);
    } else {
      selected.add(itemId);
    }
    this.selectedItems.set(Array.from(selected));
  }

  toggleCategory(category: string): void {
    const selected = new Set(this.selectedCategories());
    if (selected.has(category)) {
      selected.delete(category);
    } else {
      selected.add(category);
    }
    this.selectedCategories.set(Array.from(selected));
  }

  onDateFromChange(value: string): void {
    this.dateFrom.set(value);
  }

  onDateToChange(value: string): void {
    this.dateTo.set(value);
  }

  totalExpenses = computed(() => {
    return this.expensesData().reduce((sum, item) => sum + item.amount, 0);
  });

  totalSuppliersExpenses = computed(() => {
    return this.suppliersData().reduce((sum, item) => sum + item.totalAmount, 0);
  });

  categoryData = computed(() => {
    const categories = new Map<string, number>();
    this.balancesData().forEach(item => {
      const count = categories.get(item.category) || 0;
      categories.set(item.category, count + item.quantity);
    });

    const colors = ['#D76B49', '#DD8D76', '#C22918', '#9A0E10'];
    let colorIndex = 0;

    return Array.from(categories.entries()).map(([name, value]) => ({
      name,
      value,
      color: colors[colorIndex++ % colors.length]
    }));
  });

  totalItems = computed(() => {
    return this.balancesData().reduce((sum, item) => sum + item.quantity, 0);
  });

  openVisualization(): void {
    this.showVisualization.set(true);
    this.modalStateService.openModal();
    setTimeout(() => {
      this.initCharts();
    }, 100);
  }

  closeVisualization(): void {
    this.showVisualization.set(false);
    this.modalStateService.closeModal();
    this.destroyCharts();
  }

  private initCharts(): void {
    // Проверяем наличие Chart.js
    if (typeof window !== 'undefined' && (window as any).Chart) {
      this.createBarChart();
      this.createDonutChart();
    } else {
      // Создаем простую визуализацию без Chart.js
      this.createSimpleCharts();
    }
  }

  private createBarChart(): void {
    if (!this.barChartRef?.nativeElement) return;

    const ctx = this.barChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const Chart = (window as any).Chart;
    const data = this.balancesData();

    if (this.barChart) {
      this.barChart.destroy();
    }

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.name),
        datasets: [{
          label: 'Количество',
          data: data.map(item => item.quantity),
          backgroundColor: ['#D76B49', '#DD8D76', '#C22918'],
          borderColor: ['#C22918', '#9A0E10', '#7A0A0A'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  private createDonutChart(): void {
    if (!this.donutChartRef?.nativeElement) return;

    const ctx = this.donutChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const Chart = (window as any).Chart;
    const categoryData = this.categoryData();

    if (this.donutChart) {
      this.donutChart.destroy();
    }

    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categoryData.map(cat => cat.name),
        datasets: [{
          data: categoryData.map(cat => cat.value),
          backgroundColor: categoryData.map(cat => cat.color),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  private createSimpleCharts(): void {
    this.createSimpleBarChart();
    this.createSimpleDonutChart();
  }

  private createSimpleBarChart(): void {
    if (!this.barChartRef?.nativeElement) return;

    const canvas = this.barChartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Устанавливаем размеры
    canvas.width = 600;
    canvas.height = 300;

    const data = this.balancesData();
    const maxValue = Math.max(...data.map(item => item.quantity), 1);
    const barWidth = (canvas.width - 100) / data.length - 20;
    const chartHeight = canvas.height - 60;
    const colors = ['#D76B49', '#DD8D76', '#C22918'];

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем оси
    ctx.strokeStyle = '#DBDCE4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, chartHeight + 20);
    ctx.lineTo(canvas.width - 20, chartHeight + 20);
    ctx.moveTo(50, 20);
    ctx.lineTo(50, chartHeight + 20);
    ctx.stroke();

    // Рисуем столбцы
    data.forEach((item, index) => {
      const barHeight = (item.quantity / maxValue) * chartHeight;
      const x = 70 + index * (barWidth + 20);
      const y = chartHeight + 20 - barHeight;

      // Столбец
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(x, y, barWidth, barHeight);

      // Подпись
      ctx.fillStyle = '#535353';
      ctx.font = '12px Montserrat';
      ctx.textAlign = 'center';
      const label = item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name;
      ctx.fillText(label, x + barWidth / 2, chartHeight + 40);
      ctx.fillText(item.quantity.toString(), x + barWidth / 2, y - 5);
    });

    // Подписи осей
    ctx.fillStyle = '#535353';
    ctx.font = '14px Montserrat';
    ctx.textAlign = 'center';
    ctx.fillText('Товары', canvas.width / 2, canvas.height - 5);
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Количество', 0, 0);
    ctx.restore();
  }

  private createSimpleDonutChart(): void {
    if (!this.donutChartRef?.nativeElement) return;

    const canvas = this.donutChartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Устанавливаем размеры
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    const categoryData = this.categoryData();
    const total = categoryData.reduce((sum, cat) => sum + cat.value, 0);
    if (total === 0) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 100;
    const innerRadius = 70;

    let currentAngle = -Math.PI / 2;

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем сегменты
    categoryData.forEach((category) => {
      const sliceAngle = (category.value / total) * 2 * Math.PI;
      const midAngle = currentAngle + sliceAngle / 2;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = category.color;
      ctx.fill();

      // Внутренний круг для donut эффекта
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, innerRadius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Добавляем цифры (проценты) на сегменты
      const percentage = ((category.value / total) * 100).toFixed(0);
      // Показываем проценты только если сегмент достаточно большой (>5%)
      if (parseFloat(percentage) > 5) {
        const textRadius = (radius + innerRadius) / 2;
        const textX = centerX + Math.cos(midAngle) * textRadius;
        const textY = centerY + Math.sin(midAngle) * textRadius;

        // Добавляем тень для лучшей читаемости
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Montserrat';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${percentage}%`, textX, textY);

        // Сбрасываем тень
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      currentAngle += sliceAngle;
    });

    // Центральный текст
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Montserrat';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total.toString(), centerX, centerY);
  }

  private destroyCharts(): void {
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }
    if (this.donutChart) {
      this.donutChart.destroy();
      this.donutChart = null;
    }
  }

  downloadReport(type: 'expenses' | 'suppliers'): void {
    // Здесь будет логика скачивания отчета
    console.log(`Скачивание отчета: ${type}`);
    alert(`Функция скачивания отчета "${type}" будет реализована позже`);
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
