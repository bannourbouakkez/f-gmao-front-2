import { BrowserModule,HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { IndexModule } from './features/index/index.module';
import { LoginModule } from './features/login/login.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';


import { AppComponent } from './app.component';
import { MatDialogRef,MatDialogModule } from '@angular/material/dialog';

import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material';

import { TreeModule } from 'angular-tree-component';

//import { TemplateModule } from './template/template.module';




//conf jidda time mel correctif 
/*
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FormsModule } from '@angular/forms';
import { OWL_DATE_TIME_FORMATS} from 'ng-pick-datetime';
import { OwlMomentDateTimeModule, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from 'ng-pick-datetime-moment';
import { OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'YYYY-MM-DD  HH:mm ', // CHANGE THIS TO A MOMENT.JS FORMAT
  datePickerInput: 'YYYY-MM-DD', // CHANGE THIS TO A MOMENT.JS FORMAT YYYY-MM-DD
  timePickerInput: 'HH:mm', // CHANGE THIS TO A MOMENT.JS FORMAT  
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};
*/
// ################################



/*
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
*/




//########################################### Design 
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import{ MaterialModule } from './material-module/material-module.module';


import { HttpModule} from '@angular/http';




//Layouts
import { CondensedComponent, BlankComponent, RootLayout,CorporateLayout,SimplyWhiteLayout,ExecutiveLayout, CasualLayout } from './@pages/layouts';
//Layout Service - Required
import { pagesToggleService } from './@pages/services/toggler.service';

//Shared Layout Components
import { SidebarComponent } from './@pages/components/sidebar/sidebar.component';
import { QuickviewComponent } from './@pages/components/quickview/quickview.component';
import { QuickviewService } from './@pages/components/quickview/quickview.service';
import { SearchOverlayComponent } from './@pages/components/search-overlay/search-overlay.component';
import { HeaderComponent } from './@pages/components/header/header.component';
import { HorizontalMenuComponent } from './@pages/components/horizontal-menu/horizontal-menu.component';
import { SharedModule } from './@pages/components/shared.module';
import { pgListViewModule} from './@pages/components/list-view/list-view.module';
import { pgCardModule} from './@pages/components/card/card.module';
import { pgCardSocialModule} from './@pages/components/card-social/card-social.module';
 
//Basic Bootstrap Modules
import {BsDropdownModule,
        AccordionModule, 
        AlertModule,
        ButtonsModule,
        CollapseModule,
        ModalModule,
        ProgressbarModule,
        TabsModule,
        TooltipModule,
        TypeaheadModule,
} from 'ngx-bootstrap';

//Pages Globaly required Components - Optional
import { pgTabsModule } from './@pages/components/tabs/tabs.module';
import { pgSwitchModule } from './@pages/components/switch/switch.module';
import { ProgressModule } from './@pages/components/progress/progress.module';


//Thirdparty Components / Plugins - Optional 
import { QuillModule } from 'ngx-quill'; 
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';


//Sample Blank Pages - Optional
import { BlankCorporateComponent } from './@pages/layouts/blank-corporate/blank-corporate.component';
import { BlankSimplywhiteComponent } from './@pages/layouts/blank-simplywhite/blank-simplywhite.component';
import { BlankCasualComponent } from './@pages/layouts/blank-casual/blank-casual.component';
import { pgSelectModule } from './@pages/components/select/select.module';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


//Hammer Config Overide
//https://github.com/angular/angular/issues/10541
export class AppHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
      'pinch': { enable: false },
      'rotate': { enable: false }
  }
}


//####################################################################################
//import{ MaterialModule } from './material-module/material-module.module';



//---------------------------- Zorro ----------------------

//---- Base 
//import { ReactiveFormsModule } from '@angular/forms';
//import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, en_US, NzInputModule, fr_FR } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import fr from '@angular/common/locales/fr';
import { MyheaderComponent } from './features/mypages/myheader/myheader.component';
registerLocaleData(en);

//---- component pour utiliser 
//import { NzButtonModule } from 'ng-zorro-antd/button';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { NzSelectModule } from 'ng-zorro-antd/select';


//import { ContenteditableModule } from '@ng-stack/contenteditable';

//#####################################################################""



import { NotificationComponent } from 'src/app/features/header/notifications/notification/notification.component';
import { AutoComponent } from 'src/app/features/header/auto/auto/auto.component';
import { MethodeStatComponent } from 'src/app/features/header/ministat/methode-stat/methode-stat.component';
import { AdminStatComponent } from 'src/app/features/header/ministat/admin-stat/admin-stat.component';
import { MagasinierStatComponent } from 'src/app/features/header/ministat/magasinier-stat/magasinier-stat.component';
import { AchatStatComponent } from 'src/app/features/header/ministat/achat-stat/achat-stat.component';







@NgModule({
  declarations: [
    AppComponent,
  

    // ______ design 
    CondensedComponent,
    CorporateLayout,
    SimplyWhiteLayout,
    ExecutiveLayout,
    CasualLayout,
    SidebarComponent, QuickviewComponent, SearchOverlayComponent, HeaderComponent,HorizontalMenuComponent,
    BlankComponent,
    RootLayout,
    BlankCorporateComponent,
    BlankSimplywhiteComponent,
    BlankCasualComponent,
    MyheaderComponent,
    //##################

    NotificationComponent,AutoComponent,MethodeStatComponent,AdminStatComponent,MagasinierStatComponent,AchatStatComponent


  ],
  imports: [
   

    BrowserModule,
    CoreModule,
    IndexModule,
    LoginModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatDialogModule,
    //FontAwesomeModule,
    
    MatDatepickerModule,
    MatMomentDateModule,
    /*
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['localhost'],
        blacklistedRoutes: ['localhost/auth/login']
      }
    }),

    */

    TreeModule.forRoot(),

    //conf jidda time mel correctif 
    /*
    ,OwlDateTimeModule, OwlNativeDateTimeModule 
    ,OwlMomentDateTimeModule
    //,FormsModule
    */
    //############################ 

    //MaterialModule,
    
    //TemplateModule

      
    //--------------- Design
    pgSelectModule,
    HttpModule,
    MaterialModule,

    CommonModule,
    FormsModule,
    //HttpModule,
    //HttpClientModule,
    SharedModule,
    ProgressModule,
    pgListViewModule,
    pgCardModule,
    pgCardSocialModule,
    //RouterModule.forRoot(AppRoutes),
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    pgTabsModule,
    PerfectScrollbarModule,
    pgSwitchModule,
    QuillModule.forRoot()
    
    // #######################################
    
    // ---- Zorrro --- 

    //,ContenteditableModule
    ,ReactiveFormsModule
    ,NgZorroAntdModule
    //,NgbModule
    //,NzSelectModule 
    ,NzInputModule
    
    //################
   ,AppRoutingModule


  ],
  providers:[
    { provide: MatDialogRef, useValue: {} },

    //conf jidda time mel correctif 
    /*
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
    { provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: { useUtc: true } }
    //############################ 
    */

    
    //----------------- Design
   
    QuickviewService,
    pagesToggleService,{
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: AppHammerConfig
    },
    
    //########################
    
    // ---- zorro 
    { provide: NZ_I18N, useValue: en_US }
    //###########
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AppModule { }

/*
export class AppModule {
  constructor() {
    library.add(faFilm);
  }
}
*/


