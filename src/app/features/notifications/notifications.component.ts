import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomDropdownComponent, DropdownOption } from '../../shared/components/custom-dropdown/custom-dropdown.component';

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, CustomDropdownComponent],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  // Временные данные для отображения (без логики)
  notifications = signal<Notification[]>([
    {
      id: 1,
      title: 'Нужно купить Эзену сушняк',
      message: 'На складе осталось 0 бутылок энергоса.',
      date: '2025-10-19',
      isRead: true
    },
    {
      id: 2,
      title: 'Необходимо пополнить запасы',
      message: 'На складе осталось 4 бутылки пива. Нужно пополнить запасы',
      date: '2025-10-19',
      isRead: false
    },
    {
      id: 3,
      title: 'Нужны купить сиги',
      message: 'На складе осталось 4 пачки сигарет. Нужно пополнить запасы',
      date: '2025-10-19',
      isRead: false
    },
    {
      id: 4,
      title: 'Срочно купить 3л воды',
      message: 'Срочно оформить заказ у поставщика "АкваСервис" на 200 единиц продукции. Для этого необходимо выполнить следующие действия: перейти в раздел "Закупки" в системе электронного документооборота, выбрать поставщика "АкваСервис" из списка approved vendors, заполнить форму заказа с указанием артикулов продукции, согласовать заявку с финансовым отделом',
      date: '2025-10-19',
      isRead: true
    },
    {
      id: 5,
      title: 'Срочно купить 3л воды',
      message: 'Срочно оформить заказ у поставщика "АкваСервис" на 200 единиц продукции. Для этого необходимо выполнить следующие действия: перейти в раздел "Закупки" в системе электронного документооборота, выбрать поставщика "АкваСервис" из списка approved vendors, заполнить форму заказа с указанием артикулов продукции, согласовать заявку с финансовым отделом',
      date: '2025-10-19',
      isRead: true
    },
    {
      id: 6,
      title: 'Срочно купить 3л воды',
      message: 'Срочно оформить заказ у поставщика "АкваСервис" на 200 единиц продукции. Для этого необходимо выполнить следующие действия: перейти в раздел "Закупки" в системе электронного документооборота, выбрать поставщика "АкваСервис" из списка approved vendors, заполнить форму заказа с указанием артикулов продукции, согласовать заявку с финансовым отделом',
      date: '2025-10-19',
      isRead: true
    }
  ]);

  filterType = signal<string>('all');

  filterOptions: DropdownOption[] = [
    { value: 'all', label: 'Показать все' },
    { value: 'unread', label: 'Непрочитанные' },
    { value: 'read', label: 'Прочитанные' }
  ];

  filteredNotifications = computed(() => {
    const all = this.notifications();
    const filter = this.filterType();
    
    if (filter === 'all') {
      return all;
    } else if (filter === 'unread') {
      return all.filter(n => !n.isRead);
    } else if (filter === 'read') {
      return all.filter(n => n.isRead);
    }
    return all;
  });

  onFilterChange(value: string): void {
    this.filterType.set(value);
  }

  deleteNotification(id: number): void {
    this.notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }

  clearAll(): void {
    this.notifications.set([]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
}

