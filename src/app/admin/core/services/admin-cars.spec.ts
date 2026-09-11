import { TestBed } from '@angular/core/testing';

import { AdminCars } from './admin-cars';

describe('AdminCars', () => {
  let service: AdminCars;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCars);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
