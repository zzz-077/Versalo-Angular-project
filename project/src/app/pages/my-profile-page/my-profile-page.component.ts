import { Component } from '@angular/core';
import {
  carCardInterface,
  userInterface,
} from '../../shared/interfaces/registerInterface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth-service/auth.service';
import { CarsService } from 'src/app/shared/services/cars-service/cars.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage-service/local-storage.service';
@Component({
  selector: 'app-my-profile-page',
  templateUrl: './my-profile-page.component.html',
  styleUrls: ['./my-profile-page.component.css'],
})
export class MyProfilePageComponent {
  constructor(
    private router: Router,
    private imageCompress: NgxImageCompressService,
    private fireStorage: AngularFireStorage,
    private translate: TranslateService,
    private authService: AuthService,
    private carsService: CarsService,
    private localStorageService: LocalStorageService
  ) {
    const isLogged = this.localStorageService.getIsLogged();
    if (!isLogged) {
      this.router.navigate(['']);
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
  isLoadingUser: boolean = false;
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
    email: new FormControl('', [Validators.required, Validators.email]),
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
    // this.localStorageService.isLogged$.subscribe((value) => {
    //   this.isLogged = value;
    // });
    this.loadInfo();
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
    if (this.infoEdit_btnCheck && this.user && this.user.id) {
      this.authService
        .updateUser(this.user.id, {
          userName: this.profileEditForm.value.name as string,
          userLastName: this.profileEditForm.value.lastname as string,
          userEmail: this.profileEditForm.value.email as string,
          userPassword: this.profileEditForm.value.password as string,
          userImageUrl: this.profileEditForm.value.userImageUrl as string,
        })
        .finally(() => {
          this.loadInfo();
        });
    }
    this.infoEdit_btnCheck = !this.infoEdit_btnCheck;
  }
  infoCancelBtn() {
    this.infoEdit_btnCheck = !this.infoEdit_btnCheck;
  }
  loadInfo() {
    this.isLoadingUser = true;
    this.isLoadingCars = true;
    this.authService.getCurrentUser().subscribe({
      next: (currentUser: any) => {
        if (currentUser && currentUser.emailVerified) {
          this.authService
            .getCurrentUserFull(currentUser.email)
            .subscribe((activeUser) => {
              this.user = activeUser;
              this.isLogged = true;
              localStorage.setItem('jwt', 'true');
              if (this.user && this.user.id) {
                this.carsService
                  .getCarCollectionByUserId(this.user.id as string)
                  .subscribe((cars) => {
                    this.usersCardsList = cars;
                    this.isLoadingCars = false;
                  });
              }
            });
        }
      },
      error: (error) => {
        this.isLogged = false;
        localStorage.setItem('jwt', 'false');
      },
      complete: () => {
        this.isLoadingUser = false;
        this.isLoadingCars = false;
      },
    });
  }

  /*=======================*/
  /*====CARDS FUNCTIONS====*/
  /*=======================*/
  cardAddBtn() {
    this.CardsAdd_btnCheck = true;
  }
  closeAddCardOverlay() {
    this.CardSelectedArray = [];
    this.usersCardsList = this.usersCardsList.map((car: carCardInterface) => {
      return { ...car, selected: false };
    });
    this.CardsAdd_btnCheck = false;
    this.CardsEdit_btnCheck = false;
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
    this.isLoadingCars = true;
    this.popUpCheck = false;
    this.carsService
      .deleteCarsById(this.CardSelectedArray)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.CardClickCheck = false;
        this.isLoadingCars = false;
        this.CardSelectedArray = [];
      });

    // Clear Selected Array after deleting
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
    if (newImageUrl && this.user && this.user.id) {
      this.authService
        .updateUser(this.user.id, {
          ...this.user,
          userImageUrl: newImageUrl as string,
        })
        .finally(() => {
          this.loadInfo();
          this.isImageUploading = false;
        });
    }
  }

  deleteProfileImage() {
    if (this.user && this.user.id) {
      this.authService
        .updateUser(this.user.id, {
          ...this.user,
          userImageUrl: '',
        })
        .then(async () => {
          await this.fireStorage.storage
            .refFromURL(this.saveUserImageUrl)
            .delete();
          this.saveUserImageUrl = '';
        })
        .finally(() => {
          this.cancelDeleting();
          this.loadInfo();
        });
    }
  }
}
