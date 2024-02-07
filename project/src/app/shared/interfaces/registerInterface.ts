import { Timestamp } from '@angular/fire/firestore';

export interface userInterface {
  id?: string;
  userName: string;
  userLastName: string;
  userEmail: string;
  userPassword: string;
  userImageUrl: string;
}

export interface carInterface {
  carModel: string[];
  carYear: number[];
  carPrice: number[];
  carCategory: string[];
  gearBox: string[];
}
export interface carCardInterface {
  id?: string;
  userId: string;
  carModel: string;
  carSeries: string;
  carCategory: string;
  carYear: number;
  carPrice: number;
  carImg: string;
  carColor: string;
  gearBox: string;
  carDetails: string;
  wheel: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp | null;
  selected: boolean;
}
