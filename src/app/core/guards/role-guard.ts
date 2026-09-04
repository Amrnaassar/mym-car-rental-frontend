import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthService
} from '../services/auth.service';

import {
  UserRole
} from '../models/user.model';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles =
    route.data['roles'] as UserRole[];

  if (!allowedRoles?.length) {
    return true;
  }

  if (allowedRoles.includes(user.role)) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};