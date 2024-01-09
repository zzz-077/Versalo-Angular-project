import { Component, OnInit } from '@angular/core';
import { regInterface } from '../data/registerInterface';
import { DataService } from '../data/data.service';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  constructor(private router: Router, private services: DataService) {}
  user: regInterface[] = [];
  checkIfExists = true;
  /*==============================*/
  /*====SIGNIN FORM====*/
  /*==============================*/
  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this.services.getuserData().subscribe((userList) => {
      if (Array.isArray(userList)) {
        this.user = userList;
        console.log(this.user);
      }
    });
  }
  onSignin() {
    let foundError = false;
    if (Array.isArray(this.user)) {
      for (let i = 0; i < this.user.length; i++) {
        if (
          this.user[i].userEmail == this.signinForm.value.email &&
          this.user[i].userPassword == this.signinForm.value.password
        ) {
          foundError = true;
          break;
        } else {
          foundError = false;
        }
      }
      this.checkIfExists = foundError;
      console.log('yourSignInAnswerIs: ' + this.checkIfExists);
      if (this.checkIfExists == true) {
        localStorage.setItem('isLogged', JSON.stringify(true));
        this.router.navigate(['']);
      }
    }
  }
}
