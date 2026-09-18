import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ContactService } from './contact.service';
import { environment } from '../../../environments/environment';
import {
  ContactResponse,
  SendContactMessage
} from '../models/contact.model';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/contact`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContactService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a contact message', () => {
    const data = {
      fullName: 'Test User',
      phone:'1234567',
      email: 'test@example.com',
      message: 'Test message'
    } as SendContactMessage;

    const response = {
      message: "success"
    } as ContactResponse;

    service.sendMessage(data).subscribe(result => {
      expect(result).toBe(response);
    });

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBe(data);

    request.flush(response);
  });
});