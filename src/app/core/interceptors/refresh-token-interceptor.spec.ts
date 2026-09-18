import {
  HttpErrorResponse,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { refreshTokenInterceptor } from './refresh-token-interceptor';
import { AuthResponse } from '../models/auth.model';

describe('refreshTokenInterceptor', () => {
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj(
      'AuthService',
      [
        'refreshToken',
        'clearAuthentication'
      ]
    );

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    });
  });

  it('should refresh the token and retry the request when the response is 401', () => {
    const request = new HttpRequest(
      'GET',
      '/api/cars'
    );

    const refreshedResponse = new HttpResponse({
      status: 200,
      body: []
    });

    authService.refreshToken.and.returnValue(
      of({} as AuthResponse)
    );

    const next = jasmine
      .createSpy('next')
      .and.returnValues(
        throwError(
          () =>
            new HttpErrorResponse({
              status: 401
            })
        ),
        of(refreshedResponse)
      );

    TestBed.runInInjectionContext(() => {
      refreshTokenInterceptor(request, next).subscribe(
        response => {
          expect(response).toBe(refreshedResponse);
        }
      );
    });

    expect(authService.refreshToken).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(2);
  });
});