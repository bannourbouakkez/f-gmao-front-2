import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrevAddInterventionComponent } from './intervention/prev-add-intervention/prev-add-intervention.component';
import { PrevPlanListComponent } from './plan/prev-plan-list/prev-plan-list.component';
import { PrevAddOtpComponent } from './otp/prev-add-otp/prev-add-otp.component';
import { PrevOtpsComponent } from './otp/prev-otps/prev-otps.component';
import { PrevAddBonComponent } from './bon/prev-add-bon/prev-add-bon.component';
import { PrevBonpsComponent } from './bon/prev-bonps/prev-bonps.component';
import { PrevOtpComponent } from './otp/prev-otp/prev-otp.component';
import { ReserverIntervenantTestComponent } from './otp/tests/reserver-intervenant-test/reserver-intervenant-test.component';
import { PrevInterventionComponent } from './intervention/prev-intervention/prev-intervention.component';
import { PrevInterventionListComponent } from './intervention/prev-intervention-list/prev-intervention-list.component';
import { ZorroTestComponent } from './otp/tests/zorro-test/zorro-test.component';
import { PrevIntreventionListTestComponent } from './intervention/prev-intrevention-list-test/prev-intrevention-list-test.component';
import { PrevBonpComponent } from './bon/prev-bonp/prev-bonp.component';
import { PrevPlanComponent } from './plan/prev-plan/prev-plan.component';
import { PrevCalenderIPComponent } from './calenders/prev-calender-i-p/prev-calender-i-p.component';


const routes: Routes = [

  { path: '', redirectTo: '/', pathMatch: "full" },
  {
    path: 'intervention',
    children: [
      { path: '', redirectTo: '/' ,  pathMatch: "full"},
      { path: 'addoredit', component: PrevAddInterventionComponent },
      { path: 'addoredit/:id', component: PrevAddInterventionComponent },
      { path: 'intervention/:id', component: PrevInterventionComponent },
      { path: 'interventions', component: PrevInterventionListComponent },
      { path: 'interventions-test', component: PrevIntreventionListTestComponent },
      

    ]
  },
  {
    path: 'plans',
    children: [
      { path: '', redirectTo: '/' ,  pathMatch: "full"},
      { path: 'list', component: PrevPlanListComponent },
      { path: 'plan/:id', component: PrevPlanComponent },
      { path: 'ipcalender', component: PrevCalenderIPComponent },
    
    ]
  },
  {
    path: 'otp',
    children: [
      { path: 'add/:InterventionID/:OtpID', component: PrevAddOtpComponent },
      { path: '', redirectTo: '/' ,  pathMatch: "full"},
      { path: 'otps', component: PrevOtpsComponent },
      { path: 'otp/:id', component: PrevOtpComponent },

      { path: 'otptest', component: ReserverIntervenantTestComponent },
      { path: 'zorro', component: ZorroTestComponent },
      //{ path: 'calender', component: PrevPlanListComponent },
      //{ path: 'executer/:InterventionID/:OtpID', component: PrevPlanExecuterComponent }
    ]
  },
  {
    path: 'bonp',
    children: [
      { path: '', redirectTo: '/' ,  pathMatch: "full"},
      { path: 'add/:OtpID/:BonpID', component: PrevAddBonComponent },
      { path: 'bonps', component: PrevBonpsComponent },
      { path: 'bonp/:id', component: PrevBonpComponent },
      //{ path: 'calender', component: PrevPlanListComponent },
      //{ path: 'executer/:InterventionID/:OtpID', component: PrevPlanExecuterComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreventifRoutingModule { }
