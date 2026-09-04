import {
  inject
} from '@angular/core';

import {
  firstValueFrom
} from 'rxjs';

import {
  AuthService
} from '../services/auth.service';

export function initializeAuth(): () => Promise<void> {

  return async () => {

    const authService =
      inject(AuthService);

    await firstValueFrom(
      authService.initialize()
    );
  };
}