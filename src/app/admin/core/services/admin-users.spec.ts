import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { AdminUsersService } from './admin-users';

describe('AdminUsers', () => {

  let service: AdminUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient()
      ]
    });

    service = TestBed.inject(AdminUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});