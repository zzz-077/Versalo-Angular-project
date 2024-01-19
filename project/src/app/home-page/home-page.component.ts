import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  constructor(private translate: TranslateService) {}

  ngOnInit() {
    const currentLang = this.translate.currentLang;
    console.log(`Current Language in OtherComponent: ${currentLang}`);
  }
}
