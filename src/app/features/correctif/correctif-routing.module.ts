import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CorrDiAddComponent } from './di/corr-di-add/corr-di-add.component';
import { CorrDiAffComponent } from './di/corr-di-aff/corr-di-aff.component';
import { CorrDiListComponent } from './di/corr-di-list/corr-di-list.component';
import { CorrOtAddComponent } from './ot/corr-ot-add/corr-ot-add.component';
import { CorrOtListComponent } from './ot/corr-ot-list/corr-ot-list.component';
import { CorrOtEditComponent } from './ot/corr-ot-edit/corr-ot-edit.component';
import { CorrBsmArticlesComponent } from './bsm/corr-bsm-articles/corr-bsm-articles.component';
import { CorrBsmAddComponent } from './bsm/corr-bsm-add/corr-bsm-add.component';
import { TestCallBsmAddComponent } from './bsm/test-call-bsm-add/test-call-bsm-add.component';
import { CorrBsmAffComponent } from './bsm/corr-bsm-aff/corr-bsm-aff.component';
import { TestCallOutilAddComponent } from './bso/test-call-outil-add/test-call-outil-add.component';
import { CorrBsoAffComponent } from './bso/corr-bso-aff/corr-bso-aff.component';
import { CorrDiPlanComponent } from './di/corr-di-plan/corr-di-plan.component';
import { CorrOtAffComponent } from './ot/corr-ot-aff/corr-ot-aff.component';
import { CorrPlanListComponent } from './plan/corr-plan-list/corr-plan-list.component';
import { CorrBonAddComponent } from './bon/corr-bon-add/corr-bon-add.component';
import { CorrListBonComponent } from './bon/corr-list-bon/corr-list-bon.component';
import { CorrAffBonComponent } from './bon/corr-aff-bon/corr-aff-bon.component';
import { CorrCalenderPlanComponent } from './calender/corr-calender-plan/corr-calender-plan.component';
import { TestUploadFilesComponent } from './di/test-upload-files/test-upload-files.component';


const routes: Routes = [

  {
    path: 'di',
    children: [
        { path: 'add/:id', component: CorrDiAddComponent },
        { path: 'di/:id', component: CorrDiAffComponent },
        { path: 'dis', component: CorrDiListComponent },

        { path: 'plan/:id', component: CorrDiPlanComponent },
        { path: 'upload', component: TestUploadFilesComponent }

    ]
  },
  {
    path: 'ot',
    children: [
        { path: 'ot/:id', component: CorrOtAffComponent },
        { path: 'add/:id', component: CorrOtAddComponent },
        { path: 'edit/:id', component: CorrOtEditComponent },
       // { path: 'di/:id', component: CorrDiAffComponent },
        { path: 'ots', component: CorrOtListComponent }
    ]
  },
  {
    path: 'bsm',
    children: [
        { path: 'y', component: CorrBsmAddComponent },
        { path: 'x', component: CorrBsmArticlesComponent },
        { path: 'test', component: TestCallBsmAddComponent },
        { path: 'bsm/:id/:src', component: CorrBsmAffComponent }
    ]
  },
  {
    path: 'bso',
    children: [
        { path: 'test', component: TestCallOutilAddComponent },
        { path: 'bso/:id/:Src', component: CorrBsoAffComponent }
        //{ path: 'bso/:id', component: CorrBsmAffComponent }
    ]
  },
  {
    path: 'plan',
    children: [
        { path: 'plans', component: CorrPlanListComponent },
        { path: 'calender', component: CorrCalenderPlanComponent }
    ]
  },
  {
    path: 'bon',
    children: [
        { path: 'add/:OtID/:BonID', component: CorrBonAddComponent },
        { path: 'bons', component: CorrListBonComponent },
        { path: 'bon/:id', component: CorrAffBonComponent }
    ]
  }
  /*,
  {
    path: 'anomalie',
    children: [
      { path: 'add/:id', component: EquiAnomalieAddComponent },
      { path: 'list', component: EquiAnomalieListComponent },
      { path: 'fusionner', component: EquiFusionnerAnomalieComponent }
    ]
  }
  */

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorrectifRoutingModule { }
