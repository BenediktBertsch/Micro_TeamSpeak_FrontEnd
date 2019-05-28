import { Component, OnInit } from '@angular/core';
import { Translate } from '../translate.service'
import { TranslateService } from '@ngx-translate/core'
import { Title } from '@angular/platform-browser'
import { environment } from '../../environments/environment'
interface translationError{
  Title: string,
  message: string
}
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  constructor(private translate:TranslateService, private title:Title) { }
  translation = new Translate(this.translate)
  message:string
  ngOnInit() {
    this.translate.get('Error').subscribe((value:translationError) => {
      this.title.setTitle(environment.websiteTitle + ' - ' + value.Title)
      this.message = value.message
    })
  }

}
