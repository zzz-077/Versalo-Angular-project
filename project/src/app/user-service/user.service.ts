import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { userInterface } from '../data-service/registerInterface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private loggedInUserSubject: BehaviorSubject<userInterface | null> =
    new BehaviorSubject<userInterface | null>(null);
  loggedInUser$: Observable<userInterface | null> =
    this.loggedInUserSubject.asObservable();

  constructor() {
    // Initialize the user from Local Storage during service instantiation
    this.loadUserFromLocalStorage();
  }

  getUser(): userInterface | null {
    // Ensure the user is loaded before accessing
    this.loadUserFromLocalStorage();
    return this.loggedInUserSubject.getValue();
  }

  setLoggedInUser(user: userInterface): void {
    this.loggedInUserSubject.next(user);

    // Save user information to Local Storage
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  clearLoggedInUser(): void {
    this.loggedInUserSubject.next(null);

    // Clear user information from Local Storage
    localStorage.removeItem('loggedInUser');
  }

  private loadUserFromLocalStorage(): void {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      this.loggedInUserSubject.next(parsedUser);
    }
  }

  // Explicit method to load user from Local Storage
  loadUser(): void {
    this.loadUserFromLocalStorage();
  }
}
