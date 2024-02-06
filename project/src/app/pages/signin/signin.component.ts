import { Component } from '@angular/core';
import { userInterface } from '../../shared/interfaces/registerInterface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth-service/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  isLogging: boolean = false;
  hasErrors: string | boolean = false;

  constructor(
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}
  user: userInterface[] = [];

  //
  /*===================*/
  /*====SIGNIN FORM====*/
  /*===================*/
  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    const isLogged = this.localStorageService.getIsLogged();
    if (isLogged) {
      this.router.navigate(['']);
    }
  }

  onSignIn() {
    const { email, password } = this.signinForm.value;
    if (this.signinForm.valid && email && password) {
      this.isLogging = true;
      this.authService
        .login(email, password)
        .then(() => {})
        .catch((error) => {
          localStorage.removeItem('jwt');
          console.log(error);
          this.hasErrors = error.message.replace('Firebase:', '').split('.')[0];
        })
        .finally(() => {
          this.isLogging = false;
          setTimeout(() => {
            this.hasErrors = false;
          }, 3000);
        });
    }
  }
}
