import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="analytics-page">
      <h1>Аналитика</h1>
      <p>Страница аналитики для экономиста</p>
      <p>Здесь будет отображаться аналитика по чекам и расходам</p>
    </div>
  `,
  styles: [`
    .analytics-page {
      padding: 40px;
      text-align: center;
    }
    h1 {
      color: #C22918;
      font-family: 'Inter', sans-serif;
    }
  `]
})
export class AnalyticsComponent {
}

