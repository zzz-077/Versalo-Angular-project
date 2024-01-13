import { Component } from '@angular/core';
import { userInterface } from '../data-service/registerInterface';
import { UserService } from '../user-service/user.service';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
@Component({
  selector: 'app-my-profile-page',
  templateUrl: './my-profile-page.component.html',
  styleUrls: ['./my-profile-page.component.css'],
})
export class MyProfilePageComponent {
  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {}
  passwordCheck = false;
  infoEdit_btnCheck = false;
  CardsAdd_btnCheck = false;
  isLogged: boolean = false;
  user: userInterface | null = null;
  activeRoute: string = '';
  /*===============================*/
  /*====PROFILE CLICK FUNCTIONS====*/
  /*===============================*/
  ngOnInit(): void {
    this.localStorageService.isLogged$.subscribe((value) => {
      this.isLogged = value;
    });
    this.userService.loadUser();
    this.userService.loggedInUser$.subscribe((user) => {
      this.user = user;
    });
    console.log(this.user);
  }

  passwordShow() {
    this.passwordCheck = !this.passwordCheck;
  }
  infoEditBtn() {
    this.infoEdit_btnCheck = !this.infoEdit_btnCheck;
  }
  infoSaveBtn() {
    this.infoEdit_btnCheck = !this.infoEdit_btnCheck;
  }
  infoCancelBtn() {
    this.infoEdit_btnCheck = !this.infoEdit_btnCheck;
  }
  onFormSubmit(event: Event) {
    event.preventDefault();
  }

  /*===============================*/
  /*====CARDS CLICK FUNCTIONS====*/
  /*===============================*/
  cardAddBtn() {
    this.CardsAdd_btnCheck = true;
  }
  cardCancelBtn() {
    this.CardsAdd_btnCheck = false;
  }
  cardSaveBtn() {
    this.CardsAdd_btnCheck = false;
  }
}
