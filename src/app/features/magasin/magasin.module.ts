import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
//import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MagasinRoutingModule } from './magasin-routing.module';
import { EquipementModule } from '../equipement/equipement.module';


// Reglage Date Time Finale 
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
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

//##########################


import { MaterialModule } from '../material/material.module';
import { InputComponent } from '../material/components/input/input.component';
import { SelectComponent } from '../material/components/select/select.component';
import { MultipleComponent } from '../material/components/multiple/multiple.component';
import { DateComponent } from '../material/components/date/date.component';
import { RadiobuttonComponent } from '../material/components/radiobutton/radiobutton.component';
import { CheckboxComponent } from '../material/components/checkbox/checkbox.component';
import { DynamicFormComponent } from '../material/components/dynamic-form/dynamic-form.component';
import { ButtonComponent } from '../material/components/button/button.component';
import { DynamicFieldDirective } from '../material/components/dynamic-field/dynamic-field.directive';


import { ListeArticlesComponent } from './article/liste-articles/liste-articles.component';
import { AddArticleComponent } from './article/add-article/add-article.component';
import { ArtAddSousFamilleComponent } from './article/art-add-sous-famille/art-add-sous-famille.component';
import { ArtArticleComponent } from './article/art-article/art-article.component';
import { ArtTestFilterComponent } from './article/art-test-filter/art-test-filter.component';
import { MagOutilAddComponent } from './outils/mag-outil-add/mag-outil-add.component';
import { MagOutilAffComponent } from './outils/mag-outil-aff/mag-outil-aff.component';
import { MagOutilListeComponent } from './outils/mag-outil-liste/mag-outil-liste.component';
import { MagOutilEditComponent } from './outils/mag-outil-edit/mag-outil-edit.component';
import { MagUtilisationAddComponent } from './outils/mag-utilisation-add/mag-utilisation-add.component';
import { MagUtilisationListeComponent } from './outils/mag-utilisation-liste/mag-utilisation-liste.component';
import { MagUtilisationAffComponent } from './outils/mag-utilisation-aff/mag-utilisation-aff.component';
import { MagDumpUtilisationsComponent } from './outils/mag-dump-utilisations/mag-dump-utilisations.component';
import { MagBeforeInvAddComponent } from './inventaire/mag-before-inv-add/mag-before-inv-add.component';
import { MagInvAddComponent } from './inventaire/mag-inv-add/mag-inv-add.component';
import { MagInvAffComponent } from './inventaire/mag-inv-aff/mag-inv-aff.component';
import { MagDumpIntervenantsComponent } from './inventaire/mag-dump-intervenants/mag-dump-intervenants.component';
import { MagInvIntervenantsComponent } from './inventaire/mag-inv-intervenants/mag-inv-intervenants.component';
import { MagBsmAccepterComponent } from './bsm/mag-bsm-accepter/mag-bsm-accepter.component';
import { DumpReasonComponent } from 'src/app/shared/dumps/dump-reason/dump-reason.component';
import { MagBsoAccepterComponent } from './bso/mag-bso-accepter/mag-bso-accepter.component';
import { MagBsoGererComponent } from './bso/mag-bso-gerer/mag-bso-gerer.component';
import { MagBsoAddComponent } from './outil/mag-bso-add/mag-bso-add.component';
import { CorrectifModule } from '../correctif/correctif.module';
import { CorrBsoOutilsComponent } from '../correctif/bso/corr-bso-outils/corr-bso-outils.component';
import { MagUseAffComponent } from './outil/mag-use-aff/mag-use-aff.component';
import { CorrBsoAffComponent } from '../correctif/bso/corr-bso-aff/corr-bso-aff.component';
import { MagBsoAffComponent } from './bso/mag-bso-aff/mag-bso-aff.component';
import { MagBsoListComponent } from './bso/mag-bso-list/mag-bso-list.component';
import { MagBsmListComponent } from './bsm/mag-bsm-list/mag-bsm-list.component';
import { MagRetourAddComponent } from './retour/mag-retour-add/mag-retour-add.component';
import { MagListRetourComponent } from './retour/mag-list-retour/mag-list-retour.component';
import { MagAffRetourComponent } from './retour/mag-aff-retour/mag-aff-retour.component';
import { MagBsmAffComponent } from './bsm/mag-bsm-aff/mag-bsm-aff.component';
import { TestUploadFilesComponent } from '../correctif/di/test-upload-files/test-upload-files.component';






@NgModule({
  declarations: [ListeArticlesComponent, AddArticleComponent,
  
    InputComponent,
    ButtonComponent,
    SelectComponent,
    MultipleComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,
    DynamicFieldDirective,
    DynamicFormComponent,
    ArtAddSousFamilleComponent,
    ArtArticleComponent,
    ArtTestFilterComponent,
    MagOutilAddComponent,
    MagOutilAffComponent,
    MagOutilListeComponent,
    MagOutilEditComponent,
    MagUtilisationAddComponent,
    MagUtilisationListeComponent,
    MagUtilisationAffComponent,
    MagDumpUtilisationsComponent,
    MagBeforeInvAddComponent,
    MagInvAddComponent,
    MagInvAffComponent,
    MagDumpIntervenantsComponent,
    MagInvIntervenantsComponent,
    MagBsmAccepterComponent,
    MagBsoAccepterComponent,
    MagBsoGererComponent,
    MagBsoAddComponent,
    MagUseAffComponent,

    

    MagBsoAffComponent,

    

    MagBsoListComponent,

    

    MagBsmListComponent,

    

    MagRetourAddComponent,

    

    MagListRetourComponent,

    

    MagAffRetourComponent,

    

    MagBsmAffComponent

    //,TestUploadFilesComponent


  ],
  imports: [
    CommonModule,
    MagasinRoutingModule,
    SharedModule,
    //FormsModule,ReactiveFormsModule,
    MaterialModule,
    EquipementModule,
    CorrectifModule


     // Reglage Date Time 
     ,OwlDateTimeModule, OwlNativeDateTimeModule,OwlMomentDateTimeModule
     // #################
  
  ],
  providers: [
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
    { provide: OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'en-SG'},

  ],
  entryComponents: [
    InputComponent,
    ButtonComponent,
    SelectComponent,
    MultipleComponent,
    DateComponent,
    RadiobuttonComponent,
    CheckboxComponent,

    DumpReasonComponent,
    CorrBsoOutilsComponent,
    MagBsmAccepterComponent,
    MagAffRetourComponent,
    MagRetourAddComponent,
    MagBsoAffComponent,
    MagBsoAccepterComponent,
    MagBsoGererComponent

    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    //,exports:[MagBsmAffComponent]

})
export class MagasinModule { }
