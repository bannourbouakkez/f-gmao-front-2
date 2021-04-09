import { NgModule , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

//import { ReactiveFormsModule } from '@angular/forms';


import { CorrectifRoutingModule } from './correctif-routing.module';
import { CorrDiAddComponent } from './di/corr-di-add/corr-di-add.component';
import { CorrDiAffComponent } from './di/corr-di-aff/corr-di-aff.component';
import { CorrDiListComponent } from './di/corr-di-list/corr-di-list.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
//import { FormsModule } from '@angular/forms';

import { OWL_DATE_TIME_FORMATS} from 'ng-pick-datetime';
import { OwlMomentDateTimeModule, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from 'ng-pick-datetime-moment';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';


import { SharedModule } from 'src/app/shared/shared.module';
import { EquiAnomalieAddComponent } from '../equipement/anomalie/equi-anomalie-add/equi-anomalie-add.component';
import { EquipementModule } from '../equipement/equipement.module';
import { CorrOtAddComponent } from './ot/corr-ot-add/corr-ot-add.component';
import { CorrOtListComponent } from './ot/corr-ot-list/corr-ot-list.component';
import { CorrOtEditComponent } from './ot/corr-ot-edit/corr-ot-edit.component';
import { CorrBsmArticlesComponent } from './bsm/corr-bsm-articles/corr-bsm-articles.component';
import { CorrBsmAddComponent } from './bsm/corr-bsm-add/corr-bsm-add.component';
import { TestCallBsmAddComponent } from './bsm/test-call-bsm-add/test-call-bsm-add.component';
import { CorrBsmAffComponent } from './bsm/corr-bsm-aff/corr-bsm-aff.component';
import { TestCallOutilAddComponent } from './bso/test-call-outil-add/test-call-outil-add.component';
import { CorrBsoOutilsComponent } from './bso/corr-bso-outils/corr-bso-outils.component';
import { CorrBsoAddComponent } from './bso/corr-bso-add/corr-bso-add.component';
import { CorrBsoAffComponent } from './bso/corr-bso-aff/corr-bso-aff.component';
import { CorrDiPlanComponent } from './di/corr-di-plan/corr-di-plan.component';
import { CorrOtAffComponent } from './ot/corr-ot-aff/corr-ot-aff.component';
import { CorrPlanListComponent } from './plan/corr-plan-list/corr-plan-list.component';
import { CorrBonAddComponent } from './bon/corr-bon-add/corr-bon-add.component';
import { CorrBonIntervenantComponent } from './bon/corr-bon-intervenant/corr-bon-intervenant.component';
import { CorrListBonComponent } from './bon/corr-list-bon/corr-list-bon.component';
import { CorrAffBonComponent } from './bon/corr-aff-bon/corr-aff-bon.component';



export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  //fullPickerInput: 'l LT', // CHANGE THIS TO A MOMENT.JS FORMAT
  fullPickerInput: 'YYYY-MM-DD  HH:mm ', // CHANGE THIS TO A MOMENT.JS FORMAT
  //datePickerInput: 'DD-MM-YYYY', // CHANGE THIS TO A MOMENT.JS FORMAT YYYY-MM-DD
  datePickerInput: 'YYYY-MM-DD', // CHANGE THIS TO A MOMENT.JS FORMAT YYYY-MM-DD
  //datePickerInput: 'l', // CHANGE THIS TO A MOMENT.JS FORMAT MM-DD-YYYY
  timePickerInput: 'HH:mm', // CHANGE THIS TO A MOMENT.JS FORMAT  
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};


/*
export const MY_MOMENT_FORMATS = {
  fullPickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false},
  datePickerInput: {year: 'numeric', month: 'numeric', day: 'numeric', hour12: false},
  timePickerInput: {hour: 'numeric', minute: 'numeric', hour12: false},
  monthYearLabel: {year: 'numeric', month: 'short'},
  dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
  monthYearA11yLabel: {year: 'numeric', month: 'long'},
};
*/

// Calender 
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr'; 
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CorrCalenderPlanComponent } from './calender/corr-calender-plan/corr-calender-plan.component';
import { CalendarHeaderComponent } from './calender/calendar-header/calendar-header.component';
//import { CalendarHeaderComponent } from './calendar-header.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { TestUploadFilesComponent } from './di/test-upload-files/test-upload-files.component';
import { MagasinModule } from '../magasin/magasin.module';
import { MagBsmAffComponent } from '../magasin/bsm/mag-bsm-aff/mag-bsm-aff.component';
registerLocaleData(localeFr);
//#########

@NgModule({
  declarations: [CorrDiAddComponent, CorrDiAffComponent, CorrDiListComponent, CorrOtAddComponent, CorrOtListComponent, CorrOtEditComponent, CorrBsmArticlesComponent, CorrBsmAddComponent, TestCallBsmAddComponent, CorrBsmAffComponent, TestCallOutilAddComponent , CorrBsoOutilsComponent,CorrBsoAddComponent, CorrBsoAffComponent, CorrDiPlanComponent, CorrOtAffComponent, CorrPlanListComponent, CorrBonAddComponent, CorrBonIntervenantComponent, CorrListBonComponent, CorrAffBonComponent, CorrCalenderPlanComponent, CalendarHeaderComponent, TestUploadFilesComponent],
  imports: [
    CommonModule,
    SharedModule,
    CorrectifRoutingModule, 
    //MagasinModule,
    /*
    OwlDateTimeModule, OwlNativeDateTimeModule 
    ,OwlMomentDateTimeModule
    ,FormsModule
    */
    EquipementModule,


    NgbModalModule,
    FlatpickrModule.forRoot(),
    //BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })

    //,ReactiveFormsModule,FormsModule

  ],
  providers: [
    /*
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
    { provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: { useUtc: true } }
    */

    //{provide: OWL_DATE_TIME_LOCALE, useValue: 'en-SG'},
  ],
  exports:[CorrBsoOutilsComponent,CorrBsoAffComponent,CorrBsoAddComponent,CorrBsmAddComponent
    ,CorrBsmAffComponent
    ,TestUploadFilesComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [EquiAnomalieAddComponent,CorrBsmArticlesComponent,CorrBsmAddComponent,CorrBsoOutilsComponent,CorrBsoAddComponent,CorrDiPlanComponent,CorrBonIntervenantComponent
    ,CorrBsmAffComponent
    ,CorrBsoAffComponent
    //,MagBsmAffComponent
  ]


})
export class CorrectifModule { }
