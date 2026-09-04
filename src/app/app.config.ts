import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';

import {
  provideRouter,
  withInMemoryScrolling
} from '@angular/router';

import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';

import {
  provideHttpClient,
  withInterceptors,
  withFetch
} from '@angular/common/http';

import {
  provideTranslateService,
} from '@ngx-translate/core';

import { routes } from './app.routes';

import { refreshTokenInterceptor } from './core/interceptors/refresh-token-interceptor';

import { credentialsInterceptor } from './core/interceptors/credentials-interceptor';

import { initializeAuth } from './core/initializers/auth.initializer';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideZoneChangeDetection({
      eventCoalescing: true
    }),

    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),

    provideClientHydration(
      withEventReplay()
    ),

    provideHttpClient(
      withFetch(),
      withInterceptors([
        credentialsInterceptor,
        refreshTokenInterceptor
      ])
    ),

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    }),

    provideAppInitializer(
      initializeAuth()
    )
  ]
};