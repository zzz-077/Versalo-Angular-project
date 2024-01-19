import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DataService } from '../data-service/data.service';
import {
  carCardInterface,
  carInterface,
} from '../data-service/registerInterface';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css'],
})
export class AddCardComponent {
  /*=================*/
  /*====VARIABLES====*/
  /*=================*/
  @Input() IsCardsAdd = false;
  @Input() IsCardsEdit = false;
  @Input() id = 0;
  @Input() SelectedCarIdForEdit: any[] = [];
  @Output() cancel = new EventEmitter<void>();
  saveCarImageUrl: string = '';
  oldSavedCarImageName: string | null = null;
  isSubmitting = false;
  isImageCompressing: boolean = false;
  imageUploadProgressBar: number = 0;
  carcardForedit: carCardInterface | null = null;
  carList: carInterface[] = [];
  isLoading = false;
  isLoadingOnEdit = false;
  userSelectedCard: number = this.SelectedCarIdForEdit[0];
  constructor(
    private fireStorage: AngularFireStorage,
    private data: DataService,
    private imageCompress: NgxImageCompressService
  ) {
    this.isLoading = true;
    this.data.getCarComponentsData().subscribe((items) => {
      if (Array.isArray(items)) {
        this.carList = items;
        this.isLoading = false;
      }
    });
  }
  /*=====================*/
  /*====CARD ADD FORM====*/
  /*=====================*/
  CardAddForm = new FormGroup({
    model: new FormControl('carModel', [
      Validators.required,
      this.validateModel.bind(this),
    ]),
    category: new FormControl('carCategory', [
      Validators.required,
      this.validateCategory.bind(this),
    ]),
    year: new FormControl(2024, [Validators.required]),
    price: new FormControl(0, [
      Validators.required,
      Validators.pattern(/^[1-9]\d*$/),
    ]),
    serie: new FormControl('', [Validators.required]),
    color: new FormControl('', [Validators.required]),
    gearBox: new FormControl('GearBox', [Validators.required]),
    details: new FormControl(''),
    wheel: new FormControl('Wheel', [Validators.required]),
    // carImageUrl: new FormControl(this.saveCarImageUrl),
  });
  validateCategory(control: AbstractControl): { [key: string]: any } | null {
    const selectedCategory = control.value;
    if (selectedCategory === 'carCategory') {
      return { invalidCategory: true };
    }
    return null;
  }

  validateModel(control: AbstractControl): { [key: string]: any } | null {
    const selectedModel = control.value;
    if (selectedModel === 'carModel') {
      return { invalidModel: true };
    }
    return null;
  }
  /*=================*/
  /*====FUNCTIONS====*/
  /*=================*/
  cardCancelBtn() {
    this.IsCardsAdd = false;
    this.IsCardsEdit = false;
    this.cancel.emit();
  }
  cardSaveBtn() {
    if (this.IsCardsEdit && !this.IsCardsAdd) {
      console.log('Updated');

      this.data
        .userCardUpdate({
          id: this.SelectedCarIdForEdit[0] as any,
          userId: this.id,
          carModel: this.CardAddForm?.value.model as string,
          carSeries: this.CardAddForm?.value.serie as string,
          carCategory: this.CardAddForm?.value.category as string,
          carYear: this.CardAddForm?.value.year as number,
          carPrice: this.CardAddForm?.value.price as number,
          carImg: this.saveCarImageUrl,
          carColor: this.CardAddForm?.value.color as string,
          gearBox: this.CardAddForm?.value.gearBox as string,
          carDetails: this.CardAddForm?.value.details as string,
          wheel: this.CardAddForm?.value.wheel as string,
          selected: false,
        })
        .subscribe(
          (item) => {
            this.isSubmitting = false;
            this.cancel.emit();
            this.data.userCardsGet(this.id).subscribe();
          },
          (error) => {
            this.isSubmitting = false;
            console.error('Error loading user data:', error);
          }
        );
    } else if (this.IsCardsAdd && !this.IsCardsEdit) {
      console.log('Added');
      if (
        (this.id && this.CardAddForm.valid) ||
        this.imageUploadProgressBar !== 0 ||
        this.isImageCompressing
      ) {
        this.IsCardsAdd = false;
        this.isSubmitting = true;
        this.data
          .userCardCreate({
            id: '',
            userId: this.id,
            carModel: this.CardAddForm.value.model?.toLowerCase() as string,
            carSeries: this.CardAddForm.value.serie?.toLowerCase() as string,
            carCategory:
              this.CardAddForm.value.category?.toLowerCase() as string,
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
            (cars) => {
              this.isSubmitting = false;
              this.cancel.emit();
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
  }

  ngOnInit() {
    // let cardId: number = this.userSelectedCard;
    if (this.SelectedCarIdForEdit.length === 1) {
      this.isLoadingOnEdit = true;
      this.data
        .getCarDetailsById(this.SelectedCarIdForEdit[0] as unknown as number)
        .subscribe((card) => {
          if (card) {
            this.carcardForedit = card;
          }
          this.CardAddForm.setValue({
            model: this.carcardForedit?.carModel || '',
            category: this.carcardForedit?.carCategory || '',
            year: this.carcardForedit?.carYear || 2024,
            price: this.carcardForedit?.carPrice || 0,
            serie: this.carcardForedit?.carSeries || '',
            color: this.carcardForedit?.carColor || '',
            gearBox: this.carcardForedit?.gearBox.toLowerCase() || 'GearBox',
            details: this.carcardForedit?.carDetails.toLowerCase() || '',
            wheel: this.carcardForedit?.wheel.toLowerCase() || 'Wheel',
          });
          this.saveCarImageUrl = card.carImg;
          this.isLoadingOnEdit = false;
        });
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
