import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStep3 } from './booking-step-3';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';

describe('BookingStep3', () => {
  let component: BookingStep3;
  let fixture: ComponentFixture<BookingStep3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingStep3],
      providers: [
        provideHttpClient(),
        provideTranslateService()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingStep3);
    component = fixture.componentInstance;

    component.booking = {
      pickupDate: new Date(),
      returnDate: new Date(),
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});