import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth-service/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent {
  currentUser: any = null;
  isLoading: boolean = false;
  constructor(private router: Router, private authService: AuthService) {
    let isSignedIn = JSON.parse(localStorage.getItem('jwt') as any);
    if (isSignedIn) {
      this.isLoading = true;
      this.authService.getCurrentUser().subscribe((user) => {
        this.currentUser = { email: user?.email };
        this.isLoading = false;
        if (user?.emailVerified) {
          this.router.navigate(['/']);
        }
      });
    } else {
      this.router.navigate(['/signin']);
    }
  }

  reloadPage() {
    window.location.reload();
  }
  signout() {
    this.authService.signOut();
  }
}
