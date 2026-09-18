import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStep2 } from './booking-step-2';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';

describe('BookingStep2', () => {
  let component: BookingStep2;
  let fixture: ComponentFixture<BookingStep2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingStep2],
      providers: [provideHttpClient(), provideTranslateService()]

    })
      .compileComponents();

    fixture = TestBed.createComponent(BookingStep2);
    component = fixture.componentInstance;

    component.booking = {
      customerFullName: ''
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
