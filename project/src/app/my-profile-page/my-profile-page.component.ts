import { Component } from '@angular/core';
import { userInterface } from '../data-service/registerInterface';
import { UserService } from '../user-service/user.service';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data-service/data.service';
import { __values } from 'tslib';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
  selector: 'app-my-profile-page',
  templateUrl: './my-profile-page.component.html',
  styleUrls: ['./my-profile-page.component.css'],
})
export class MyProfilePageComponent {
  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private data: DataService,
    private fireStorage: AngularFireStorage
  ) {}
  passwordCheck = false;
  infoEdit_btnCheck = false;
  CardsAdd_btnCheck = false;
  isLogged: boolean = false;
  user: userInterface | null = null;
  id: any = '';
  activeRoute: string = '';
  saveCarImageUrl: string = '';
  oldSavedCarImageName: string | null = null;

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
      console.log(this.id);
    });
    this.loadInfo();
  }
  getStarsArray(length: number): number[] {
    return Array.from({ length }, (_, index) => index);
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
  onFormSubmit(event: Event) {
    event.preventDefault();
  }
  loadInfo() {
    this.data.userGet(this.id).subscribe((user) => {
      if (user) {
        this.user = user;
        this.userService.setLoggedInUser(this.user);
      }
      console.log(this.user);
    });
  }

  /*===============================*/
  /*====CARDS  FUNCTIONS====*/
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

  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (
        this.oldSavedCarImageName &&
        this.oldSavedCarImageName !== file.name
      ) {
        await this.fireStorage.storage
          .refFromURL(this.saveCarImageUrl)
          .delete();
      }
      if (this.oldSavedCarImageName !== file.name) {
        const path = `carImages/${file.name}`;
        const uploadTask = await this.fireStorage.upload(path, file);
        const url = await uploadTask.ref.getDownloadURL();
        this.saveCarImageUrl = url;
        this.oldSavedCarImageName = file.name;
        console.log(this.saveCarImageUrl);
      }
    }
  }
}
