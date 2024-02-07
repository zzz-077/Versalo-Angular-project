import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth-service/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  hasErrors: boolean | string = false;
  isLogging: boolean = false;
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  constructor(private auth: AuthService) {}

  forgotPassword() {
    const email = this.form.get('email')?.value;
    if (email) {
      this.isLogging = true;
      this.auth
        .forgotPassword(email)
        .then(() => {
          this.hasErrors = false;
        })
        .catch((error) => {
          this.hasErrors = error.code.replace('auth/', '').replaceAll('-', ' ');
          if (this.hasErrors === 'invalid credential') {
            this.hasErrors = 'Email or password is incorrect';
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.hasErrors = false;
          });
          this.isLogging = false;
        });
    }
  }
}
