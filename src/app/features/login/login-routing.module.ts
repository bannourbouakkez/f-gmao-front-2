import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from '../index/index/index.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from '../index/page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { IsAuthenticatedGuard } from 'src/app/shared/guards/is-authenticated.guard';
import { IsAdminGuard } from 'src/app/shared/guards/is-admin.guard';
import { LogoutComponent } from './logout/logout.component';


const routes: Routes = [
       { path: 'login', component: LoginComponent },
       { path: 'logout', component: LogoutComponent },
       { path: 'register', component: RegisterComponent } //  , canActivate: [IsAdminGuard]
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
