import { Injectable, signal } from '@angular/core';

export type AlertType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface AlertOptions {
  type: AlertType;
  title: string;
  message?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private readonly currentAlert = signal<AlertOptions | null>(null);

  readonly alert = this.currentAlert.asReadonly();

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  success(
    title: string,
    message?: string,
    duration = 4500
  ): void {
    this.show({
      type: 'success',
      title,
      message,
      duration
    });
  }

  error(
    title: string,
    message?: string,
    duration = 6000
  ): void {
    this.show({
      type: 'error',
      title,
      message,
      duration
    });
  }

  warning(
    title: string,
    message?: string,
    duration = 5000
  ): void {
    this.show({
      type: 'warning',
      title,
      message,
      duration
    });
  }

  info(
    title: string,
    message?: string,
    duration = 4500
  ): void {
    this.show({
      type: 'info',
      title,
      message,
      duration
    });
  }

  dismiss(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.currentAlert.set(null);
  }

  private show(options: AlertOptions): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.currentAlert.set(options);

    if (options.duration! > 0) {
      this.timeoutId = setTimeout(() => {
        this.dismiss();
      }, options.duration);
    }
  }
}