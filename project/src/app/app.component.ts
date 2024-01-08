import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Versalo';
  activeRoute: string = '';
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? (this.activeRoute = event.url) : null;
    });
  }

  logOut() {
    localStorage.removeItem('isLogged');
    this.router.navigate(['/signin']);
  }
}
