import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { JwtHelperService } from '@auth0/angular-jwt';
import {environment} from '../../environments/environment'
import * as decode from 'jwt-decode';

@Injectable()
export class AuthService {
  public  apiUrl=environment.apiUrl;

  constructor(private http: HttpClient,  private _router: Router , private jwtHelper:JwtHelperService ) { }

  registerUser(user) {
    return this.http.post<any>(this.apiUrl+'/auth/register', user);
  }

  loginUser(user) {
    return this.http.post<any>(this.apiUrl+'/auth/login', user);
  }

  logoutUser() {
    localStorage.removeItem('token');
    this._router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  refreshToken() {
    return this.http.post<any>(this.apiUrl+'/auth/refresh', {});
   }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  isPoste(ExpectedPoste:string){
    const token = localStorage.getItem('token');
    const tokenPayload = decode(token);
    let Posts=tokenPayload.Posts;
    var myarr = Posts.split(",");
    myarr.pop();
    if ( this.isAuthenticated()  && myarr.includes(ExpectedPoste) ) {return true;}else{return false;}
  }

  myid(){
      const token = localStorage.getItem('token');
      const tokenPayload = decode(token);
      let id=tokenPayload.id;
      return id;
  }

  
  
  


}