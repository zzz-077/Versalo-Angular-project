import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  carCardInterface,
  userInterface,
} from '../data-service/registerInterface';
import { DataService } from '../data-service/data.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css'],
})
export class CarDetailsComponent {
  carId: number | null = null;
  carDetails?: carCardInterface;
  user?: userInterface;

  constructor(private route: ActivatedRoute, private services: DataService) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const carIdParam = params['id'];
      if (carIdParam !== null && carIdParam !== undefined) {
        this.carId = +carIdParam;
      }
    });

    this.services
      .getCarDetailsById(this.carId)
      .subscribe((carById: carCardInterface) => {
        this.carDetails = carById;
        this.services.getUserById(this.carDetails?.userId).subscribe((user) => {
          this.user = user;
        });
      });
  }
}
