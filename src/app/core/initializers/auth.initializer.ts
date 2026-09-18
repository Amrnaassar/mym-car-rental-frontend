import {
  inject,
  PLATFORM_ID
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import {
  firstValueFrom
} from 'rxjs';

import {
  AuthService
} from '../services/auth.service';

export function initializeAuth(): () => Promise<void> {

  return async () => {

    const platformId = inject(PLATFORM_ID);

    if (!isPlatformBrowser(platformId)) {
      return;
    }

    const authService = inject(AuthService);

    await firstValueFrom(
      authService.initialize()
    );
  };
}