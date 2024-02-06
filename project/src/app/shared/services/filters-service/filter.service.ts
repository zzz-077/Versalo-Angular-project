import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { carInterface } from '../../interfaces/registerInterface';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(private firestore: AngularFirestore) {}

  getFilters(): Observable<carInterface[]> {
    return this.firestore
      .collection<carInterface>('CarFilters')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => a.payload.doc.data());
        })
      );
  }
}
// //  Add filters easily on the firestore

// addOldData() {
//   const filters = oldData;

//   filters.forEach((filter: any, index: number) => {
//     this.firestore
//       .collection('CarFilters')
//       .add({
//         carModel: filter.carModel,
//         carPrice: filter.carPrice,
//         carYear: filter.carYear,
//         carCategory: filter.carCategory,
//         gearBox: filter.gearBox,
//       })
//       .then(() => {
//         console.log(`Car ${index + 1} migrated successfully`);
//       })
//       .catch((error) => {
//         console.error(`Error migrating car ${index + 1}:`, error);
//       });
//   });
// }

/** */

// const oldData = [
//   {
//     carModel: [
//       'opel',
//       'volkswagen',
//       'toyota',
//       'mercedes-benz',
//       'ford',
//       'bmw',
//       'honda',
//       'hyundai',
//       'nissan',
//       'kia',
//       'volvo',
//       'tesla',
//       'audi',
//       'chevrolet',
//       'chrysler',
//       'dodge',
//       'ferrari',
//       'fiat',
//       'jaguar',
//       'jeep',
//       'lamborghini',
//       'land rover',
//       'lexus',
//       'mazda',
//       'mclaren',
//       'mitsubishi',
//       'porsche',
//       'rolls-royce',
//       'subaru',
//       'suzuki',
//       'acura',
//       'alfa romeo',
//       'bentley',
//       'buick',
//       'cadillac',
//       'genesis',
//       'gmc',
//       'infiniti',
//       'lincoln',
//       'maserati',
//       'mini',
//       'ram',
//       'smart',
//       'tesla',
//       'volvo',
//       'aston martin',
//       'fisker',
//       'hummer',
//       'isuzu',
//       'lotus',
//       'maybach',
//       'pagani',
//       'saturn',
//       'scion',
//       'spyker',
//       'saab',
//       'hennessey',
//       'lucid motors',
//       'rivian',
//       'rimac',
//       'koenigsegg',
//       'byd',
//       'geely',
//       'great wall',
//       'haval',
//       'jac',
//       'chery',
//     ],
//     carPrice: [
//       100, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000,
//       12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 25000,
//       30000, 35000, 40000, 45000, 50000, 55000, 60000, 70000, 80000, 90000,
//       100000,
//     ],
//     carYear: [
//       2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
//       2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001,
//       2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990, 1989,
//       1988, 1987, 1986, 1985, 1984, 1983, 1982, 1981, 1980,
//     ],
//     carCategory: [
//       'convertable',
//       'coupe',
//       'pickup trucks',
//       'hatchback',
//       'sedan',
//       'sports car',
//       'compact',
//       'suv',
//       'crossover',
//       'wagons',
//       'microcar',
//       'van',
//       'luxury',
//       'electric',
//     ],
//     gearBox: ['automatic', 'manual'],
//   },
// ];
