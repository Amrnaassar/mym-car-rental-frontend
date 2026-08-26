import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStep3 } from './booking-step-3';

describe('BookingStep3', () => {
  let component: BookingStep3;
  let fixture: ComponentFixture<BookingStep3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingStep3]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingStep3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
