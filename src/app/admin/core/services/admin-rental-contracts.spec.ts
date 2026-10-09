import { TestBed } from '@angular/core/testing';

import { AdminRentalContracts } from './admin-rental-contracts';

describe('AdminRentalContracts', () => {
  let service: AdminRentalContracts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRentalContracts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
