import { Component, Injectable, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { LocalStorageService } from './local-storage-service/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isLogged: boolean = false;

  activeRoute: string = '';

  ngOnInit(): void {
    this.localStorageService.isLogged$.subscribe((value) => {
      this.isLogged = value;
    });
  }

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? (this.activeRoute = event.url) : null;
    });
    this.isLogged =
      JSON.parse(localStorage.getItem('isLogged') as string) || false;
  }

  signIn() {
    this.router.navigate(['/signin']);
  }
  signUp() {
    this.router.navigate(['/signup']);
  }
  logOut() {
    this.localStorageService.setIsLogged(false);
    this.isLogged = false;
    this.router.navigate(['/signin']);
  }
}
