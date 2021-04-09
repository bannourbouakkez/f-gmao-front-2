import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

//import { FormsModule, ReactiveFormsModule } from "@angular/forms";


import { EquipementRoutingModule } from './equipement-routing.module';
import { EquiArbreComponent } from './arbre/equi-arbre/equi-arbre.component';

import { TreeModule } from 'angular-tree-component';
import { EquiFeuilleAddComponent } from './arbre/equi-feuille-add/equi-feuille-add.component';
import { EquiNodeSelectComponent } from './select/equi-node-select/equi-node-select.component';
import { EquiArbreForSelectComponent } from './select/equi-arbre-for-select/equi-arbre-for-select.component';
import { EquiArbreForSelectMultiComponent } from './select-multi/equi-arbre-for-select-multi/equi-arbre-for-select-multi.component';
import { EquiNodeSelectMultiComponent } from './select-multi/equi-node-select-multi/equi-node-select-multi.component';
import { EquiAnomalieAddComponent } from './anomalie/equi-anomalie-add/equi-anomalie-add.component';
import { EquiAnomalieListComponent } from './anomalie/equi-anomalie-list/equi-anomalie-list.component';
import { EquiFusionnerAnomalieComponent } from './anomalie/equi-fusionner-anomalie/equi-fusionner-anomalie.component';
import { EquiTacheAddComponent } from './tache/equi-tache-add/equi-tache-add.component';
import { EquiTacheListComponent } from './tache/equi-tache-list/equi-tache-list.component';
import { EditCompComponent } from './arbre/arbre-components/edit-comp/edit-comp.component';
import { AffCompComponent } from './arbre/arbre-components/aff-comp/aff-comp.component';
import { AddArticlesPageCompComponent } from './arbre/arbre-components/add-articles-page-comp/add-articles-page-comp.component';
import { AddArticlesCompComponent } from './arbre/arbre-components/add-articles-comp/add-articles-comp.component';


@NgModule({
  declarations: [EquiArbreComponent, EquiFeuilleAddComponent, EquiNodeSelectComponent, EquiArbreForSelectComponent, EquiArbreForSelectMultiComponent, EquiNodeSelectMultiComponent, EquiAnomalieAddComponent, EquiAnomalieListComponent, EquiFusionnerAnomalieComponent, EquiTacheAddComponent, EquiTacheListComponent, EditCompComponent, AffCompComponent, AddArticlesPageCompComponent, AddArticlesCompComponent],
  imports: [
    CommonModule,
    EquipementRoutingModule,
    SharedModule,
    TreeModule,

    //FormsModule,ReactiveFormsModule


  ],
  exports:[EquiAnomalieAddComponent,EquiNodeSelectComponent,EquiNodeSelectMultiComponent],
  entryComponents: [EquiFeuilleAddComponent,EquiArbreForSelectComponent,EquiArbreForSelectMultiComponent,EditCompComponent,AddArticlesCompComponent]
})
export class EquipementModule { }
