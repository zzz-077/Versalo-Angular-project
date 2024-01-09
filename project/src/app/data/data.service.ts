import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { regInterface } from '../data/registerInterface';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  registerUrl = 'http://localhost:3000/register';

  RegisteredData(user: regInterface) {
    return this.http.post<regInterface>(this.registerUrl, user);
  }
  getuserData(): Observable<regInterface[]> {
    return this.http.get<regInterface[]>(this.registerUrl);
  }
}
