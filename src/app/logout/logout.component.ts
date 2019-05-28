import { Component, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material'
import { TranslateService } from '@ngx-translate/core'
import { Title } from '@angular/platform-browser'
import { Translate } from '../translate.service'
import { environment } from '../../environments/environment'
interface translationLogout {
  Title: string,
  Success: string
}
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements AfterViewInit{
  constructor(private translate:TranslateService, private title:Title, private router : Router, private snackBar: MatSnackBar) {}
  translation = new Translate(this.translate)
  success
  ngOnInit(){
    this.translate.get('Logout').subscribe((value:translationLogout) => {
      this.title.setTitle(environment.websiteTitle + ' - ' + value.Title)
      this.success = value.Success
    })
  }
  ngAfterViewInit(){
    localStorage.removeItem('auth-token')
    localStorage.removeItem('userid')
    setTimeout(() => {
    this.snackBar.open(this.success, 'x', {
      duration: 2000,
    });
  })
    this.router.navigate(['/'])
  }
}
