import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
//import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EquipementModule } from '../equipement/equipement.module';
import { PreventifRoutingModule } from './preventif-routing.module';


import { PrevAddInterventionComponent } from './intervention/prev-add-intervention/prev-add-intervention.component';
import { PrevPlanListComponent } from './plan/prev-plan-list/prev-plan-list.component';
import { PrevOtpsComponent } from './otp/prev-otps/prev-otps.component';
import { PrevAddOtpComponent } from './otp/prev-add-otp/prev-add-otp.component';
import { PrevAddBonComponent } from './bon/prev-add-bon/prev-add-bon.component';
import { CorrBonIntervenantComponent } from '../correctif/bon/corr-bon-intervenant/corr-bon-intervenant.component';
import { PrevBonpsComponent } from './bon/prev-bonps/prev-bonps.component';
import { CorrectifModule } from '../correctif/correctif.module';
import { PrevBonIntervenantComponent } from './bon/prev-bon-intervenant/prev-bon-intervenant.component';
import { PrevOtpComponent } from './otp/prev-otp/prev-otp.component';
import { ReserverIntervenantTestComponent } from './otp/tests/reserver-intervenant-test/reserver-intervenant-test.component';
import { PrevReservationComponent } from './otp/otp-reservation-intervenants/prev-reservation/prev-reservation.component';
import { PrevReservationIntervenantComponent } from './otp/otp-reservation-intervenants/prev-reservation-intervenant/prev-reservation-intervenant.component';
import { PrevReservationDefaultComponent } from './otp/otp-reservation-intervenants/prev-reservation-default/prev-reservation-default.component';
import { SharedReporterDateComponent } from 'src/app/shared/others/shared-reporter-date/shared-reporter-date.component';
import { PrevInterventionListComponent } from './intervention/prev-intervention-list/prev-intervention-list.component';
import { PrevInterventionComponent } from './intervention/prev-intervention/prev-intervention.component';
import { ZorroTestComponent } from './otp/tests/zorro-test/zorro-test.component';

import { ContenteditableModule } from '@ng-stack/contenteditable';
import { PrevIntreventionListTestComponent } from './intervention/prev-intrevention-list-test/prev-intrevention-list-test.component';
import { PrevBonpComponent } from './bon/prev-bonp/prev-bonp.component';
import { PrevPlanComponent } from './plan/prev-plan/prev-plan.component';

// Calender --------
import { CalendarHeaderIPComponent } from './calenders/calendar-header-i-p/calendar-header-i-p.component';
import { PrevCalenderIPComponent } from './calenders/prev-calender-i-p/prev-calender-i-p.component';

// Calender 
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr'; 
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { PrevIsIntReservedComponent } from './otp/otp-reservation-intervenants/prev-is-int-reserved/prev-is-int-reserved.component';
registerLocaleData(localeFr);
//#########

//###################

//import { NzSelectModule } from 'ng-zorro-antd';



@NgModule({
  declarations: [PrevAddInterventionComponent, PrevPlanListComponent,PrevAddOtpComponent,PrevOtpsComponent, PrevAddBonComponent, PrevBonpsComponent, PrevBonIntervenantComponent, PrevOtpComponent, ReserverIntervenantTestComponent, PrevReservationComponent, PrevReservationIntervenantComponent, PrevReservationDefaultComponent, PrevInterventionListComponent, PrevInterventionComponent, ZorroTestComponent, PrevIntreventionListTestComponent, PrevBonpComponent, PrevPlanComponent
                ,CalendarHeaderIPComponent,PrevCalenderIPComponent, PrevIsIntReservedComponent
],
  imports: [
    CommonModule,
    PreventifRoutingModule,
    SharedModule,
    EquipementModule,
    CorrectifModule,
    //,FormsModule,ReactiveFormsModule
    //,ContenteditableModule

    //,NzSelectModule

    NgbModalModule,
    FlatpickrModule.forRoot(),
    //BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
    


  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [PrevBonIntervenantComponent,PrevReservationComponent,PrevReservationIntervenantComponent,SharedReporterDateComponent
  ,PrevPlanComponent]
  
})
export class PreventifModule { }
