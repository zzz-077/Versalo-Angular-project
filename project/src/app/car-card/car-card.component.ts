import { Component, Input } from '@angular/core';
import { carCardInterface } from '../data-service/registerInterface';
@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.css'],
})
export class CarCardComponent {
  @Input() carObj: carCardInterface | null = null;
}
