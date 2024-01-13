import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { SigninComponent } from './signin/signin.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
//matt imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CarCardComponent } from './car-card/car-card.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { MyProfilePageComponent } from './my-profile-page/my-profile-page.component';
import { CarsPageComponent } from './cars-page/cars-page.component';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from './user-service/user.service';
import { NgOptimizedImage, provideImgixLoader } from '@angular/common';
import { CarDetailsComponent } from './car-details/car-details.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    SigninComponent,
    HomePageComponent,
    NotFoundComponent,
    CarCardComponent,
    AboutPageComponent,
    MyProfilePageComponent,
    CarsPageComponent,
    CarDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatIconModule,
    NgOptimizedImage,
  ],
  providers: [UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
