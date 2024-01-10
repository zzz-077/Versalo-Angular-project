import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { userInterface } from '../data-service/registerInterface';
import { DataService } from '../data-service/data.service';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { LocalStorageService } from '../local-storage-service/local-storage.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  constructor(
    private router: Router,
    private services: DataService,
    private localStorageService: LocalStorageService
  ) {}
  user: userInterface[] = [];
  checkIfExists = true;
  /*==============================*/
  /*====SIGNIN FORM====*/
  /*==============================*/
  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
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
      setTimeout(() => {
        this.checkIfExists = true;
      }, 3000);
      if (this.checkIfExists == true) {
        this.localStorageService.setIsLogged(true);
        this.router.navigate(['/']);
      }
    }
  }
}
