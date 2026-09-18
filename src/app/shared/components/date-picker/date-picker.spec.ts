import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  DatePickerComponent
} from './date-picker';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(
      DatePickerComponent
    );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the selected date and close the calendar', () => {
    const emitSpy = spyOn(
      component.valueChange,
      'emit'
    );

    const selectedDay = {
      date: new Date(2026, 8, 18),
      day: 18,
      currentMonth: true,
      disabled: false,
      selected: false,
      today: false
    };

    component.isOpen = true;

    component.selectDate(selectedDay);

    expect(emitSpy).toHaveBeenCalledWith(
      '2026-09-18'
    );

    expect(component.isOpen).toBeFalse();
  });
});