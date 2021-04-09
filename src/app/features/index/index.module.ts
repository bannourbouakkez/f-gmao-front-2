import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index/index.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { AdminAccComponent } from './acceuils/admin-acc/admin-acc.component';
import { AchatAccComponent } from './acceuils/achat-acc/achat-acc.component';
import { MagasinAccComponent } from './acceuils/magasin-acc/magasin-acc.component';
import { MethodeAccComponent } from './acceuils/methode-acc/methode-acc.component';
import { OtherAccComponent } from './acceuils/other-acc/other-acc.component';


@NgModule({
  declarations: [IndexComponent, PageNotFoundComponent, AcceuilComponent, AdminAccComponent, AchatAccComponent, MagasinAccComponent, MethodeAccComponent, OtherAccComponent],
  imports: [
    CommonModule,
    IndexRoutingModule
  ]
})
export class IndexModule { }
