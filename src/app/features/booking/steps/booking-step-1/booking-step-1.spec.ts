import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStep1 } from './booking-step-1';

describe('BookingStep1', () => {
  let component: BookingStep1;
  let fixture: ComponentFixture<BookingStep1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingStep1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingStep1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
