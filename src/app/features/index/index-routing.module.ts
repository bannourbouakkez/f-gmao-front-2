import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { IndexComponent } from './index/index.component';


const routes: Routes = [

 // { path: '', component: IndexComponent }

  { path: 'acceuil', component: AcceuilComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexRoutingModule { }
