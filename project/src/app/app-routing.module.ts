import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Start Imported Components */
import { RegisterComponent } from './pages/register/register.component';
import { SigninComponent } from './pages/signin/signin.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { MyProfilePageComponent } from './pages/my-profile-page/my-profile-page.component';
import { CarsPageComponent } from './pages/cars-page/cars-page.component';
import { CarDetailsComponent } from './pages/car-details/car-details.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

/*  End  Imported Components */

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'about', component: AboutPageComponent },
  {
    path: 'cars',
    component: CarsPageComponent,
  },
  { path: 'cars/cardetails/:id', component: CarDetailsComponent },
  { path: 'profile', component: MyProfilePageComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'signin', component: SigninComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
