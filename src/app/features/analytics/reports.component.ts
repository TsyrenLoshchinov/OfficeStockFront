import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-page">
      <h1>Отчёты</h1>
      <p>Страница отчётов для директора</p>
      <p>Здесь будут отображаться отчёты по корпоративным покупкам</p>
      <p>Выгрузка в Excel, CSV, PDF</p>
    </div>
  `,
  styles: [`
    .reports-page {
      padding: 40px;
      text-align: center;
    }
    h1 {
      color: #C22918;
      font-family: 'Inter', sans-serif;
    }
  `]
})
export class ReportsComponent {
}

