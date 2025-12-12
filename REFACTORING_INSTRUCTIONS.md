# Инструкции по завершению рефакторинга

## ✅ Что уже сделано

1. ✅ Создана новая структура папок:
   - `core/guards/` - RoleGuard, AuthGuard
   - `core/interceptors/` - AuthInterceptor  
   - `core/services/` - AuthService, ApiService
   - `core/models/` - модели данных
   - `core/layouts/main-layout/` - главный layout
   - `shared/components/sidebar/` - компонент sidebar
   - `shared/components/header/` - компонент header
   - `features/` - директории для модулей

2. ✅ Создан MainLayoutComponent с sidebar и header
3. ✅ Обновлен роутинг с использованием layout
4. ✅ Улучшен RoleGuard

## 🔄 Что нужно сделать

### 1. Переместить компоненты в features

Переместить существующие компоненты:

```bash
# Auth
mv src/app/auth/login src/app/features/auth/login

# Receipts  
mv src/app/hr/receipts/* src/app/features/receipts/

# Admin
mv src/app/admin/users src/app/features/admin/users
```

### 2. Обновить импорты в login.component.ts

В `src/app/features/auth/login/login.component.ts`:

```typescript
import { AuthService } from '../../../core/services/auth.service';
import { LoginPayload } from '../../../core/models/user.model';

// Обновить redirectByRole:
private redirectByRole(role: string): void {
  switch (role) {
    case 'hr-manager':
      this.router.navigate(['/app/receipts']);
      break;
    case 'economist':
      this.router.navigate(['/app/analytics']);
      break;
    case 'director':
      this.router.navigate(['/app/reports']);
      break;
    case 'admin':
      this.router.navigate(['/app/admin/users']);
      break;
    default:
      this.router.navigate(['/app/receipts']);
  }
}
```

### 3. Создать заглушки для новых модулей

Создать компоненты-заглушки в features:

- `features/analytics/analytics.component.ts`
- `features/analytics/reports.component.ts`
- `features/warehouse/warehouse.component.ts`
- `features/notifications/notifications.component.ts`

### 4. Обновить импорты в receipts компонентах

В компонентах receipts обновить пути:
- `../../../core/models/receipt.model` → `../../../../core/models/receipt.model`
- `../../services/receipts.service` → `../../services/receipts.service`

### 5. Переместить receipts.service.ts

```bash
mv src/app/hr/services/receipts.service.ts src/app/features/receipts/services/receipts.service.ts
```

### 6. Удалить старые директории

После перемещения всех файлов удалить:
- `src/app/auth/` (кроме features/auth)
- `src/app/hr/`
- `src/app/admin/` (кроме features/admin)
- `src/app/economist/`
- `src/app/director/`

## 📁 Финальная структура

```
src/app/
├── core/
│   ├── guards/
│   ├── interceptors/
│   ├── services/
│   ├── models/
│   └── layouts/
│       └── main-layout/
├── shared/
│   └── components/
│       ├── sidebar/
│       └── header/
├── features/
│   ├── auth/
│   │   └── login/
│   ├── receipts/
│   │   ├── services/
│   │   ├── upload-receipt/
│   │   ├── receipt-preview/
│   │   └── receipts-page/
│   ├── recognition/
│   ├── warehouse/
│   ├── analytics/
│   ├── notifications/
│   └── admin/
│       └── users/
├── app.component.ts
└── app.routes.ts
```

## 🚀 После завершения

1. Проверить, что все импорты обновлены
2. Запустить `npm start`
3. Проверить работу layout на всех страницах
4. Проверить навигацию в sidebar

