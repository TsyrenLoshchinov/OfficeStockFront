import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { provideAuthService } from './app/core/services/auth.service.provider';
import { environment } from './environments/environment';

const httpClientProviders = environment.useMockAuth
  ? [provideHttpClient()]
  : [provideHttpClient(withInterceptors([authInterceptor]))];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    ...httpClientProviders,
    ...provideAuthService()
  ]
}).catch(err => console.error(err));

