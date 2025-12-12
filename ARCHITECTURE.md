# Архитектура приложения OfficeStock

## Обзор

Angular-приложение построено на основе Standalone Components с модульной архитектурой и разделением по ролям.

## Основные компоненты

### 1. Авторизация (`src/app/auth/`)

#### LoginComponent
- Интегрирована верстка из `OfficeStockFront/pages/Authorization/`
- Использует Reactive Forms для валидации
- Автоматический редирект по ролям после успешного входа

#### AuthService
- Управление токенами (localStorage)
- Методы: `login()`, `logout()`, `isAuthenticated()`, `getRole()`, `hasRole()`
- BehaviorSubject для отслеживания текущего пользователя

#### AuthGuard
- Проверка аутентификации
- Проверка ролей из данных маршрута
- Автоматический редирект при отсутствии доступа

#### AuthInterceptor
- Автоматическое добавление Bearer токена в заголовки всех HTTP-запросов

### 2. HR-модуль (`src/app/hr/`)

#### ReceiptsPageComponent
- Главная страница модуля HR-менеджера
- Управляет состоянием загрузки и предпросмотра чека

#### UploadReceiptComponent
- Интегрирована верстка из `OfficeStockFront/UI/addReceipt/`
- Валидация файлов (формат, размер)
- Отображение прогресса загрузки
- Три состояния: default, uploading, uploaded

#### ReceiptPreviewComponent
- Интегрирована верстка из `OfficeStockFront/modal_windows/CheckInformation/`
- Редактирование данных чека:
  - Название товара
  - Количество
  - Категория
- Автоматический пересчёт общей суммы
- Подтверждение чека

#### ReceiptsService
- `uploadReceipt(file: File)` — загрузка чека через FormData
- `confirmReceipt(receiptData: Receipt)` — подтверждение чека

### 3. Модели данных (`src/app/core/models/`)

#### User Model
```typescript
UserRole = 'admin' | 'hr-manager' | 'economist' | 'director'
User { userId, username, role }
LoginPayload { login, password }
LoginResponse { accessToken, role, userId, username }
```

#### Receipt Model
```typescript
ReceiptItem { name, quantity, price, category? }
Receipt { organization, purchaseDate, totalAmount, items }
ReceiptUploadResponse { ... }
ReceiptConfirmPayload { receiptData }
```

### 4. Роутинг (`src/app/app.routes.ts`)

Маршруты защищены `authGuard` с проверкой ролей:
- `/auth/login` — публичный доступ
- `/hr/receipts` — только `hr-manager`
- `/economist/analytics` — только `economist`
- `/director/reports` — только `director`
- `/admin/users` — только `admin`

Используется lazy loading для оптимизации.

## Интеграция верстки

Все компоненты используют оригинальную верстку из `OfficeStockFront`:
- Сохранены оригинальные CSS стили
- Адаптированы под Angular (директивы, биндинги)
- Добавлена интерактивность через Angular Forms
- Иконки скопированы в `src/assets/icons/`

## Конфигурация

### Environment (`src/environments/`)
- `environment.ts` — development
- `environment.prod.ts` — production
- Настройка `apiUrl` для подключения к бэкенду

### API Service
Централизованное управление базовым URL API через `ApiService`.

## Расширение функциональности

### Добавление нового модуля

1. Создать компонент в соответствующей папке
2. Добавить маршрут в `app.routes.ts` с проверкой роли
3. Реализовать сервисы для работы с API
4. Интегрировать верстку (если есть)

### Пример добавления страницы списка чеков

```typescript
// src/app/hr/receipts/receipts-list/receipts-list.component.ts
@Component({
  selector: 'app-receipts-list',
  standalone: true,
  // ...
})
export class ReceiptsListComponent {
  // ...
}
```

Добавить маршрут:
```typescript
{
  path: 'hr/receipts/list',
  loadComponent: () => import('./hr/receipts/receipts-list/receipts-list.component').then(m => m.ReceiptsListComponent),
  canActivate: [authGuard],
  data: { roles: ['hr-manager'] }
}
```

## Рекомендации

1. **Обработка ошибок**: Добавить глобальный обработчик ошибок HTTP
2. **Уведомления**: Интегрировать систему уведомлений (toast)
3. **Загрузка**: Добавить индикаторы загрузки для долгих операций
4. **Валидация**: Расширить валидацию форм
5. **Тестирование**: Добавить unit-тесты для сервисов и компонентов

