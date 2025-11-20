import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRouting } from '@angular/ssr';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRouting(serverRoutes),
    // Ensure hydration is available on server side
    provideClientHydration(withEventReplay())
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
