import { Component, OnInit } from '@angular/core';
import {
  carCardInterface,
  carInterface,
  userInterface,
} from '../data-service/registerInterface';
import { DataService } from '../data-service/data.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cars-page',
  templateUrl: './cars-page.component.html',
  styleUrls: ['./cars-page.component.css'],
})
export class CarsPageComponent {
  carList: carInterface[] = [];
  carCArds: carCardInterface[] = [];
  constructor(private services: DataService) {}

  /*============================*/
  /*====CAR FILTER FORMGROUP====*/
  /*============================*/
  carForm = new FormGroup({
    Model: new FormControl('Car model'),
    category: new FormControl('Car category'),
    yearFrom: new FormControl('year from'),
    yearTo: new FormControl('to'),
    priceFrom: new FormControl('Price from'),
    priceTo: new FormControl('to'),
    gearbox: new FormControl('gearbox'),
  });

  /*========================*/
  /*====FILTER FUNCTION====*/
  /*========================*/
  filterClick() {
    const filters: any = this.carForm.value;
    Object.keys(filters).forEach(
      (key) =>
        (filters[key] === null ||
          filters[key] === undefined ||
          filters[key] === '') &&
        delete filters[key]
    );

    this.services.searchData(filters).subscribe((filteredData) => {
      console.log(filteredData);
      this.carCArds = filteredData;
    });
  }

  /*========================*/
  /*====GETTING CAR DATA====*/
  /*========================*/
  ngOnInit() {
    this.services.getCarComponentsData().subscribe((item) => {
      if (Array.isArray(item)) {
        this.carList = item;
      }
    });
  }
}
