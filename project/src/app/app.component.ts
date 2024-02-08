import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { LocalStorageService } from './shared/services/local-storage-service/local-storage.service';
import { userInterface } from './shared/interfaces/registerInterface';
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
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    public translate: TranslateService,
    private authService: AuthService
  ) {
    translate.addLangs(['en', 'ge']);
    translate.setDefaultLang('en');
    this.isLogged = JSON.parse(localStorage.getItem('jwt') as string) || false;

    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? (this.activeRoute = event.url) : null;
    });
    this.isLogged = JSON.parse(localStorage.getItem('jwt') as string) || false;
  }
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
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe({
      next: (currentUser: any) => {
        if (currentUser && currentUser.emailVerified) {
          this.authService
            .getCurrentUserFull(currentUser.email)
            .subscribe((activeUser) => {
              if (activeUser) {
                this.user = activeUser;
                this.isLogged = true;
                this.isLoading = false;
                this.localStorageService.setIsLogged(true);
              } else {
                this.isLogged = false;
                this.isLoading = false;
                localStorage.removeItem('jwt');
              }
            });
        } else {
          this.isLogged = false;
          this.isLoading = false;
          localStorage.removeItem('jwt');
        }
      },
      error: (error) => {
        this.isLogged = false;
        localStorage.removeItem('jwt');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  goToHome() {
    if (this.isNavBarDroped) {
      this.navbarBtnClick();
    }
    this.router.navigate(['/']);
  }

  navbarBtnClick() {
    this.isNavBarDroped = !this.isNavBarDroped;
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
    if (this.isNavBarDroped) {
      this.navbarBtnClick();
    }
    this.router.navigate(['/signin']);
  }
  signUp() {
    if (this.isNavBarDroped) {
      this.navbarBtnClick();
    }
    this.router.navigate(['/signup']);
  }
  logOut() {
    // this.localStorageService.setIsLogged(false);
    if (this.isNavBarDroped) {
      this.navbarBtnClick();
    }
    this.authService
      .signOut()
      .then(() => {
        this.isLogged = false;
        this.localStorageService.setIsLogged(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
