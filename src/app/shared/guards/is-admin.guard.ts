import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import * as decode from 'jwt-decode';


import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {
  constructor(public _authService: AuthService, public router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole ="admin" ; //route.data.expectedRole;
    const token = localStorage.getItem('token');
    // decode the token to get its payload
    const tokenPayload = decode(token);
    if ( !this._authService.isAuthenticated() || tokenPayload.who !== expectedRole ) {
      console.log('IsAdminGuard : false');
      //this.router.navigate(['']);
      return false;
      }
      console.log('IsAdminGuard : true');
    return true;
  }

  
}

