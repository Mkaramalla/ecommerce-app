import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Hydration is enabled for SSR builds
    // When using ng serve without SSR, this will show a warning but won't break the app
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch()
    ),
    provideAnimationsAsync()
  ]
};
