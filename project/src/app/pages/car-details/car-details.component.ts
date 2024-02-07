import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  carCardInterface,
  userInterface,
} from '../../shared/interfaces/registerInterface';
import { CarsService } from 'src/app/shared/services/cars-service/cars.service';
import { AuthService } from 'src/app/shared/services/auth-service/auth.service';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css'],
})
export class CarDetailsComponent {
  carId: number | null = null;
  carDetails?: carCardInterface;
  user?: userInterface;

  constructor(
    private route: ActivatedRoute,
    private carsService: CarsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const carIdParam = params['id'];
      if (carIdParam !== null && carIdParam !== undefined) {
        this.carId = carIdParam;
      }
    });

    if (this.carId) {
      this.carsService.getCarById(this.carId.toString()).subscribe((res) => {
        this.carDetails = res.data() as carCardInterface;

        if (this.carDetails.userId) {
          this.authService
            .getUserById(this.carDetails.userId)
            .subscribe((author) => {
              this.user = author.data() as userInterface;
            });
        }
      });
    }
  }
}
