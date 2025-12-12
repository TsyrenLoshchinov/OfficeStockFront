import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-page">
      <h1>Управление пользователями</h1>
      <p>Страница управления пользователями для администратора</p>
      <p>Здесь будет отображаться список пользователей и управление ролями</p>
    </div>
  `,
  styles: [`
    .users-page {
      padding: 40px;
      text-align: center;
    }
    h1 {
      color: #C22918;
      font-family: 'Inter', sans-serif;
    }
  `]
})
export class UsersComponent {
}

