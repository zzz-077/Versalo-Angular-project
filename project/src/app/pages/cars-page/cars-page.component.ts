import { Component } from '@angular/core';
import {
  carCardInterface,
  carInterface,
} from '../../shared/interfaces/registerInterface';
import { FormControl, FormGroup } from '@angular/forms';
import { CarsService } from 'src/app/shared/services/cars-service/cars.service';
import { FilterService } from 'src/app/shared/services/filters-service/filter.service';

@Component({
  selector: 'app-cars-page',
  templateUrl: './cars-page.component.html',
  styleUrls: ['./cars-page.component.css'],
})
export class CarsPageComponent {
  carList: carInterface[] = [];
  carCards: carCardInterface[] = [];
  saveCarCards: carCardInterface[] = [];
  priceToArr: number[] = [];
  yearToArr: number[] = [];
  isLoading: boolean = false;
  skletonArray: number[] = new Array(10).fill(0);

  constructor(
    private carsService: CarsService,
    private filterService: FilterService
  ) {
    this.getFilters();
  }

  /*============================*/
  /*====CAR FILTER FORMGROUP====*/
  /*============================*/
  carForm = new FormGroup({
    Model: new FormControl('carModel'),
    category: new FormControl('carCategory'),
    yearFrom: new FormControl('yearFrom'),
    yearTo: new FormControl('yearTo'),
    priceFrom: new FormControl('priceFrom'),
    priceTo: new FormControl('priceTo'),
    gearBox: new FormControl('gearBox'),
  });

  /*========================*/
  /*====GETTING CAR DATA====*/
  /*========================*/
  ngOnInit() {
    this.getFilters();

    this.isLoading = true;
    this.carsService.getCarCollection().subscribe({
      next: (cars) => {
        this.saveCarCards = cars;
        this.carCards = cars; // Initialize carCards with all car cards initially
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  /*========================*/
  /*====FILTER FUNCTION====*/
  /*========================*/
  filterClick() {
    this.isLoading = true;
    this.carCards = [];
    const filters: any = this.carForm.value;
    this.modifyFilterValues(filters);
    Object.keys(filters).forEach(
      (key) =>
        (filters[key] === null ||
          filters[key] === undefined ||
          filters[key] === '') &&
        delete filters[key]
    );

    // this.services.searchData(filters).subscribe((filteredData) => {
    this.carsService
      .getCarCollectionByFilter(filters)
      .subscribe((filteredData) => {
        if (filters?.yearFrom || filters?.yearTo) {
          const yearFrom = filters.yearFrom || Number.MIN_SAFE_INTEGER;
          const yearTo = filters.yearTo || Number.MAX_SAFE_INTEGER;
          filteredData = filteredData.filter(
            (car) => car.carYear >= yearFrom && car.carYear <= yearTo
          );
        }
        if (filters?.priceFrom || filters?.priceTo) {
          const priceFrom = filters.priceFrom || Number.MIN_SAFE_INTEGER;
          const priceTo = filters.priceTo || Number.MAX_SAFE_INTEGER;
          filteredData = filteredData.filter(
            (car) => car.carPrice >= priceFrom && car.carPrice <= priceTo
          );
        }
        this.carCards = filteredData;
        this.isLoading = false;
      });
  }

  clearFilter() {
    this.isLoading = true;
    this.carForm = new FormGroup({
      Model: new FormControl('carModel'),
      category: new FormControl('carCategory'),
      yearFrom: new FormControl('yearFrom'),
      yearTo: new FormControl('yearTo'),
      priceFrom: new FormControl('priceFrom'),
      priceTo: new FormControl('priceTo'),
      gearBox: new FormControl('gearBox'),
    });
    this.carCards = this.saveCarCards;
    this.isLoading = false;
  }

  choosePrice() {
    const filters: any = this.carForm.value;
    if (Number(filters.priceFrom)) {
      console.log(this.carList);
      this.priceToArr = this.carList[0]?.carPrice.filter(
        (price) => price >= filters.priceFrom
      );
    } else {
      this.priceToArr = this.carList[0]?.carPrice;
    }
  }
  chooseYear() {
    const filters: any = this.carForm.value;
    if (Number(filters.yearFrom)) {
      this.yearToArr = this.carList[0]?.carYear.filter(
        (year) => year >= filters.yearFrom
      );
    } else {
      this.yearToArr = this.carList[0]?.carYear;
    }
  }

  modifyFilterValues(filters: any) {
    for (const key in filters) {
      switch (filters[key]) {
        case 'carModel':
          filters[key] = null;
          break;
        case 'carCategory':
          filters[key] = null;
          break;
        case 'yearFrom':
          filters[key] = null;
          break;
        case 'yearTo':
          filters[key] = null;
          break;
        case 'priceFrom':
          filters[key] = null;
          break;
        case 'priceTo':
          filters[key] = null;
          break;
        case 'gearBox':
          filters[key] = null;
          break;
      }
    }
  }

  // Get Filters
  getFilters() {
    this.isLoading = true;
    this.filterService.getFilters().subscribe((filters) => {
      this.carList = filters;

      this.carList[0]?.carCategory.sort();
      this.carList[0]?.carModel.sort();

      this.priceToArr = this.carList[0]?.carPrice;
      this.yearToArr = this.carList[0]?.carYear;
      this.isLoading = false;
    });
  }
}
