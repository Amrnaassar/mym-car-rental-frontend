import {
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { credentialsInterceptor } from './credentials-interceptor';

describe('credentialsInterceptor', () => {
  it('should add withCredentials to the request', () => {
    const request = new HttpRequest(
      'GET',
      '/api/cars'
    );

    const next = jasmine.createSpy('next').and.returnValue(
      new HttpResponse({
        status: 200
      })
    );

    TestBed.runInInjectionContext(() => {
      credentialsInterceptor(request, next);
    });

    expect(next).toHaveBeenCalled();

    const interceptedRequest =
      next.calls.mostRecent().args[0];

    expect(interceptedRequest.withCredentials).toBeTrue();
  });
});