import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { LocalStorageService } from './local-storage-service/local-storage.service';
import { userInterface } from './data-service/registerInterface';
import { UserService } from './user-service/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLogged: boolean = false;
  isNavBarDroped: boolean = false;
  user: userInterface | null = null;
  activeRoute: string = '';
  lang: any;

  selectedLang(lang: any) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'en';
    this.translate.use(this.lang);

    this.localStorageService.isLogged$.subscribe((value) => {
      this.isLogged = value;
    });
    this.userService.loadUser();
    this.userService.loggedInUser$.subscribe((user) => {
      this.user = user;
    });
  }
  navbarBtnClick() {
    this.isNavBarDroped = !this.isNavBarDroped;
  }
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'ge']);
    translate.setDefaultLang('en');

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
