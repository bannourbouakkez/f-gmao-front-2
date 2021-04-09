import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndexComponent } from './features/index/index/index.component';
import { PageNotFoundComponent } from './features/index/page-not-found/page-not-found.component';

import { IsAuthenticatedGuard } from './shared/guards/is-authenticated.guard';
import { CondensedComponent } from './@pages/layouts';


const routes: Routes = [
  /*
  {path: '', redirectTo: '/index', pathMatch: 'full'},
  {path: 'achat', loadChildren: () => import('./features/achat/achat.module').then(m => m.AchatModule) },
  {path: 'magasin', loadChildren: () => import('./features/magasin/magasin.module').then(m => m.MagasinModule) },
  {path: 'equipement', loadChildren: () => import('./features/equipement/equipement.module').then(m => m.EquipementModule) },
  {path: 'correctif', loadChildren: () => import('./features/correctif/correctif.module').then(m => m.CorrectifModule) },
  {path: 'preventif', loadChildren: () => import('./features/preventif/preventif.module').then(m => m.PreventifModule) },
  {path: '**', component: PageNotFoundComponent}
  */

 {
  path: 'gmao',
  component: CondensedComponent,
  //runGuardsAndResolvers: 'always',
  children: [
    //{path: '', redirectTo: '/index', pathMatch: 'full'},
    {path: 'login', loadChildren: () => import('./features/login/login.module').then(m => m.LoginModule) },
    {path: 'achat', loadChildren: () => import('./features/achat/achat.module').then(m => m.AchatModule) },
    {path: 'magasin', loadChildren: () => import('./features/magasin/magasin.module').then(m => m.MagasinModule) },
    {path: 'equipement', loadChildren: () => import('./features/equipement/equipement.module').then(m => m.EquipementModule) },
    {path: 'correctif', loadChildren: () => import('./features/correctif/correctif.module').then(m => m.CorrectifModule) },
    {path: 'preventif', loadChildren: () => import('./features/preventif/preventif.module').then(m => m.PreventifModule) },
    {path: 'index', loadChildren: () => import('./features/index/index.module').then(m => m.IndexModule) }
   //,{path: '', redirectTo: 'gmao/index/acceuil' , pathMatch: 'full' }
    ,{path: 'notfound', component: PageNotFoundComponent}
  ]
}
,{ path: '', redirectTo: 'gmao/index/acceuil' , pathMatch: 'full' }
,{ path: 'gmao', redirectTo: 'gmao/index/acceuil' , pathMatch: 'full' }
,{ path: 'index', redirectTo: 'gmao/index/acceuil' }
,{path: '**', redirectTo: 'gmao/notfound'}
];

@NgModule({
  //imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
