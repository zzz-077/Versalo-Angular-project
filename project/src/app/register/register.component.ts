import { Component } from '@angular/core';
import { userInterface } from '../data-service/registerInterface';
import { DataService } from '../data-service/data.service';

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
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  RegUser: userInterface[] = [];
  emailCheck = false;
  constructor(private router: Router, private services: DataService) {
    this.RegisterForm.get('email')?.valueChanges.subscribe((emailvalue) => {
      return this.emailExists(emailvalue as string);
    });
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
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^.{8,}$/),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^.{8,}$/),
      ]),
    },
    { validators: this.Mustmatch('password', 'confirmPassword') }
  );
  /*==================================*/
  /*====IF EMAIL EXISTS LOGIC ====*/
  /*====================================*/
  emailExists(email: string) {
    let emailC = false;
    this.services.getuserData().subscribe((item) => {
      if (Array.isArray(item)) {
        for (let i = 0; i < item.length; i++) {
          if (item[i].userEmail == email) {
            emailC = true;
            break;
          }
        }
      }
      this.emailCheck = emailC;
    });
  }
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
    this.services
      .RegisteredData({
        id: '',
        userName: this.RegisterForm.value.name as string,
        userLastName: this.RegisterForm.value.lastname as string,
        userEmail: this.RegisterForm.value.email as string,
        userPassword: this.RegisterForm.value.password as string,
      })
      .subscribe((item) => {});
    if (this.RegisterForm.valid) {
      localStorage.setItem('isLogged', JSON.stringify(true));
      this.router.navigate(['/signin']);
    }
  }
}
