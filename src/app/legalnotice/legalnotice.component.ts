import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { Title } from '@angular/platform-browser'
import { Translate } from '../translate.service'
import { environment } from '../../environments/environment'
interface translationLegalnotice{
  Title:string
}
@Component({
  selector: 'app-legalnotice',
  templateUrl: './legalnotice.component.html',
  styleUrls: ['./legalnotice.component.scss']
})
export class LegalnoticeComponent implements OnInit {
  constructor(private title:Title, private translate:TranslateService) { }
  bool = false
  translation = new Translate(this.translate)
  ngOnInit() {
    this.translate.get('Legalnotice').subscribe((value: translationLegalnotice) => {
      this.title.setTitle(environment.websiteTitle + ' - ' + value.Title)
      if(this.translate.getBrowserLang() == 'de'){
      this.bool = true
      }
    })
  }

}
