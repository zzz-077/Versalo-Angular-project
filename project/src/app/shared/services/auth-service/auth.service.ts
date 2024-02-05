import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { userInterface } from '../data-service/registerInterface';
import { Observable, map } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireAuth: AngularFireAuth,
    private fireStore: AngularFirestore,
    private router: Router
  ) {}

  async login(email: string, password: string) {
    return this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        localStorage.setItem('jwt', 'true');
        if (userCredential.user?.emailVerified == true) {
          this.router.navigate(['']);
        } else {
          if (userCredential && userCredential.user) {
            this.sendEmailForVarification(userCredential.user);
            this.router.navigate(['/verify-email']);
          }
        }
      })
      .catch((error) => {
        localStorage.setItem('jwt', 'false');
        this.router.navigate(['/']);
      });
  }

  // SignUp Method
  async signUp(userObj: userInterface) {
    return await this.fireAuth
      .createUserWithEmailAndPassword(userObj.userEmail, userObj.userPassword)
      .then(async (userCredential) => {
        console.log(userCredential);

        const {
          userEmail,
          userLastName,
          userImageUrl,
          userName,
          userPassword,
        } = userObj;
        const user = {
          userEmail,
          userLastName,
          userImageUrl,
          userName,
          userPassword,
        };
        return await this.fireStore
          .collection('/users')
          .add(user)
          .then(async (res) => {
            if (userCredential && userCredential.user) {
              await this.login(userEmail, userPassword);
            }
          });
      });
  }

  // send Email For Varification
  async sendEmailForVarification(user: any) {
    await user.sendEmailVerification().then(
      (res: any) => {
        this.router.navigate(['/verify-email']);
      },
      (err: any) => {
        console.log(err);
        throw Error("Can't send email right now, please try again later.");
      }
    );
  }

  // Update User Info
  updateUser(id: string, updateUser: userInterface) {
    return this.fireStore.collection('/users').doc(id).update(updateUser);
  }

  // Get Current User
  getCurrentUser() {
    return this.fireAuth.authState;
  }

  // Get Current User Full Information
  getCurrentUserFull(email: string): Observable<userInterface> {
    const queryFn: QueryFn = (ref) => ref.where('userEmail', '==', email);

    return this.fireStore
      .collection('/users', queryFn)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((action) => {
            const data = action.payload.doc.data() as userInterface;

            const id = action.payload.doc.id;
            return { ...data, id };
          })[0];
        })
      );
  }

  getUserById(id: string) {
    return this.fireStore.collection('/users').doc<userInterface>(id).get();
  }

  // Sign Out Method
  signOut() {
    this.fireAuth.signOut().then(
      () => {
        localStorage.removeItem('jwt');
        this.router.navigate(['/signin']);
      },
      (err) => {
        console.log(err.message);
      }
    );
  }
}
