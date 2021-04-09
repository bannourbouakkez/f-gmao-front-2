import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivate {
  constructor(public _authService: AuthService, public router: Router) {}

  canActivate(): boolean {
    console.log(' IsAuthenticatedGuard = ' +this._authService.isAuthenticated())
    if (!this._authService.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
  
}
