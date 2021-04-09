import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquiArbreComponent } from './arbre/equi-arbre/equi-arbre.component';
import { EquiAnomalieAddComponent } from './anomalie/equi-anomalie-add/equi-anomalie-add.component';
import { EquiAnomalieListComponent } from './anomalie/equi-anomalie-list/equi-anomalie-list.component';
import { EquiTacheAddComponent } from './tache/equi-tache-add/equi-tache-add.component';
import { EquiTacheListComponent } from './tache/equi-tache-list/equi-tache-list.component';
import { EquiFusionnerAnomalieComponent } from './anomalie/equi-fusionner-anomalie/equi-fusionner-anomalie.component';



const routes: Routes = [

  {
    path: 'equi',
    children: [
        { path: 'arbre', component: EquiArbreComponent }
    ]
  },
  {
    path: 'anomalie',
    children: [
      { path: 'add/:id', component: EquiAnomalieAddComponent },
      { path: 'list', component: EquiAnomalieListComponent },
      { path: 'select', component: EquiFusionnerAnomalieComponent }
    ]
  },
  {
    path: 'tache',
    children: [
      { path: 'add/:id', component: EquiTacheAddComponent },
      { path: 'list', component: EquiTacheListComponent }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquipementRoutingModule { }
