import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/auth.model';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login with Google and update authentication state', () => {
    const idToken = 'google-token';

    const user = {
      id: '1',
      fullName: 'Test User',
      email: 'test@example.com'
    } as User;

    const response = {
      user
    } as AuthResponse;

    service.googleLogin(idToken).subscribe(result => {
      expect(result).toBe(response);
      expect(service.currentUser()).toBe(user);
      expect(service.isLoggedIn()).toBeTrue();
    });

    const request = httpMock.expectOne(
      `${apiUrl}/google`
    );

    expect(request.request.method).toBe('POST');

    expect(request.request.body).toEqual({
      idToken
    });

    request.flush(response);
  });
});