import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recognition',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="recognition-page">
      <h1>Распознавание чеков</h1>
      <p>Модуль распознавания</p>
      <p>QR → данные чека, OCR fallback</p>
      <p>Модальное окно дубликатов, сравнение с таблицей чеков</p>
    </div>
  `,
  styles: [`
    .recognition-page {
      padding: 40px;
      text-align: center;
    }
    h1 {
      color: #C22918;
      font-family: 'Inter', sans-serif;
    }
  `]
})
export class RecognitionComponent {
}

