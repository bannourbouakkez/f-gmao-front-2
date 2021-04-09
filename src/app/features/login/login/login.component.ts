import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  
  loginUserData:any={};

  constructor(private _auth: AuthService, private _router: Router) { }

  ngOnInit() {
  }

  loginUser () {
    this._auth.loginUser(this.loginUserData)
    .subscribe(
      res => {
        localStorage.setItem('token', res.jwt);
        this._router.navigate(['/index']);
      },
      err => {this._auth.logoutUser()}
    ) 
  }

  loginThisUser(email,pwd){
    this.loginUserData.email=email;
    this.loginUserData.password=pwd;
    this.loginUser();
  }
  

}