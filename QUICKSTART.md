# Быстрый старт

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Настройте URL бэкенда в `src/environments/environment.ts`:
```typescript
apiUrl: 'http://localhost:3000/api' // Замените на ваш URL
```

3. Запустите приложение:
```bash
npm start
```

4. Откройте браузер: `http://localhost:4200`

## Тестирование авторизации

Для тестирования вам понадобится бэкенд с эндпоинтами:
- `POST /api/auth/login` — авторизация
- `POST /api/receipts/upload` — загрузка чека
- `POST /api/receipts/confirm` — подтверждение чека

## Структура маршрутов

- `/auth/login` — страница входа
- `/hr/receipts` — модуль загрузки чеков (hr-manager)
- `/economist/analytics` — аналитика (economist)
- `/director/reports` — отчёты (director)
- `/admin/users` — управление пользователями (admin)

После успешного входа пользователь автоматически перенаправляется на страницу согласно его роли.

