import {
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';

import { inject } from '@angular/core';

import { catchError, throwError } from 'rxjs';

import { AlertService } from '../../shared/services/alert.service';

export const errorInterceptor: HttpInterceptorFn = (
  req,
  next
) => {

  const alertService = inject(AlertService);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      // 401 is handled by the authentication/refresh flow.
      // Do not show a generic error alert to the user.
      if (error.status === 401) {
        return throwError(() => error);
      }

      handleError(error, alertService);

      return throwError(() => error);
    })
  );
};

function handleError(
  error: HttpErrorResponse,
  alertService: AlertService
): void {

  if (error.status === 0) {

    alertService.error(
      'Connection Error',
      'Unable to connect to the server. Please check your internet connection.'
    );

    return;
  }

  switch (error.status) {

    case 400:

      alertService.warning(
        'Invalid Request',
        getServerMessage(
          error,
          'The request contains invalid data.'
        )
      );

      break;

    case 403:

      alertService.error(
        'Access Denied',
        'You do not have permission to perform this action.'
      );

      break;

    case 404:

      alertService.error(
        'Not Found',
        getServerMessage(
          error,
          'The requested resource was not found.'
        )
      );

      break;

    case 409:

      alertService.warning(
        'Conflict',
        getServerMessage(
          error,
          'This action conflicts with the current state.'
        )
      );

      break;

    case 500:

      alertService.error(
        'Server Error',
        'Something went wrong on the server. Please try again later.'
      );

      break;

    default:

      alertService.error(
        'Something Went Wrong',
        'An unexpected error occurred. Please try again.'
      );

      break;
  }
}

function getServerMessage(
  error: HttpErrorResponse,
  fallback: string
): string {

  if (
    error.error &&
    typeof error.error.message === 'string' &&
    error.error.message.trim()
  ) {
    return error.error.message;
  }

  return fallback;
}