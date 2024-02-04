import { Component } from '@angular/core';
import {
  carCardInterface,
  userInterface,
} from '../../shared/services/data-service/registerInterface';
import { UserService } from '../../shared/services/user-service/user.service';
import { LocalStorageService } from '../../shared/services/local-storage-service/local-storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../shared/services/data-service/data.service';
import { __values } from 'tslib';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-my-profile-page',
  templateUrl: './my-profile-page.component.html',
  styleUrls: ['./my-profile-page.component.css'],
})
export class MyProfilePageComponent {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private data: DataService,
    private imageCompress: NgxImageCompressService,
    private fireStorage: AngularFireStorage,
    private translate: TranslateService
  ) {
    if (!JSON.parse(localStorage.getItem('jwt') as string)) {
      this.router.navigate(['/']);
    }
  }

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
  isLoadingCars: boolean = false;
  skletonArray: number[] = new Array(2).fill(0);
  isDeleteOpen: boolean = false;
  /*==================================== */
  /*======FOR USER IMAGE UPLOADING====== */
  /*==================================== */
  saveUserImageUrl: string = '';
  oldSaveduserImageName: string | null = null;
  isImageCompressing: boolean = false;
  isImageUploading: boolean = false;
  imageUploadProgressBar: number = 0;
  /*----------------------------------*/

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
    const currentLang = this.translate.currentLang;

    this.localStorageService.isLogged$.subscribe((value) => {
      this.isLogged = value;
    });
    this.userService.loadUser();
    this.userService.loggedInUser$.subscribe((user) => {
      this.id = user?.id;
    });

    this.loadInfo();

    this.isLoadingCars = true;
    this.data.userCardsGet(this.id).subscribe((cards) => {
      this.usersCardsList = cards;
      this.isLoadingCars = false;
    });

    // To Update userCarsData immediately after editi db.
    this.data.carCards$.subscribe((cards) => {
      this.usersCardsList = cards;
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
    this.data.userGet(this.id || '1').subscribe((user) => {
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
    this.CardsEdit_btnCheck = false;
  }
  UserCards() {
    this.data.userCardsGet(this.id).subscribe((cards) => {
      this.usersCardsList = cards;
      this.isLoadingCars = false;
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
    this.isLoadingCars = true;
    this.popUpCheck = false;
    this.data.userCardDelete(this.CardSelectedArray, this.id).subscribe(
      () => {
        console.log('Succsfully Deleted');
        this.data.userCardsGet(this.id).subscribe((cards) => {
          console.log({ cards });

          this.usersCardsList = cards;
          this.isLoadingCars = false;
        });
      },
      (error) => {
        console.log(error);
      }
    );
    // Clear Selected Array after deleting
    this.CardSelectedArray = [];
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

  /*=========================*/
  /*====IMAGE TO FIREBASE====*/
  /*========AND TO DB========*/
  /*=========================*/

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
        if (width > 1500) {
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
    this.isImageCompressing = true;

    const reader = new FileReader();
    reader.onload = async (event: any) => {
      const compressedImage = await this.imageCompress.compressFile(
        event.target.result,
        1, // Orientation
        50, // Ratio
        90, // Quality
        1500, //maxWidth
        1500 //maxHeight
      );

      // Convert base64 compressed image to Blob
      const blob = this.dataURItoBlob(compressedImage);

      // Uploading Compressed Image
      await this.uploadImage(blob, file.name);

      this.isImageCompressing = false;
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

    this.isImageUploading = true;
    const path = `userProfileImages/${fileName}`;
    const uploadTask = this.fireStorage.upload(path, file);
    uploadTask.then(async (res) => {
      const url = await res.ref.getDownloadURL();
      this.saveUserImageUrl = url;
      this.oldSaveduserImageName = fileName;
      if (this.saveUserImageUrl) {
        this.submitNewUserImageInDB(this.saveUserImageUrl);
      }
    });
    uploadTask.percentageChanges().subscribe((percentage) => {
      this.imageUploadProgressBar = percentage ? Math.round(percentage) : 0;
      if (this.imageUploadProgressBar === 100) {
        setTimeout(() => {
          this.imageUploadProgressBar = 0;
        }, 3000);
      }
    });
  }

  openDeleting() {
    this.isDeleteOpen = true;
  }
  cancelDeleting() {
    this.isDeleteOpen = false;
  }

  submitNewUserImageInDB(newImageUrl: string) {
    if (newImageUrl && this.user) {
      this.data
        .userUpdate({
          ...this.user,
          userImageUrl: newImageUrl as string,
        })
        .subscribe(() => {
          this.loadInfo();
          this.isImageUploading = false;
        });
    }
  }

  deleteProfileImage() {
    if (this.user) {
      this.data
        .userUpdate({
          ...this.user,
          userImageUrl: '',
        })
        .subscribe(async () => {
          await this.fireStorage.storage
            .refFromURL(this.saveUserImageUrl)
            .delete();
          this.saveUserImageUrl = '';
          this.cancelDeleting();
          this.loadInfo();
        });
    }
  }
}
