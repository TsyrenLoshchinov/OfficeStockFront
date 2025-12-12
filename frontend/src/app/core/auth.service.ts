import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  login: string;
  name: string;
  position: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly currentUser = signal<User | null>({
    id: '1',
    login: 'admin',
    name: 'Иванов Иван Иванович',
    position: 'HR-менеджер',
    email: 'iiivanov@pochta.com',
  });

  signIn(login: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (login && password) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  }

  signOut(): void {
    this.currentUser.set(null);
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  updateProfile(updates: Partial<User>): void {
    const current = this.currentUser();
    if (current) {
      this.currentUser.set({ ...current, ...updates });
    }
  }
}

