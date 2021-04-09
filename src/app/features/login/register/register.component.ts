import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private _authService:AuthService) { }

  ngOnInit() {}

}
