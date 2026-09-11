import {
  Component,
  Input
} from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
  @Input({ required: true })
  label!: string;

  @Input({ required: true })
  value!: string | number;

  @Input()
  icon = 'fa-chart-line';
}