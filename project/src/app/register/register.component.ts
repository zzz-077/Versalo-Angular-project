import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor() {}
  /*==============================*/
  /*====CREATING REGISTER FORM====*/
  /*==============================*/
  RegisterForm = new FormGroup(
    {
      Name: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]+$'),
      ]),
      LastName: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z]+$'),
      ]),
      Email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ]),
      Password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      ConfirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    },
    { validators: this.Mustmatch('Password', 'ConfirmPassword') }
  );
  /*==============================*/
  /*====GIVING FORM TO INPUTS ====*/
  /*==============================*/
  get Name() {
    return this.RegisterForm.get('Name');
  }
  get LastName() {
    return this.RegisterForm.get('LastName');
  }
  get Email() {
    return this.RegisterForm.get('Email');
  }
  get Password() {
    return this.RegisterForm.get('Password');
  }
  get ConfirmPassword() {
    return this.RegisterForm.get('ConfirmPassword');
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
        !ConfirmPasswordControl.errors['Mustmatch']
      ) {
        return null;
      }

      if (ConfirmPasswordControl.value !== PasswordControl.value) {
        ConfirmPasswordControl.setErrors({ Mustmatch: true });
      } else {
        ConfirmPasswordControl.setErrors(null);
      }

      return null;
    };
  }
}
