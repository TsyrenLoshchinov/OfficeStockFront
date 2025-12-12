# План рефакторинга архитектуры

## ✅ Выполнено

1. ✅ Создана новая структура папок:
   - `core/guards/` - RoleGuard, AuthGuard
   - `core/interceptors/` - AuthInterceptor
   - `core/services/` - AuthService, ApiService
   - `core/models/` - User, Receipt модели
   - `core/layouts/` - MainLayout (создается)
   - `shared/components/` - общие компоненты
   - `features/` - модули по функциям

2. ✅ Улучшен RoleGuard с проверкой ролей

3. ✅ Перемещены сервисы в core/services

## 🔄 В процессе

Создание layout компонентов и обновление роутинга.

## 📋 Следующие шаги

1. Создать компоненты:
   - `core/layouts/main-layout/main-layout.component.ts`
   - `shared/components/sidebar/sidebar.component.ts`
   - `shared/components/header/header.component.ts`

2. Переместить компоненты в features:
   - `features/auth/login/` - страница входа
   - `features/receipts/` - модуль чеков
   - `features/admin/` - администрирование
   - и т.д.

3. Обновить роутинг:
   - `/auth/login` - без layout
   - `/app/*` - с layout (все страницы после авторизации)

4. Создать навигацию в sidebar по ролям

