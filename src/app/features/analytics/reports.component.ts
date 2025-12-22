import { Component, OnInit, signal, computed, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarehouseService } from '../warehouse/services/warehouse.service';
import { WarehouseItem } from '../../core/models/warehouse.model';
import { CategoriesService } from '../categories/services/categories.service';
import { ModalContainerDirective } from '../../shared/directives/modal-container.directive';
import { ModalStateService } from '../../core/services/modal-state.service';
import { ReportsApiService } from './services/reports.service';
import { Chart, registerables } from 'chart.js/auto';

Chart.register(...registerables);

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

  activeTab = signal<'expenses' | 'suppliers'>('expenses');
  showVisualization = signal(false);

  warehouseItems = signal<WarehouseItem[]>([]);
  selectedItems = signal<number[]>([]);
  selectedCategories = signal<string[]>([]);
  dateFrom = signal<string>('');
  dateTo = signal<string>('');
  openFilterSections = signal<Set<string>>(new Set(['period']));

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

  expensesData = signal<ExpenseItem[]>([]);

  suppliersData = signal<SupplierItem[]>([]);

  totalExpenseAmount = signal<number>(0);
  totalSuppliersAmount = signal<number>(0);

  private barChart: Chart | null = null;
  private donutChart: Chart | null = null;

  constructor(
    private warehouseService: WarehouseService,
    private categoriesService: CategoriesService,
    private modalStateService: ModalStateService,
    private reportsApiService: ReportsApiService
  ) {
    // Устанавливаем даты по умолчанию (текущий месяц)
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.dateFrom.set(this.formatDateForInput(firstDay));
    this.dateTo.set(this.formatDateForInput(lastDay));
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadReportsData();
  }

  loadReportsData(): void {
    const startDate = this.dateFrom();
    const endDate = this.dateTo();

    if (startDate && endDate) {
      // Load expenses by category
      this.reportsApiService.getExpensesByCategory(startDate, endDate).subscribe({
        next: (data) => {
          this.expensesData.set(data.categories.map(c => ({
            name: c.category,
            category: c.category,
            amount: c.amount
          })));
          this.totalExpenseAmount.set(data.total);
        },
        error: (error) => console.error('Ошибка загрузки расходов:', error)
      });

      // Load expenses by company (suppliers)
      this.reportsApiService.getExpensesByCompany(startDate, endDate).subscribe({
        next: (data) => {
          this.suppliersData.set(data.suppliers.map(s => ({
            name: s.name,
            checksCount: 0,
            totalAmount: s.totalAmount,
            averageCheck: 0
          })));
          this.totalSuppliersAmount.set(data.total);
        },
        error: (error) => console.error('Ошибка загрузки поставщиков:', error)
      });
    }
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

  setActiveTab(tab: 'expenses' | 'suppliers'): void {
    this.activeTab.set(tab);
    this.openFilterSections.set(new Set(['period']));
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
    this.loadReportsData();
  }

  onDateToChange(value: string): void {
    this.dateTo.set(value);
    this.loadReportsData();
  }

  totalExpenses = computed(() => {
    return this.expensesData().reduce((sum, item) => sum + item.amount, 0);
  });

  totalSuppliersExpenses = computed(() => {
    return this.suppliersData().reduce((sum, item) => sum + item.totalAmount, 0);
  });

  chartData = computed(() => {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#8AC926', '#1982C4', '#6A4C93', '#F15BB5', '#00BBF9', '#FEE440'
    ];

    if (this.activeTab() === 'expenses') {
      return this.expensesData().map((item, index) => ({
        name: item.category,
        value: item.amount,
        color: colors[index % colors.length]
      }));
    } else {
      return this.suppliersData().map((item, index) => ({
        name: item.name,
        value: item.totalAmount,
        color: colors[index % colors.length]
      }));
    }
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
    this.createBarChart();
    this.createDonutChart();
  }

  private createBarChart(): void {
    if (!this.barChartRef?.nativeElement) return;

    if (this.barChart) {
      this.barChart.destroy();
    }

    const data = this.activeTab() === 'expenses' ? this.expensesData() : this.suppliersData();
    const labels = data.map(item => 'category' in item ? item.category : item.name);
    const values = data.map(item => 'amount' in item ? item.amount : item.totalAmount);

    const labelTranslateKey = this.activeTab() === 'expenses' ? 'Расходы' : 'Поставщики';

    // We use the imported Chart, not window.Chart
    this.barChart = new Chart(this.barChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: labelTranslateKey,
          data: values,
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
            '#8AC926', '#1982C4', '#6A4C93', '#F15BB5', '#00BBF9', '#FEE440'
          ],
          borderRadius: 4,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  private createDonutChart(): void {
    if (!this.donutChartRef?.nativeElement) return;

    if (this.donutChart) {
      this.donutChart.destroy();
    }

    const catData = this.chartData();
    if (catData.length === 0) return;

    this.donutChart = new Chart(this.donutChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: catData.map(c => c.name),
        datasets: [{
          data: catData.map(c => c.value),
          backgroundColor: catData.map(c => c.color),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: { boxWidth: 12, padding: 15 }
          }
        }
      }
    });
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

  async downloadReport(type: 'expenses' | 'suppliers'): Promise<void> {
    const jsPDF = (await import('jspdf')).default;
    const html2canvas = (await import('html2canvas')).default;

    // Helper to create hidden container
    const createContainer = () => {
      const el = document.createElement('div');
      el.style.backgroundColor = '#ffffff';
      el.style.fontFamily = 'Arial, sans-serif';
      el.style.padding = '20px';
      el.style.width = '800px';
      return el;
    };

    const mainWrapper = document.createElement('div');
    mainWrapper.style.position = 'absolute';
    mainWrapper.style.top = '-9999px';
    mainWrapper.style.left = '0';
    document.body.appendChild(mainWrapper);

    // 1. Table Container
    const tableContainer = createContainer();
    mainWrapper.appendChild(tableContainer);

    // 2. Bar Chart Container
    const barContainer = createContainer();
    mainWrapper.appendChild(barContainer);

    // 3. Donut Chart Container
    const donutContainer = createContainer();
    mainWrapper.appendChild(donutContainer);

    const title = type === 'expenses' ? 'Отчет по расходам' : 'Отчет по поставщикам';
    const dateStr = `${this.formatDisplayDate(this.dateFrom())} - ${this.formatDisplayDate(this.dateTo())}`;
    const total = type === 'expenses' ? this.totalExpenses() : this.totalSuppliersExpenses();
    const data = this.chartData();

    // --- Fill Table ---
    let tableHtml = `
      <h1 style="color: #C22918; margin-bottom: 10px;">${title}</h1>
      <p style="font-size: 14px; color: #555; margin-bottom: 30px;">Период: ${dateStr}</p>
      <h3 style="margin-bottom: 15px;">Сводная таблица</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">${type === 'expenses' ? 'Категория' : 'Поставщик'}</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Сумма</th>
          </tr>
        </thead>
        <tbody>
    `;
    data.forEach(item => {
      tableHtml += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">${item.value.toFixed(2)}</td>
        </tr>
      `;
    });
    tableHtml += `
        <tr style="font-weight: bold;">
          <td style="padding: 10px; text-align: left;">Итого:</td>
          <td style="padding: 10px; text-align: right;">${total.toFixed(2)}</td>
        </tr>
        </tbody>
      </table>
    `;
    tableContainer.innerHTML = tableHtml;

    // --- Fill Bar Chart ---
    barContainer.innerHTML = `
      <h3 style="margin-bottom: 20px;">Визуализация</h3>
      <div style="display: flex; justify-content: center;">
          <canvas id="pdfBarChart" width="700" height="300"></canvas>
      </div>
    `;

    // --- Fill Donut Chart ---
    let donutHtml = `
      <div style="display: flex; align-items: center; justify-content: space-around; margin-top: 20px;">
           <div style="position: relative; width: 350px; height: 350px;">
              <canvas id="pdfDonutChart"></canvas>
           </div>
           <div style="font-size: 12px;">
    `;
    const totalVal = data.reduce((acc, curr) => acc + curr.value, 0);
    data.forEach(item => {
      const percent = totalVal > 0 ? ((item.value / totalVal) * 100).toFixed(1) : '0';
      donutHtml += `
          <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <span style="display: inline-block; width: 12px; height: 12px; background-color: ${item.color}; margin-right: 8px;"></span>
            <span>${item.name}: <b>${percent}%</b></span>
          </div>
        `;
    });
    donutHtml += `</div></div>`;
    donutContainer.innerHTML = donutHtml;


    // Init Charts
    new Chart(document.getElementById('pdfBarChart') as HTMLCanvasElement, {
      type: 'bar',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map(d => d.color),
          borderRadius: 4,
          barThickness: 30
        }]
      },
      options: {
        responsive: false, animation: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
      }
    });

    new Chart(document.getElementById('pdfDonutChart') as HTMLCanvasElement, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.name),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map(d => d.color),
          borderWidth: 0
        }]
      },
      options: {
        responsive: false, animation: false,
        plugins: { legend: { display: false } }
      }
    });

    try {
      await new Promise(r => setTimeout(r, 600));

      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 295;
      let currentY = 0; // Current position on page in mm

      // Helper to add canvas to PDF
      const addToPdf = async (element: HTMLElement) => {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgHeight = canvas.height * pageWidth / canvas.width;

        // Check if it fits
        if (currentY + imgHeight > pageHeight) {
          doc.addPage();
          currentY = 0;
        }

        doc.addImage(imgData, 'PNG', 0, currentY, pageWidth, imgHeight);
        currentY += imgHeight;
      };

      await addToPdf(tableContainer);
      await addToPdf(barContainer);
      // Force new page for donut if it doesn't fit mostly?
      // Logic inside addToPdf handles it, but let's be sure

      // Small padding between elements if on same page
      if (currentY > 0) currentY += 10;

      await addToPdf(donutContainer);

      doc.save(`${type}_report_${this.dateFrom()}_${this.dateTo()}.pdf`);

    } catch (err) {
      console.error('PDF gen failed', err);
    } finally {
      document.body.removeChild(mainWrapper);
    }
  }

  private formatDisplayDate(dateStr: string): string {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
