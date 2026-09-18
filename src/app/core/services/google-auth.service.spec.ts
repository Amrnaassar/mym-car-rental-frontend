import { TestBed } from '@angular/core/testing';
import {
  PLATFORM_ID
} from '@angular/core';

import { GoogleAuthService } from './google-auth.service';

describe('GoogleAuthService', () => {
  let service: GoogleAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GoogleAuthService,
        {
          provide: PLATFORM_ID,
          useValue: 'server'
        }
      ]
    });

    service = TestBed.inject(GoogleAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not render the Google button on the server', () => {
    const element = document.createElement('div');

    service.renderButton(element);

    expect(element.innerHTML).toBe('');
  });
});