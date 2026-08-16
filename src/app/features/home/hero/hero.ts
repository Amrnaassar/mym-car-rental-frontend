import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  signal,
} from '@angular/core';

export type RentalPlan = 'daily' | 'weekly' | 'monthly';

export interface HeroSearchPayload {
  plan: RentalPlan;
  pickupLocation: string;
  pickupDate: string;
  returnDate: string;
  carType: string;
}

/**
 * Homepage Hero section.
 *
 * Presentational / dumb component: it does not perform navigation or
 * API calls itself. It emits `search` with the collected form values so the
 * parent page (which already owns the router / cars service) decides what
 * to do with it. This keeps the component reusable and easy to test.
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  /** Emits the collected search-widget values when the user submits. */
  @Output() search = new EventEmitter<HeroSearchPayload>();

  protected readonly selectedPlan = signal<RentalPlan>('daily');

  protected selectPlan(plan: RentalPlan): void {
    this.selectedPlan.set(plan);
  }

  protected onSearchSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const data = new FormData(form);

    this.search.emit({
      plan: this.selectedPlan(),
      pickupLocation: String(data.get('pickupLocation') ?? ''),
      pickupDate: String(data.get('pickupDate') ?? ''),
      returnDate: String(data.get('returnDate') ?? ''),
      carType: String(data.get('carType') ?? ''),
    });
  }
}