import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt'
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material'
import { Translate } from './translate.service'
import { TranslateService } from '@ngx-translate/core'
interface checkauthTranslation {
  Token: string
}
@Injectable({
  providedIn: 'root'
})
export class CheckAuthService {
  constructor(private translate:TranslateService, private router:Router, private snackBar: MatSnackBar) { }
  helper = new JwtHelperService();
  translation = new Translate(this.translate)
  checking(){
    if(localStorage.getItem('auth-token') != null)
    {
      if(this.helper.isTokenExpired(localStorage.getItem('auth-token'))){
        this.translate.get('CheckAuth').subscribe((value:checkauthTranslation) => {
          localStorage.removeItem('auth-token')
          localStorage.removeItem('userid')
        this.router.navigate(['/'])
        this.snackBar.open(value.Token, 'x', {
          duration: 2000,
        });
        })
      }
    }
  }
}
