export type UserRole = 'admin' | 'hr-manager' | 'economist' | 'director';

export interface User {
  userId: number;
  username: string;
  role: UserRole;
}

export interface LoginPayload {
  username: string;
  password: string;
}

// Ответ от бэкенда (snake_case)
export interface LoginResponseBackend {
  user_id: number;
  user_name: string;
  role: UserRole;
  access_token: string;
}

// Нормализованный ответ для использования в приложении (camelCase)
export interface LoginResponse {
  accessToken: string;
  role: UserRole;
  userId: number;
  username: string;
}

