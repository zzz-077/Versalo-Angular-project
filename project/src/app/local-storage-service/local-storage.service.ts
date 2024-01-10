// local-storage.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private isLoggedSubject = new BehaviorSubject<boolean>(this.getIsLogged());
  isLogged$: Observable<boolean> = this.isLoggedSubject.asObservable();

  getIsLogged(): boolean {
    return JSON.parse(localStorage.getItem('isLogged') || 'false');
  }

  setIsLogged(value: boolean): void {
    localStorage.setItem('isLogged', JSON.stringify(value));
    this.isLoggedSubject.next(value);
  }
}
