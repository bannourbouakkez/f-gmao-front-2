import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
//import { FormsModule } from '@angular/forms';

//import { ReactiveFormsModule } from '@angular/forms';


import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { LogoutComponent } from './logout/logout.component';


@NgModule({
  declarations: [LoginComponent, RegisterComponent, LogoutComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    //FormsModule,
    HttpClientModule,
    SharedModule

    //,ReactiveFormsModule
  ],
  providers:[],
  exports:[]
})
export class LoginModule {}
