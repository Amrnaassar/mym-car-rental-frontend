import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStep2 } from './booking-step-2';

describe('BookingStep2', () => {
  let component: BookingStep2;
  let fixture: ComponentFixture<BookingStep2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingStep2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingStep2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
