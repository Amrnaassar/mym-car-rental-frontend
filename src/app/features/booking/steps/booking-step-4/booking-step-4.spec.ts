import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStep4 } from './booking-step-4';

describe('BookingStep4', () => {
  let component: BookingStep4;
  let fixture: ComponentFixture<BookingStep4>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingStep4]
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
