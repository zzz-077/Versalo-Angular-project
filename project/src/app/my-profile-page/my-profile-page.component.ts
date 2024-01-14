import { Component } from '@angular/core';
import {
  carCardInterface,
  userInterface,
} from '../data-service/registerInterface';
import { UserService } from '../user-service/user.service';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data-service/data.service';
import { __values } from 'tslib';
@Component({
  selector: 'app-my-profile-page',
  templateUrl: './my-profile-page.component.html',
  styleUrls: ['./my-profile-page.component.css'],
})
export class MyProfilePageComponent {
  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private data: DataService
  ) {}
  /*=================*/
  /*====VARIABLES====*/
  /*=================*/
  passwordCheck = false;
  infoEdit_btnCheck = false;
  isLogged: boolean = false;
  user: userInterface | null = null;
  CardsAdd_btnCheck = false;
  id: any = '';
  activeRoute: string = '';
  usersCardsList: carCardInterface[] = [];
  /*======================*/
  /*====USER EDIT FORM====*/
  /*======================*/
  profileEditForm = new FormGroup({
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
    userImageUrl: new FormControl(''),
  });
  /*======================*/
  /*====INFO FUNCTIONS====*/
  /*======================*/
  ngOnInit(): void {
    this.localStorageService.isLogged$.subscribe((value) => {
      this.isLogged = value;
    });
    this.userService.loadUser();
    this.userService.loggedInUser$.subscribe((user) => {
      this.id = user?.id;
      // console.log(this.id);
    });
    this.loadInfo();
    this.UsesCards();
  }
  passwordShow() {
    this.passwordCheck = !this.passwordCheck;
  }
  infoEditBtn() {
    this.profileEditForm.setValue({
      name: this.user?.userName || '',
      lastname: this.user?.userLastName || '',
      email: this.user?.userEmail || '',
      password: this.user?.userPassword || '',
      userImageUrl: this.user?.userImageUrl || '',
    });
    this.infoEdit_btnCheck = !this.infoEdit_btnCheck;
  }
  infoSaveBtn() {
    this.infoEdit_btnCheck = !this.infoEdit_btnCheck;
    this.data
      .userUpdate({
        id: this.id,
        userName: this.profileEditForm.value.name as string,
        userLastName: this.profileEditForm.value.lastname as string,
        userEmail: this.profileEditForm.value.email as string,
        userPassword: this.profileEditForm.value.password as string,
        userImageUrl: this.profileEditForm.value.userImageUrl as string,
      })
      .subscribe(() => {
        this.loadInfo();
      });
  }
  infoCancelBtn() {
    this.infoEdit_btnCheck = !this.infoEdit_btnCheck;
  }
  loadInfo() {
    this.data.userGet(this.id).subscribe((user) => {
      if (user) {
        this.user = user;
        this.userService.setLoggedInUser(this.user);
      }
      // console.log(this.user);
    });
  }
  /*=======================*/
  /*====CARDS FUNCTIONS====*/
  /*=======================*/
  cardAddBtn() {
    this.CardsAdd_btnCheck = true;
  }
  closeAddCardOverlay() {
    this.CardsAdd_btnCheck = false;
  }
  UsesCards() {
    this.data.userCardsGet(this.id).subscribe((cards) => {
      this.usersCardsList = cards;
      console.log(this.usersCardsList);
    });
  }
}
