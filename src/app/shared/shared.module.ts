import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt'; // hétha zedtou zyeda yomkin zayid 
import { UploadService } from './upload.service';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatTreeModule } from '@angular/material';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from './others/format-datepicker';

import {NgxPaginationModule} from 'ngx-pagination';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { MatCheckboxModule, MatSelectModule,MatIconModule,MatCardModule} from '@angular/material'; // MatButtonModule
import { FileUploadModule } from "ng2-file-upload";
import { OuiOuNonComponent } from './others/oui-ou-non/oui-ou-non.component';


import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CdkTreeModule } from '@angular/cdk/tree';
import { DumpNodeComponent } from './dumps/dump-node/dump-node.component';
import { DumpListNodeComponent } from './dumps/dump-list-node/dump-list-node.component';
import { DumpReasonComponent } from './dumps/dump-reason/dump-reason.component';



//conf jidda time mel correctif 
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
//import { FormsModule } from '@angular/forms';
import { OWL_DATE_TIME_FORMATS} from 'ng-pick-datetime';
//import { OwlMomentDateTimeModule , OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from 'ng-pick-datetime-moment';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { EditDateComponent } from './others/edit-date/edit-date.component';
import { EditableDateComponent } from './others/editable-date/editable-date.component';
import { SharedReporterDateComponent } from './others/shared-reporter-date/shared-reporter-date.component';

export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'DD-MM-YYYY  HH:mm ', // CHANGE THIS TO A MOMENT.JS FORMAT
  datePickerInput: 'DD-MM-YYYY', // CHANGE THIS TO A MOMENT.JS FORMAT YYYY-MM-DD
  timePickerInput: 'HH:mm', // CHANGE THIS TO A MOMENT.JS FORMAT  
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};
// ################################

import { BreadcrumbComponent } from './design-dumps/breadcrumb/breadcrumb.component';


// ------ zorroo
import { NzSelectModule, NzButtonModule, NzCheckboxModule, NzDropDownModule, NzTableModule, NzPopconfirmModule, NzUploadModule, NzPopoverModule, NzDividerModule, NzRadioModule } from 'ng-zorro-antd';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { MessageModule } from '../@pages/components/message/message.module';
import { MessageService } from '../@pages/components/message/message.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { AffEquipementComponent } from './design-dumps/aff-equipement/aff-equipement.component';
import { ImgUploadDirectiveDirective } from './directives/img-upload-directive.directive';
import { ImgResizeUploadDirectiveDirective } from './directives/img-resize-upload-directive.directive';
import { ReplacePipe } from './pipes/replace.pipe';


//##############



//changement  mte3 machekil ng pick
//kenet//import { OwlMomentDateTimeModule, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from 'ng-pick-datetime-moment';
import {  OwlMomentDateTimeModule , OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from 'ng-pick-datetime/date-time/adapter/moment-adapter/moment-date-time-adapter.class';


@NgModule({
  declarations: [OuiOuNonComponent, DumpNodeComponent, DumpListNodeComponent, DumpReasonComponent, EditDateComponent, EditableDateComponent, SharedReporterDateComponent, BreadcrumbComponent, AffEquipementComponent, ImgUploadDirectiveDirective, ImgResizeUploadDirectiveDirective, ReplacePipe],
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,

    NgxPaginationModule,
    NgxMatSelectSearchModule,

    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,

    FileUploadModule,

    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,

    CdkTreeModule,
    MatTreeModule

    
    //conf jidda time mel correctif 
    ,OwlDateTimeModule, OwlNativeDateTimeModule 
    ,OwlMomentDateTimeModule
    //,FormsModule
    //############################ 

    // ---- zorro -----
    ,NzSelectModule
    ,NzInputModule
    ,NzInputNumberModule
    ,MessageModule
    ,NzButtonModule
    ,NzIconModule
    ,NzCheckboxModule
    ,NzDropDownModule
    ,NzCollapseModule
    ,NzTableModule
    ,NzPopconfirmModule
    ,NzUploadModule
    ,NzPopoverModule
    ,NzDividerModule
    ,NzRadioModule
    //,import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';


    //#################

   ],
  providers:[AuthService,JwtHelperService,
  
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},

     //conf jidda time mel correctif 
     {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
     { provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: { useUtc: true } },
     //############################ 

    UploadService

    // ----- design 
    ,MessageService
    //#############

  ],
  exports:[
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    MatDatepickerModule,MatNativeDateModule,MatButtonModule,MatFormFieldModule,MatInputModule,MatRippleModule,
    MatCheckboxModule,MatSelectModule,MatIconModule,MatCardModule,
    NgxPaginationModule,
    NgxMatSelectSearchModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,

    CdkTreeModule,MatTreeModule


    ,DumpNodeComponent,DumpListNodeComponent,

    //conf jdida mel correctif
    OwlDateTimeModule, OwlNativeDateTimeModule 
    ,OwlMomentDateTimeModule
    //#######################

    ,EditableDateComponent
    ,SharedReporterDateComponent
    ,AffEquipementComponent

    // ----- zorro ------
    ,NzSelectModule
    ,NzInputModule
    ,NzInputNumberModule
    ,MessageModule
    ,NzButtonModule
    ,NzIconModule
    ,NzCheckboxModule
    ,NzDropDownModule
    ,NzCollapseModule
    ,NzTableModule
    ,NzPopconfirmModule
    ,NzUploadModule
    ,NzPopoverModule
    ,NzDividerModule
    ,NzRadioModule
    //##################

    ,BreadcrumbComponent

    //,NotificationComponent,AutoComponent

    ,ImgUploadDirectiveDirective,ImgResizeUploadDirectiveDirective

    ,ReplacePipe
    
  ],
  entryComponents: [OuiOuNonComponent,EditDateComponent]
})
export class SharedModule { }
