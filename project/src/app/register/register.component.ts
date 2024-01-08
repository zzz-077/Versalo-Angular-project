import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private router: Router) {}
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
        Validators.pattern(/^(?=.*\d).{8,}$/),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*\d).{8,}$/),
      ]),
    },
    { validators: this.Mustmatch('password', 'confirmPassword') }
  );
  /*==============================*/
  /*====GIVING FORM TO INPUTS ====*/
  /*==============================*/
  get Name() {
    return this.RegisterForm.get('name');
  }
  get LastName() {
    return this.RegisterForm.get('lastname');
  }
  get Email() {
    return this.RegisterForm.get('email');
  }
  get Password() {
    return this.RegisterForm.get('password');
  }
  get ConfirmPassword() {
    return this.RegisterForm.get('confirmPassword');
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

  onSignup() {
    if (this.RegisterForm.valid) {
      localStorage.setItem('isLogged', JSON.stringify(true));
      this.router.navigate(['/']);
    }
  }
}
