export type UserRole = 'admin' | 'hr-manager' | 'economist' | 'director';

export interface User {
  userId: number;
  username: string;
  role: UserRole;
}

export interface LoginPayload {
  login: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  role: UserRole;
  userId: number;
  username: string;
}

