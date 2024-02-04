import { Component, Input } from '@angular/core';
import { carCardInterface } from '../../shared/services/data-service/registerInterface';
@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.css'],
})
export class CarCardComponent {
  @Input() carObj: carCardInterface | null = null;
  @Input() selected = false;
  @Input() isProfilePage = false;
}