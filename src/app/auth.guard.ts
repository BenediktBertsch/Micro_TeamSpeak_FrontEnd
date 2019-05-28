import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { JwtHelperService } from '@auth0/angular-jwt'
import { MatSnackBar } from '@angular/material'
import { environment } from '../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }
  helper = new JwtHelperService();
  
  canActivate(): Observable<boolean>{
    var token = localStorage.getItem('auth-token');
    if(token == null || this.helper.isTokenExpired(token) == true){
      this.snackBar.open('You are not authorized..', 'x', {
        duration: 2000,
      });
      localStorage.clear()
      return observableOf(false)
    }else{
      return this.http.post(environment.apiAddress + '/v1/loginstatus?token=' + token, null)
      .pipe(map(res => !JSON.stringify(res).includes('AuthorizationNotFound')))
    }
  }
}