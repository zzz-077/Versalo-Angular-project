import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { carInterface } from '../../interfaces/registerInterface';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(private firestore: AngularFirestore) {}

  getFilters(): Observable<carInterface[]> {
    return this.firestore
      .collection<carInterface>('CarFilters')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => a.payload.doc.data());
        })
      );
  }
}
