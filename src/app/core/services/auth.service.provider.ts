import { Provider } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthMockService } from './auth-mock.service';
import { environment } from '../../../environments/environment';

/**
 * Провайдер для выбора между реальным и mock-сервисом авторизации
 */
export function provideAuthService(): Provider[] {
  if (environment.useMockAuth) {
    return [
      { provide: AuthService, useClass: AuthMockService }
    ];
  } else {
    return [
      { provide: AuthService, useClass: AuthService }
    ];
  }
}

