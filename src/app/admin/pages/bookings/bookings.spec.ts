import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bookings } from './bookings';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';

describe('Bookings', () => {
  let component: Bookings;
  let fixture: ComponentFixture<Bookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bookings],
      providers: [provideHttpClient(), provideTranslateService()]

    })
      .compileComponents();

    fixture = TestBed.createComponent(Bookings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
