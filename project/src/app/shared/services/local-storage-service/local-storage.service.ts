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
    return JSON.parse(localStorage.getItem('jwt') || 'false');
  }

  setIsLogged(value: boolean): void {
    localStorage.setItem('jwt', JSON.stringify(value));
    this.isLoggedSubject.next(value);
  }

  setIntendedRoute(route: string): void {
    localStorage.setItem('intendedRoute', route);
  }

  getIntendedRoute(): string | null {
    return localStorage.getItem('intendedRoute');
  }

  clearIntendedRoute(): void {
    localStorage.removeItem('intendedRoute');
  }
}
