import {
  ChangeDetectionStrategy,
  Component,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  BookingResponse
} from '../../../../core/models/booking.model';

@Component({
  selector: 'app-booking-step-4',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './booking-step-4.html',
  styleUrl: './booking-step-4.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingStep4 {

  @Input()
  booking: BookingResponse | null = null;


  formatDate(value: string | undefined): string {

    if (!value) {
      return 'Not available';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(
      'en-US',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    ).format(date);

  }

}