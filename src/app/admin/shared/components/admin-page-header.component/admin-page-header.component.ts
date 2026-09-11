import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-admin-page-header',
  standalone: true,
  templateUrl: './admin-page-header.component.html',
  styleUrl: './admin-page-header.component.scss'
})
export class AdminPageHeaderComponent {

  @Input({ required: true })
  title!: string;

  @Input()
  description = '';

  @Input()
  actionLabel = '';

  @Output()
  actionClick = new EventEmitter<void>();

}