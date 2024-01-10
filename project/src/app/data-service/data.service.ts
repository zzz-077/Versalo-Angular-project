import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { userInterface } from './registerInterface';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  registerUrl = 'http://localhost:3000/users';

  RegisteredData(user: userInterface) {
    return this.http.post<userInterface>(this.registerUrl, user);
  }
  getuserData(): Observable<userInterface[]> {
    return this.http.get<userInterface[]>(this.registerUrl);
  }
}
