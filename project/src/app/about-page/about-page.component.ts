import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css'],
})
export class AboutPageComponent {
  constructor(private translate: TranslateService) {}

  ngOnInit() {
    const currentLang = this.translate.currentLang;
    console.log(`Current Language in OtherComponent: ${currentLang}`);
  }
}
