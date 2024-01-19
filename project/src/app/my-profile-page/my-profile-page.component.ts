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
import { NgxImageCompressService } from 'ngx-image-compress';
@Component({
  selector: 'app-my-profile-page',
  templateUrl: './my-profile-page.component.html',
  styleUrls: ['./my-profile-page.component.css'],
})
export class MyProfilePageComponent {
  fireStorage: any;
  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private data: DataService,
    private imageCompress: NgxImageCompressService
  ) {}
  /*=================*/
  /*====VARIABLES====*/
  /*=================*/
  passwordCheck = false;
  infoEdit_btnCheck = false;
  isLogged: boolean = false;
  user: userInterface | null = null;
  CardsAdd_btnCheck = false;
  CardsEdit_btnCheck = false;
  id: any = '';
  activeRoute: string = '';
  usersCardsList: carCardInterface[] = [];
  CardClickCheck = false;
  popUpCheck = false;
  CardSelectedArray: any[] = [];
  isLoading: boolean = false;
  skletonArray: number[] = new Array(10).fill(0);
  saveUserImageUrl: string = '';
  oldSaveduserImageName: string | null = null;
  isImageCompressing: boolean = false;
  imageUploadProgressBar: number = 0;
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
      Validators.pattern(/^\S{8,}$/),
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
    });

    this.loadInfo();
    this.UserCards();
    // this.isLoading = true;
    this.data.carCards$.subscribe((cards) => {
      this.usersCardsList = cards;
      // this.isLoading = cards && false;
    });
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
    console.log('Save button Worked!');
    if (this.infoEdit_btnCheck) {
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
    this.infoEdit_btnCheck = !this.infoEdit_btnCheck;
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

  /*
  async onFileChange(event: any) {
    const file = <File>event.target.files[0];
    if (file) {
      if (
        this.oldSaveduserImageName &&
        this.oldSaveduserImageName !== file.name
      ) {
        await this.fireStorage.storage
          .refFromURL(this.saveUserImageUrl)
          .delete();
      }
      if (this.oldSaveduserImageName !== file.name) {
        const width = await this.getImageWidth(file);
        if (width > 2000) {
          // Resize and Upload the image
          await this.compressAndUpload(file);
        } else {
          // Upload the original image
          await this.uploadImage(file, file.name);
        }
      }
    }
  }

  async getImageWidth(file: File): Promise<number> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width);
      img.src = URL.createObjectURL(file);
    });
  }

  async compressAndUpload(file: File) {
    const reader = new FileReader();

    reader.onload = async (event: any) => {
      this.isImageCompressing = true;
      const compressedImage = await this.imageCompress.compressFile(
        event.target.result,
        1, // Orientation
        50, // Ratio
        90, // Quality
        2000, //maxWidth
        2000 //maxHeight
      );

      // Convert base64 compressed image to Blob
      const blob = this.dataURItoBlob(compressedImage);
      this.isImageCompressing = false;
      // Uploading Compressed Image
      await this.uploadImage(blob, file.name);
    };

    reader.readAsDataURL(file);
  }

  dataURItoBlob(dataURI: string): Blob {
    // Convert base64 to Blob
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  async uploadImage(file: Blob, fileName: string) {
    // Upload the file to Firebase or perform other actions

    const path = `userImages/${fileName}`;
    const uploadTask = this.fireStorage.upload(path, file);
    uploadTask.then(async (res) => {
      const url = await res.ref.getDownloadURL();
      this.saveUserImageUrl = url;
      this.oldSaveduserImageName = fileName;
    });
    uploadTask.percentageChanges().subscribe((percentage) => {
      this.imageUploadProgressBar = percentage || 0;
      if (this.imageUploadProgressBar === 100) {
        setTimeout(() => {
          this.imageUploadProgressBar = 0;
        }, 1500);
      }
    });
  }
    async uploadImage(file: Blob, fileName: string) {
    // Upload the file to Firebase or perform other actions

    const path = `carImages/${fileName}`;
    const uploadTask = this.fireStorage.upload(path, file);
    uploadTask.then(async (res) => {
      const url = await res.ref.getDownloadURL();
      this.saveCarImageUrl = url;
      this.oldSavedCarImageName = fileName;
    });
    uploadTask.percentageChanges().subscribe((percentage) => {
      this.imageUploadProgressBar = percentage || 0;
      if (this.imageUploadProgressBar === 100) {
        setTimeout(() => {
          this.imageUploadProgressBar = 0;
        }, 1500);
      }
    });
  }
*/

  /*=======================*/
  /*====CARDS FUNCTIONS====*/
  /*=======================*/
  cardAddBtn() {
    this.CardsAdd_btnCheck = true;
  }
  closeAddCardOverlay() {
    this.CardsAdd_btnCheck = false;
    this.CardsEdit_btnCheck = false;
  }
  UserCards() {
    // this.isLoading = true;
    this.data.userCardsGet(this.id).subscribe((cards) => {
      this.usersCardsList = cards;
    });
  }
  deleteCard() {
    this.popUpCheck = true;
  }
  editCard() {
    this.CardsEdit_btnCheck = true;
  }
  popUpCancel() {
    this.popUpCheck = false;
  }
  popUpDelete() {
    // console.log('Card deleted!');
    this.popUpCheck = false;
    this.data.userCardDelete(this.CardSelectedArray, this.id).subscribe(
      () => {
        console.log('Succsfully Deleted');
      },
      (error) => {
        console.log(error);
      }
    );
    // Clear Selected Array after deleting
    this.CardSelectedArray = [];

    this.UserCards();
  }
  cardSelect(card: carCardInterface) {
    card.selected = !card.selected;
    this.CardClickCheck = true;
    if (card.selected) {
      this.CardSelectedArray.push(card.id);
    } else {
      this.CardSelectedArray = this.CardSelectedArray.filter(
        (item) => item !== card.id
      );
    }
    if (this.CardSelectedArray.length == 0) {
      this.CardClickCheck = false;
    }
  }
}
