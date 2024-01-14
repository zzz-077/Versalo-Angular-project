import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data-service/data.service';
import { uuid } from 'uuidv4';
import { carInterface } from '../data-service/registerInterface';
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
    private data: DataService
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
        })
        .subscribe(
          () => {
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

  /*=========================*/
  /*====IMAGE TO FIREBASE====*/
  /*=========================*/
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
