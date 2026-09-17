import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';
import { AlertService, AlertType } from '../../services/alert.service';


@Component({
  selector: 'app-alert',
  standalone: true,
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent {

  readonly alertService = inject(AlertService);

  getIcon(type: AlertType): string {
    switch (type) {
      case 'success':
        return 'fa-solid fa-circle-check';

      case 'error':
        return 'fa-solid fa-circle-exclamation';

      case 'warning':
        return 'fa-solid fa-triangle-exclamation';

      case 'info':
        return 'fa-solid fa-circle-info';
    }
  }
}