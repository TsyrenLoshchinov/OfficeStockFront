import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-page">
      <h1>Уведомления</h1>
      <p>Модуль уведомлений</p>
      <p>Пуш-уведомления в UI, email</p>
      <p>Малый остаток товара, отклонения в чеках</p>
    </div>
  `,
  styles: [`
    .notifications-page {
      padding: 40px;
      text-align: center;
    }
    h1 {
      color: #C22918;
      font-family: 'Inter', sans-serif;
    }
  `]
})
export class NotificationsComponent {
}

