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
    const modifyFilters: any = {
      carModel: filters.Model?.toLowerCase() || null,
      carCategory: filters.category?.toLowerCase() || null,
      gearBox: filters.gearBox?.toLowerCase() || null,
    };
    let params = new HttpParams();
    for (const key in modifyFilters) {
      if (modifyFilters[key]) {
        params = params.set(key, modifyFilters[key]);
      }
    }
    return this.http.get<carCardInterface[]>(this.carCardsUrl, { params });
  }

  /*======================*/
  /*====USER DATA CRUD====*/
  /*======================*/

  userUpdate(user: userInterface) {
    console.log('Update in service:' + user);
    return this.http.put<userInterface>(`${this.registerUrl}/${user.id}`, user);
  }

  userGet(id: string): Observable<userInterface> {
    console.log('Returning from service:');
    return this.http.get<userInterface>(`${this.registerUrl}/${id}`);
  }
}
