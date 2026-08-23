import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

interface CalendarDay {
  date: Date;
  day: number;
  currentMonth: boolean;
  disabled: boolean;
  selected: boolean;
  today: boolean;
}

@Component({
  selector: 'app-date-picker',
  standalone: true,
  templateUrl: './date-picker.html',
  styleUrl: './date-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent implements OnChanges {

  /* ============================================================
     INPUTS
  ============================================================ */

  @Input() label = 'Pick-up Date';

  @Input() value = '';

  /**
   * Minimum selectable date.
   *
   * Example:
   * Pick-up Date = 2026-08-25
   * Return Date minDate = 2026-08-25
   */
  @Input() minDate = '';


  /* ============================================================
     OUTPUT
  ============================================================ */

  @Output() valueChange =
    new EventEmitter<string>();


  /* ============================================================
     STATE
  ============================================================ */

  isOpen = false;

  currentMonth = new Date();

  calendarDays: CalendarDay[] = [];


  /* ============================================================
     WEEK DAYS
  ============================================================ */

  readonly weekDays = [
    'Mo',
    'Tu',
    'We',
    'Th',
    'Fr',
    'Sa',
    'Su',
  ];


  /* ============================================================
     ANGULAR LIFECYCLE
  ============================================================ */

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    /*
     * If the selected value changes,
     * move the calendar to that month.
     */
    if (changes['value']) {

      this.syncCalendarWithValue();

    }

    /*
     * If minDate changes,
     * regenerate the calendar so disabled
     * dates update immediately.
     */
    if (changes['minDate']) {

      this.generateCalendar();

    }

    /*
     * Initial generation
     */
    if (
      changes['value'] ||
      changes['minDate']
    ) {

      this.generateCalendar();

    }

  }


  /* ============================================================
     DISPLAY
  ============================================================ */

  get formattedDate(): string {

    if (!this.value) {

      return 'Select a date';

    }

    const date =
      this.parseDate(this.value);

    if (!date) {

      return 'Select a date';

    }

    return new Intl.DateTimeFormat(
      'en-US',
      {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    ).format(date);

  }


  /* ============================================================
     MONTH LABEL
  ============================================================ */

  get monthYearLabel(): string {

    return new Intl.DateTimeFormat(
      'en-US',
      {
        month: 'long',
        year: 'numeric',
      }
    ).format(this.currentMonth);

  }


  /* ============================================================
     OPEN / CLOSE
  ============================================================ */

  toggleCalendar(): void {

    this.isOpen = !this.isOpen;

    if (this.isOpen) {

      this.syncCalendarWithValue();

      this.generateCalendar();

    }

  }


  closeCalendar(): void {

    this.isOpen = false;

  }


  /* ============================================================
     MONTH NAVIGATION
  ============================================================ */

  previousMonth(): void {

    this.currentMonth =
      new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() - 1,
        1
      );

    this.generateCalendar();

  }


  nextMonth(): void {

    this.currentMonth =
      new Date(
        this.currentMonth.getFullYear(),
        this.currentMonth.getMonth() + 1,
        1
      );

    this.generateCalendar();

  }


  /* ============================================================
     DATE SELECTION
  ============================================================ */

  selectDate(
    day: CalendarDay
  ): void {

    /*
     * Never allow disabled dates.
     */
    if (
      day.disabled ||
      !day.currentMonth
    ) {

      return;

    }

    const formattedDate =
      this.formatDate(day.date);


    /*
     * IMPORTANT:
     *
     * Do NOT modify this.value here.
     *
     * value belongs to the parent component.
     *
     * We only emit the new value.
     */
    this.valueChange.emit(
      formattedDate
    );


    /*
     * Move calendar to selected month.
     */
    this.currentMonth =
      new Date(
        day.date.getFullYear(),
        day.date.getMonth(),
        1
      );


    this.generateCalendar();


    /*
     * Close calendar after selection.
     */
    this.isOpen = false;

  }


  /* ============================================================
     CALENDAR GENERATION
  ============================================================ */

  private generateCalendar(): void {

    const year =
      this.currentMonth.getFullYear();

    const month =
      this.currentMonth.getMonth();


    const firstDayOfMonth =
      new Date(
        year,
        month,
        1
      );


    /*
     * Convert Sunday-based JS index
     * to Monday-based calendar.
     */
    const firstDayIndex =
      (
        firstDayOfMonth.getDay() + 6
      ) % 7;


    const daysInCurrentMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate();


    const daysInPreviousMonth =
      new Date(
        year,
        month,
        0
      ).getDate();


    const days: CalendarDay[] = [];


    /* ==========================================================
       PREVIOUS MONTH
    ========================================================== */

    for (
      let i = firstDayIndex - 1;
      i >= 0;
      i--
    ) {

      const dayNumber =
        daysInPreviousMonth - i;


      const date =
        new Date(
          year,
          month - 1,
          dayNumber
        );


      days.push(
        this.createCalendarDay(
          date,
          dayNumber,
          false
        )
      );

    }


    /* ==========================================================
       CURRENT MONTH
    ========================================================== */

    for (
      let dayNumber = 1;
      dayNumber <= daysInCurrentMonth;
      dayNumber++
    ) {

      const date =
        new Date(
          year,
          month,
          dayNumber
        );


      days.push(
        this.createCalendarDay(
          date,
          dayNumber,
          true
        )
      );

    }


    /* ==========================================================
       NEXT MONTH
    ========================================================== */

    const remainingDays =
      42 - days.length;


    for (
      let dayNumber = 1;
      dayNumber <= remainingDays;
      dayNumber++
    ) {

      const date =
        new Date(
          year,
          month + 1,
          dayNumber
        );


      days.push(
        this.createCalendarDay(
          date,
          dayNumber,
          false
        )
      );

    }


    this.calendarDays = days;

  }


  /* ============================================================
     CREATE CALENDAR DAY
  ============================================================ */

  private createCalendarDay(
    date: Date,
    day: number,
    currentMonth: boolean
  ): CalendarDay {

    return {

      date,

      day,

      currentMonth,

      /*
       * A date is disabled when:
       *
       * 1. It is before today
       * OR
       * 2. It is before minDate
       */
      disabled:
        this.isDateDisabled(date),

      selected:
        this.isSelectedDate(date),

      today:
        this.isToday(date),

    };

  }


  /* ============================================================
     DATE DISABLED
  ============================================================ */

  private isDateDisabled(
    date: Date
  ): boolean {

    /*
     * Disable dates before today.
     */
    if (
      this.isPastDate(date)
    ) {

      return true;

    }


    /*
     * If there is no minDate,
     * nothing else needs to be checked.
     */
    if (!this.minDate) {

      return false;

    }


    const minimumDate =
      this.parseDate(
        this.minDate
      );


    /*
     * Invalid minDate.
     */
    if (!minimumDate) {

      return false;

    }


    /*
     * Disable dates BEFORE minDate.
     *
     * minDate itself remains selectable.
     */
    return (
      this.startOfDay(date).getTime() <
      this.startOfDay(minimumDate).getTime()
    );

  }


  /* ============================================================
     PAST DATE
  ============================================================ */

  private isPastDate(
    date: Date
  ): boolean {

    const today =
      this.startOfDay(
        new Date()
      );


    const targetDate =
      this.startOfDay(
        date
      );


    return (
      targetDate.getTime() <
      today.getTime()
    );

  }


  /* ============================================================
     TODAY
  ============================================================ */

  private isToday(
    date: Date
  ): boolean {

    const today =
      new Date();


    return (

      date.getFullYear() ===
      today.getFullYear()

      &&

      date.getMonth() ===
      today.getMonth()

      &&

      date.getDate() ===
      today.getDate()

    );

  }


  /* ============================================================
     SELECTED DATE
  ============================================================ */

  private isSelectedDate(
    date: Date
  ): boolean {

    if (!this.value) {

      return false;

    }


    const selectedDate =
      this.parseDate(
        this.value
      );


    if (!selectedDate) {

      return false;

    }


    return (

      date.getFullYear() ===
      selectedDate.getFullYear()

      &&

      date.getMonth() ===
      selectedDate.getMonth()

      &&

      date.getDate() ===
      selectedDate.getDate()

    );

  }


  /* ============================================================
     START OF DAY
  ============================================================ */

  private startOfDay(
    date: Date
  ): Date {

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

  }


  /* ============================================================
     FORMAT DATE
  ============================================================ */

  private formatDate(
    date: Date
  ): string {

    const year =
      date.getFullYear();


    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');


    const day =
      String(
        date.getDate()
      ).padStart(2, '0');


    return `${year}-${month}-${day}`;

  }


  /* ============================================================
     PARSE DATE
  ============================================================ */

  private parseDate(
    value: string
  ): Date | null {

    if (!value) {

      return null;

    }


    const parts =
      value.split('-');


    if (
      parts.length !== 3
    ) {

      return null;

    }


    const year =
      Number(parts[0]);


    const month =
      Number(parts[1]);


    const day =
      Number(parts[2]);


    if (
      !year ||
      !month ||
      !day
    ) {

      return null;

    }


    return new Date(
      year,
      month - 1,
      day
    );

  }


  /* ============================================================
     SYNC CALENDAR
  ============================================================ */

  private syncCalendarWithValue(): void {

    const selectedDate =
      this.parseDate(
        this.value
      );


    /*
     * If this picker already has
     * a selected date, show its month.
     */
    if (selectedDate) {

      this.currentMonth =
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          1
        );

      return;

    }


    /*
     * If there is no selected value
     * but there is a minDate,
     * open directly on minDate's month.
     */
    const minimumDate =
      this.parseDate(
        this.minDate
      );


    if (minimumDate) {

      this.currentMonth =
        new Date(
          minimumDate.getFullYear(),
          minimumDate.getMonth(),
          1
        );

      return;

    }


    /*
     * Otherwise open on current month.
     */
    const today =
      new Date();


    this.currentMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

  }

}