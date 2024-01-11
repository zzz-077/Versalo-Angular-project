import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { LocalStorageService } from './local-storage-service/local-storage.service';
import { userInterface } from './data-service/registerInterface';
import { UserService } from './user-service/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLogged: boolean = false;
  user: userInterface | null = null;
  activeRoute: string = '';

  ngOnInit(): void {
    this.localStorageService.isLogged$.subscribe((value) => {
      this.isLogged = value;
    });
    this.userService.loadUser();
    this.userService.loggedInUser$.subscribe((user) => {
      this.user = user;
    });
  }

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? (this.activeRoute = event.url) : null;
    });
    this.isLogged =
      JSON.parse(localStorage.getItem('isLogged') as string) || false;
  }

  uploadLink() {
    if (!this.isLogged) {
      // Set the intended route before navigating to sign-in
      this.localStorageService.setIntendedRoute('/profile');
      this.router.navigate(['/signin']);
    } else {
      this.router.navigate(['/profile']);
    }
  }

  signIn() {
    this.router.navigate(['/signin']);
  }
  signUp() {
    this.router.navigate(['/signup']);
  }
  logOut() {
    this.localStorageService.setIsLogged(false);
    this.userService.clearLoggedInUser();
    this.isLogged = false;
    this.router.navigate(['/signin']);
  }
}
