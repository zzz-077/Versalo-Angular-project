import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { LocalStorageService } from './shared/services/local-storage-service/local-storage.service';
import { userInterface } from './shared/services/data-service/registerInterface';
import { UserService } from './shared/services/user-service/user.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './shared/services/auth-service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLogged: boolean = false;
  isLoading: boolean = false;
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

    this.isLoading = true;
    this.authService.getCurrentUser().subscribe(
      (currentUser: any) => {
        if (currentUser && currentUser.emailVerified) {
          this.authService.getCurrentUserFull(currentUser.email).subscribe(
            (activeUser) => {
              this.user = activeUser;
              this.isLogged = true;
              this.isLoading = false;
            },
            (error) => {
              this.isLogged = false;
              this.isLoading = false;
              localStorage.setItem('jwt', 'false');
            }
          );
        }
      },
      (error) => {
        this.isLogged = false;
        this.isLoading = false;
        localStorage.setItem('jwt', 'false');
      }
    );
  }
  navbarBtnClick() {
    this.isNavBarDroped = !this.isNavBarDroped;
  }
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    public translate: TranslateService,
    private authService: AuthService
  ) {
    translate.addLangs(['en', 'ge']);
    translate.setDefaultLang('en');

    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? (this.activeRoute = event.url) : null;
    });
    this.isLogged = JSON.parse(localStorage.getItem('jwt') as string) || false;
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
