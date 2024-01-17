import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data-service/data.service';
import { carInterface } from '../data-service/registerInterface';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css'],
})
export class AddCardComponent {
  @Input() fromChild = false;
  @Input() id = 0;
  @Output() cancel = new EventEmitter<void>();
  carList: carInterface[] = [];

  constructor(
    private fireStorage: AngularFireStorage,
    private data: DataService,
    private imageCompress: NgxImageCompressService
  ) {
    this.data.getCarComponentsData().subscribe((items) => {
      if (Array.isArray(items)) {
        this.carList = items;
      }
    });
  }

  /*=================*/
  /*====VARIABLES====*/
  /*=================*/
  saveCarImageUrl: string = '';
  oldSavedCarImageName: string | null = null;
  isSubmitting = false;
  isImageCompressing: boolean = false;
  imageUploadProgressBar: number = 0;
  /*=====================*/
  /*====CARD ADD FORM====*/
  /*=====================*/
  CardAddForm = new FormGroup({
    model: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    year: new FormControl(2024, [Validators.required]),
    price: new FormControl(0, [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
    serie: new FormControl('', [Validators.required]),
    color: new FormControl('', [Validators.required]),
    gearBox: new FormControl('GearBox', [Validators.required]),
    details: new FormControl(''),
    wheel: new FormControl('Wheel', [Validators.required]),
    // carImageUrl: new FormControl(this.saveCarImageUrl),
  });
  /*=================*/
  /*====FUNCTIONS====*/
  /*=================*/
  cardCancelBtn() {
    this.fromChild = false;
    this.cancel.emit();
  }
  cardSaveBtn() {
    if (this.id && this.CardAddForm.valid) {
      this.fromChild = false;
      this.isSubmitting = true;
      this.data
        .userCardCreate({
          id: '',
          userId: this.id,
          carModel: this.CardAddForm.value.model?.toLowerCase() as string,
          carSeries: this.CardAddForm.value.serie?.toLowerCase() as string,
          carCategory: this.CardAddForm.value.category?.toLowerCase() as string,
          carYear: this.CardAddForm.value.year as number,
          carPrice: this.CardAddForm.value.price as number,
          carImg: this.saveCarImageUrl,
          carColor: this.CardAddForm.value.color?.toLowerCase() as string,
          gearBox: this.CardAddForm.value.gearBox?.toLowerCase() as string,
          carDetails: this.CardAddForm.value.details?.toLowerCase() as string,
          wheel: this.CardAddForm.value.wheel?.toLowerCase() as string,
          selected: false,
        })
        .subscribe(
          () => {
            this.isSubmitting = false;
            this.cancel.emit();
            this.data.userCardsGet(this.id).subscribe();
          },
          (error) => {
            this.isSubmitting = false;
            console.error('Error loading user data:', error);
          }
        );
    } else {
      console.log('not requested to server');
    }
  }

  /*=========================*/
  /*====IMAGE TO FIREBASE====*/
  /*=========================*/

  async onFileChange(event: any) {
    const file = <File>event.target.files[0];
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
}
