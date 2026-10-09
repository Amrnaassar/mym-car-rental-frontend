import { TestBed } from '@angular/core/testing';

import { AdminSuppliers } from './admin-suppliers';

describe('AdminSuppliers', () => {
  let service: AdminSuppliers;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminSuppliers);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
