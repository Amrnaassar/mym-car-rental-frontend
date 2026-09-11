import { inject } from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthService
} from '../services/auth.service';

import {
  UserRole
} from '../models/user.model';

export const homeEntryGuard: CanActivateFn = () => {

  const authService =
    inject(AuthService);

  const router =
    inject(Router);

  const user =
    authService.currentUser();

  if (!user) {
    return true;
  }

  const isAdmin =
    user.role === UserRole.Employee ||
    user.role === UserRole.Manager;

  if (isAdmin) {
    return router.createUrlTree([
      '/admin/dashboard'
    ]);
  }

  return true;
};