import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="warehouse-page">
      <h1>Склад</h1>
      <p>Модуль управления складом</p>
      <p>Авто-категоризация, изменение категорий, создание категорий</p>
      <p>Списание товаров, прогноз остатков</p>
    </div>
  `,
  styles: [`
    .warehouse-page {
      padding: 40px;
      text-align: center;
    }
    h1 {
      color: #C22918;
      font-family: 'Inter', sans-serif;
    }
  `]
})
export class WarehouseComponent {
}

