import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { BookingService } from './booking.service';
import { environment } from '../../../environments/environment';
import {
  BookingResponse,
  CreateBookingDto
} from '../models/booking.model';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/bookings`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BookingService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a booking', () => {
    const dto = {
      carId: 100000
    } as CreateBookingDto;

    const response = {
      id: 'booking-1'
    } as BookingResponse;

    service.createBooking(dto).subscribe(result => {
      expect(result).toBe(response);
    });

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBe(dto);

    request.flush(response);
  });
});