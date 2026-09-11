import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'app-admin-empty-state',
  standalone: true,
  templateUrl: './admin-empty-state.component.html',
  styleUrl: './admin-empty-state.component.scss'
})
export class AdminEmptyStateComponent {

  @Input()
  title = 'No Data';

  @Input()
  description = '';

}