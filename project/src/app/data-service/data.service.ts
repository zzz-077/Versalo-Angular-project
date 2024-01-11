import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userInterface } from './registerInterface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
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
}

// constructor(private http: HttpClient) {}

// registerUrl = 'http://localhost:3000/users';

// RegisteredData(user: userInterface) {
//   return this.http.post<userInterface>(this.registerUrl, user);
// }
// getuserData(): Observable<userInterface[]> {
//   return this.http.get<userInterface[]>(this.registerUrl);
// }
