import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AdminBookingsService } from './admin-bookings';
import { environment } from '../../../../environments/environment';
import {
  BookingResponse,
  BookingStatus
} from '../../../core/models/booking.model';

describe('AdminBookingsService', () => {
  let service: AdminBookingsService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/bookings`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminBookingsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AdminBookingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all bookings', () => {
    const mockBookings: BookingResponse[] = [];

    service.getAll().subscribe(bookings => {
      expect(bookings).toEqual(mockBookings);
    });

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('GET');

    request.flush(mockBookings);
  });

  it('should get a booking by id', () => {
    const bookingId = '123';

    const mockBooking = {
      id: bookingId
    } as BookingResponse;

    service.getById(bookingId).subscribe(booking => {
      expect(booking).toEqual(mockBooking);
    });

    const request = httpMock.expectOne(
      `${apiUrl}/${bookingId}`
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockBooking);
  });

  it('should update booking status', () => {
    const bookingId = '123';
    const status = BookingStatus.Confirmed;

    service.updateStatus(bookingId, status).subscribe();

    const request = httpMock.expectOne(
      `${apiUrl}/${bookingId}/status`
    );

    expect(request.request.method).toBe('PUT');

    expect(request.request.body).toEqual({
      status
    });

    request.flush(null);
  });

  it('should cancel a booking', () => {
    const bookingId = '123';

    service.cancel(bookingId).subscribe();

    const request = httpMock.expectOne(
      `${apiUrl}/${bookingId}/cancel`
    );

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });
});