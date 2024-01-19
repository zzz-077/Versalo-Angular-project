import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  carCardInterface,
  carInterface,
  userInterface,
} from './registerInterface';
import {
  BehaviorSubject,
  Observable,
  concatMap,
  delay,
  forkJoin,
  map,
  switchMap,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  port = 3000;

  /*=================*/
  /*====USER DATA====*/
  /*=================*/
  private registerUrl = `http://localhost:${this.port}/users`;
  private userDataSubject: BehaviorSubject<userInterface[]> =
    new BehaviorSubject<userInterface[]>([]);

  constructor(private http: HttpClient) {
    this.loadData();
  }

  RegisteredData(user: userInterface): Observable<userInterface> {
    return this.http.post<userInterface>(this.registerUrl, user);
  }

  getUserById(userId?: number) {
    return this.http.get<userInterface>(`${this.registerUrl}/${userId}`);
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
  private carComponentsUrl = `http://localhost:${this.port}/cars`;

  getCarComponentsData(): Observable<carInterface[]> {
    return this.http.get<carInterface[]>(this.carComponentsUrl);
  }
  /*===================*/
  /*====CARS CARDS====*/
  /*===================*/
  private carCardsUrl = `http://localhost:${this.port}/carCards`;

  getCarDetailsById(id: number | null) {
    return this.http.get<carCardInterface>(`${this.carCardsUrl}/${id}`);
  }

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
    return this.http.put<userInterface>(`${this.registerUrl}/${user.id}`, user);
  }

  userGet(id: string): Observable<userInterface> {
    return this.http.get<userInterface>(`${this.registerUrl}/${id}`);
  }
  userImageEdit(img: string, id: string) {
    return this.http.put<userInterface>(
      `${this.registerUrl}/${id}?userImageUrl`,
      img
    );
  }

  /*======================*/
  /*====USER CARS CRUD====*/
  /*======================*/

  // private carCardsSubject = new BehaviorSubject<carCardInterface[]>([]);
  // carCards$ = this.carCardsSubject.asObservable();

  private carCardsSubject: BehaviorSubject<carCardInterface[]> =
    new BehaviorSubject<carCardInterface[]>([]);
  carCards$: Observable<carCardInterface[]> =
    this.carCardsSubject.asObservable();

  userCardsGet(userId: number): Observable<carCardInterface[]> {
    return this.http.get<carCardInterface[]>(
      `${this.carCardsUrl}?userId=${userId}`
    );
  }

  // userCardCreate(card: carCardInterface): Observable<carCardInterface> {
  //   return this.http.post<carCardInterface>(this.carCardsUrl, card);
  // }

  // Create a new card and notify subscribers about the change
  userCardCreate(card: carCardInterface): Observable<carCardInterface> {
    return this.http.post<carCardInterface>(this.carCardsUrl, card).pipe(
      // After successfully creating a card, update the BehaviorSubject
      tap(() => {
        this.http
          .get<carCardInterface[]>(`${this.carCardsUrl}?userId=${card.userId}`)
          .subscribe((cards) => {
            this.updateCarCards(cards);
          });
      })
    );
  }

  userCardDelete(
    cardIds: number[],
    userId: string
  ): Observable<carCardInterface[]> {
    // Create an array of observables for each delete request
    const deleteRequests = cardIds.map((cardId) =>
      this.http.delete<void>(`${this.carCardsUrl}/${cardId}`).pipe(
        delay(1000) // Add a delay of 100 milliseconds between requests
      )
    );

    // Use forkJoin to wait for all delete requests to complete
    return forkJoin(deleteRequests).pipe(
      // Map to void[] since forkJoin returns an array of results
      concatMap(() => {
        // Fetch the updated cards after all delete requests are successful
        return this.http.get<carCardInterface[]>(
          `${this.carCardsUrl}?userId=${userId}`
        );
      }),
      tap((cards) => {
        // Update the BehaviorSubject with the updated cards
        this.updateCarCards(cards);
      })
    );
  }
  userCardUpdate(form: carCardInterface) {
    return this.http.put<carCardInterface>(
      `${this.carCardsUrl}/${form?.id}`,
      form
    );
  }

  private updateCarCards(updatedCards: carCardInterface[]) {
    // Update the BehaviorSubject with the new list of cards
    this.carCardsSubject.next(updatedCards);
  }
}
