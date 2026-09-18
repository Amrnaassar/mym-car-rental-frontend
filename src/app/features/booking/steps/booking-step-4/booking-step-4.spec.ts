import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStep4 } from './booking-step-4';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';

describe('BookingStep4', () => {
  let component: BookingStep4;
  let fixture: ComponentFixture<BookingStep4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingStep4],
            providers: [ provideHttpClient(), provideTranslateService() ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingStep4);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
