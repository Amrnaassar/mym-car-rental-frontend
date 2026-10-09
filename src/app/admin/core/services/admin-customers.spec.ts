import { TestBed } from '@angular/core/testing';

import { AdminCustomers } from './admin-customers';

describe('AdminCustomers', () => {
  let service: AdminCustomers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCustomers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
