import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './app/interceptor/auth-interceptor';




bootstrapApplication(App, {
  ...appConfig,
  providers: [
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    ...(appConfig.providers || []),
  ],
}).catch(err => console.error(err));
