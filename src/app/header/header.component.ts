import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core'
import { Translate } from '../translate.service'
import { AppComponent } from '../app.component'
import { LandingpageComponent } from '../landingpage/landingpage.component'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private translate: TranslateService, private  app: AppComponent) {}
  translation = new Translate(this.translate)
  bool = false;
  ngDoCheck(){
    if(localStorage.getItem('auth-token')!=null){
      this.bool = true
    }else{
      this.bool = false
    }
  }
  changeTheme(){
    this.app.changeTheme()
    //window.location.reload();
  }
}
