import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  NoPreloading,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
  withViewTransitions
} from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { catchErrorInterceptor, credentialsInterceptor, loaderInterceptor } from '@shared';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions(), withPreloading(NoPreloading)),
    provideHttpClient(withInterceptors([catchErrorInterceptor, credentialsInterceptor, loaderInterceptor])),
  ]
};
