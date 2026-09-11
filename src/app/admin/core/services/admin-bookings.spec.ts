import { TestBed } from '@angular/core/testing';

import { AdminBookings } from './admin-bookings';

describe('AdminBookings', () => {
  let service: AdminBookings;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminBookings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
