import {
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { REQUEST } from '@angular/core';

import { environment } from '../../../environments/environment';
import { ssrAuthCookieInterceptor } from './ssr-auth-cookie-interceptor-interceptor';

describe('ssrAuthCookieInterceptor', () => {
  it('should forward the SSR cookie to API requests', () => {
    const cookie = 'mym_access_token=abc123';

    const request = new HttpRequest(
      'GET',
      `${environment.apiUrl}/cars`
    );

    const next = jasmine.createSpy('next').and.returnValue(
      new HttpResponse({
        status: 200
      })
    );

    const ssrRequest = {
      headers: {
        get: (name: string) =>
          name.toLowerCase() === 'cookie'
            ? cookie
            : null
      }
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: REQUEST,
          useValue: ssrRequest
        }
      ]
    });

    TestBed.runInInjectionContext(() => {
      ssrAuthCookieInterceptor(request, next);
    });

    expect(next).toHaveBeenCalled();

    const interceptedRequest =
      next.calls.mostRecent().args[0] as HttpRequest<unknown>;

    expect(interceptedRequest.headers.get('Cookie'))
      .toBe(cookie);

    expect(interceptedRequest.withCredentials)
      .toBeTrue();
  });
});