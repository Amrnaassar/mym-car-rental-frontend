import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import {
  inject
} from '@angular/core';

import {
  catchError,
  switchMap,
  throwError
} from 'rxjs';

import { AuthService } from '../services/auth.service';

export const refreshTokenInterceptor: HttpInterceptorFn =
  (req, next) => {

    const authService =
      inject(AuthService);

    return next(req).pipe(

      catchError((error: HttpErrorResponse) => {

        const isUnauthorized =
          error.status === 401;

        const isAuthRequest =
          req.url.includes('/auth/google') ||
          req.url.includes('/auth/refresh-token');

        if (
          !isUnauthorized ||
          isAuthRequest
        ) {
          return throwError(() => error);
        }

        return authService.refreshToken().pipe(

          switchMap(() => {

            return next(req);
          }),

          catchError(refreshError => {

            authService.clearAuthentication();

            return throwError(
              () => refreshError
            );
          })
        );
      })
    );
  };