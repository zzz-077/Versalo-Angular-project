import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Start Imported Components */
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { MyProfilePageComponent } from './my-profile-page/my-profile-page.component';
import { CarsPageComponent } from './cars-page/cars-page.component';

/*  End  Imported Components */

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'cars', component: CarsPageComponent },
  { path: 'profile', component: MyProfilePageComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'signin', component: SigninComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
