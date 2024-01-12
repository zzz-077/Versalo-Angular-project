import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  carCardInterface,
  carInterface,
  userInterface,
} from './registerInterface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  /*=================*/
  /*====USER DATA====*/
  /*=================*/
  private registerUrl = 'http://localhost:3000/users';
  private userDataSubject: BehaviorSubject<userInterface[]> =
    new BehaviorSubject<userInterface[]>([]);

  constructor(private http: HttpClient) {
    this.loadData();
  }

  RegisteredData(user: userInterface): Observable<userInterface> {
    return this.http.post<userInterface>(this.registerUrl, user);
  }

  getuserData(): Observable<userInterface[]> {
    return this.userDataSubject.asObservable();
  }

  private loadData(): void {
    this.http.get<userInterface[]>(this.registerUrl).subscribe(
      (data) => {
        this.userDataSubject.next(data);
      },
      (error) => {
        console.error('Error loading user data:', error);
      }
    );
  }
  /*===================*/
  /*====CAR COMPONENTS FILTER====*/
  /*===================*/
  private carComponentsUrl = 'http://localhost:3000/cars';

  getCarComponentsData(): Observable<carInterface[]> {
    return this.http.get<carInterface[]>(this.carComponentsUrl);
  }

  /*===================*/
  /*====CARS CARDS====*/
  /*===================*/
  private carCardsUrl = 'http://localhost:3000/carCards';

  getCarCardsData(): Observable<carCardInterface[]> {
    return this.http.get<carCardInterface[]>(this.carCardsUrl);
  }

  searchData(filters: any): Observable<carCardInterface[]> {
    let params = new HttpParams();

    for (const key in filters) {
      if (
        filters[key] !== null &&
        filters[key] !== undefined &&
        filters[key] !== ''
      ) {
        params = params.set(key, filters[key]);
      }
    }

    console.log(
      'Request URL with params:',
      this.carCardsUrl,
      params.toString()
    );

    return this.http.get<carCardInterface[]>(this.carCardsUrl, { params });
  }
}
