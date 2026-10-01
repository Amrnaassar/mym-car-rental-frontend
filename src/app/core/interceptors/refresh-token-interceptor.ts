import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';

import {
  catchError,
  switchMap,
  throwError
} from 'rxjs';

import { AuthService } from '../services/auth.service';

export const refreshTokenInterceptor: HttpInterceptorFn =
  (req, next) => {

    const authService = inject(AuthService);

    return next(req).pipe(

      catchError((error: HttpErrorResponse) => {

        const isUnauthorized =
          error.status === 401;

        const isAuthRequest =
          req.url.includes('/auth/google') ||
          req.url.includes('/auth/refresh-token');

        // Only handle 401 responses from protected API requests.
        if (
          !isUnauthorized ||
          isAuthRequest
        ) {
          return throwError(() => error);
        }

        // Try to refresh the authentication session.
        return authService.refreshToken().pipe(

          switchMap(() => {

            // Refresh succeeded.
            // Retry the original request.
            return next(req);
          }),

          catchError(refreshError => {

            // Refresh failed.
            // The user's session is no longer valid.
            authService.clearAuthentication();

            // Keep the error in the HTTP pipeline,
            // but do not show a generic 401 alert.
            return throwError(
              () => refreshError
            );
          })
        );
      })
    );
  };