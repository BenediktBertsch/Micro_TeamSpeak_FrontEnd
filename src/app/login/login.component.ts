import { Component, Injectable, HostBinding } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Title } from '@angular/platform-browser'
import { Translate } from '../translate.service'
import { environment } from '../../environments/environment';
interface translationLogin {
  Title: string,
  Login: string,
  username: string,
  password: string,
  loginbutton: string,
  NotSuccess: string,
  Success: string
}
interface userdata {
    token: string;
    userid:string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable()
export class LoginComponent{
  @HostBinding('class.dark-theme') darkTheme: boolean = true;
  constructor(private title: Title, private translate: TranslateService, private http: HttpClient,private snackBar: MatSnackBar, private router: Router){}
  translation = new Translate(this.translate)
  localuserdata:userdata
  success:string
  notsuccess:string
  ngOnInit() {
    this.translate.get('Login').subscribe((value:translationLogin) => {
      this.success = value.Success
      this.notsuccess = value.NotSuccess
      this.title.setTitle(environment.websiteTitle + ' - ' + value.Title)
    })
  }
  OnLoginButton(password:string, username:string): void {
    this.http.post(environment.apiAddress + '/v1/login?username='+username+'&password='+password,this.localuserdata).subscribe((res:userdata) => {
    if(res.token != null)
      {
        this.snackBar.open(this.success, 'x', {
          duration: 2000,
        });
        localStorage.setItem('auth-token',res.token)
        localStorage.setItem('userid',res.userid)
        this.router.navigate(['/dashboard'])
      }
      else{
        this.snackBar.open(this.notsuccess, 'x', {
          duration: 2000,
        });
      }
    })
  }
}

