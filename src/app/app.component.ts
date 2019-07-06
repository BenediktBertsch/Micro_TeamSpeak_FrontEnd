import { Component, HostBinding } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { LandingpageComponent } from '../app/landingpage/landingpage.component'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostBinding('class') theme;
  constructor(private overlayContainer: OverlayContainer){
    if(localStorage.getItem('theme') == undefined){
      localStorage.setItem('theme', 'dark')
      this.theme = 'dark-theme'
      overlayContainer.getContainerElement().classList.add('dark-theme')
    }else{
      if(localStorage.getItem('theme') == 'dark'){
        this.theme = 'dark-theme'
        overlayContainer.getContainerElement().classList.add('dark-theme')
      }else{
        this.theme = 'light-theme'
        overlayContainer.getContainerElement().classList.add('light-theme')
      }
    }
  }
  changeTheme(){
    if(localStorage.getItem('theme') == 'dark'){
      this.theme = 'light-theme'
      this.overlayContainer.getContainerElement().classList.add('light-theme')
      localStorage.setItem('theme', 'light')
    }else{
      this.theme = 'dark-theme'
      this.overlayContainer.getContainerElement().classList.add('dark-theme')
      localStorage.setItem('theme', 'dark')
    }
    location.reload()
  }
}
