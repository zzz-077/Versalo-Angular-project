import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { userInterface } from '../../interfaces/registerInterface';
import { Observable, map } from 'rxjs';
import { LocalStorageService } from '../local-storage-service/local-storage.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private fireAuth: AngularFireAuth,
    private fireStore: AngularFirestore,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  async login(email: string, password: string) {
    return await this.fireAuth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.localStorageService.setIsLogged(true);
        if (userCredential.user?.emailVerified == true) {
          const savedRoute = this.localStorageService.getIntendedRoute();
          if (savedRoute) {
            this.router.navigate([savedRoute]);
          } else {
            this.router.navigate(['']);
          }
        } else {
          if (userCredential && userCredential.user) {
            this.sendEmailForVarification(userCredential.user);
            this.router.navigate(['/verify-email']);
          }
        }
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

  // Forgot Password Recovery
  async forgotPassword(email: string) {
    return this.fireAuth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/verify-email']);
    });
  }

  // Update User Info
  updateUser(id: string, updateUser: userInterface) {
    return this.fireStore.collection('/users').doc(id).update(updateUser);
  }

  // Get Current User
  getCurrentUser() {
    return this.fireAuth.authState;
    // return this.fireAuth.currentUser;
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

  // Check if user is sign in
  isUserSignedIn(): boolean {
    return !!this.fireAuth.currentUser;
  }

  // Get User By Id
  getUserById(id: string) {
    return this.fireStore.collection('/users').doc<userInterface>(id).get();
  }

  // Sign Out Method
  async signOut(): Promise<void> {
    try {
      await this.fireAuth.signOut();
      localStorage.removeItem('jwt');
      this.localStorageService.setIsLogged(false);
      this.localStorageService.clearIntendedRoute();
      this.router.navigate(['/signin']).then(() => {
        window.location.reload();
        this.router.navigate(['/signin']);
      });
      // Optionally, set the user as not logged in after sign-out
      // this.isLogged = false;
      // localStorage.removeItem('jwt');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }
}
