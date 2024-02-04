import { Component } from '@angular/core';
import { userInterface } from '../../shared/services/data-service/registerInterface';
import { DataService } from '../../shared/services/data-service/data.service';

import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
  AsyncValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth-service/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  RegUser: userInterface[] = [];
  emailCheck = false;
  hasErrors: string | boolean = false;
  isLogging: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private services: DataService
  ) {
    // this.RegisterForm.get('email')?.valueChanges.subscribe((emailvalue) => {
    //   return this.emailExists(emailvalue as string);
    // });
  }

  /*==============================*/
  /*====CREATING REGISTER FORM====*/
  /*==============================*/
  RegisterForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]+$'),
      ]),
      lastname: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]+$'),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\S{8,}$/),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\S{8,}$/),
      ]),
      userImageUrl: new FormControl(''),
    },
    { validators: this.Mustmatch('password', 'confirmPassword') }
  );

  /*==================================*/
  /*====PASSWORD CONFIRMATION LOGIC ====*/
  /*====================================*/
  Mustmatch(password: string, confpassword: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const PasswordControl = formGroup.get(password);
      const ConfirmPasswordControl = formGroup.get(confpassword);

      if (!PasswordControl || !ConfirmPasswordControl) {
        return null; // Return null if controls are not found
      }

      if (
        ConfirmPasswordControl.errors &&
        !ConfirmPasswordControl.errors['passwordMismatch']
      ) {
        return null;
      }

      if (ConfirmPasswordControl.value !== PasswordControl.value) {
        ConfirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        ConfirmPasswordControl.setErrors(null);
      }

      return null;
    };
  }
  /*==================================*/
  /*====SAVING USER DATA IN JSON====*/
  /*====================================*/
  onSignup() {
    if (this.RegisterForm.valid) {
      this.isLogging = true;
      const user = {
        id: '',
        userName: this.RegisterForm.value.name as string,
        userLastName: this.RegisterForm.value.lastname as string,
        userEmail: this.RegisterForm.value.email as string,
        userPassword: this.RegisterForm.value.password as string,
        userImageUrl: this.RegisterForm.value.userImageUrl as string,
      };

      this.authService
        .signUp(user)
        .then((res) => {})
        .catch((error) => {
          this.hasErrors = error.message.replace('Firebase:', '').split('.')[0];

          if (this.hasErrors === 'invalid credential') {
            this.hasErrors = 'This email is alraedy used!';
          }
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
