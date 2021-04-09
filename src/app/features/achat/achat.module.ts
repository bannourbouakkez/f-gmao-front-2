import { NgModule , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchatRoutingModule } from './achat-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


//import { ReactiveFormsModule, FormsModule } from '@angular/forms';


/*
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatInputModule, MatRippleModule } from '@angular/material';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../shared/others/format-datepicker';
*/

import { FournisseurService } from './services/fournisseur.service';

import { AddFournisseurComponent, Confirmation } from './add-fournisseur/add-fournisseur.component';
import { ListeFournisseursComponent } from './liste-fournisseurs/liste-fournisseurs.component';
import { FounisseurSecteurComponent } from './founisseur-secteur/founisseur-secteur.component';
import { FounisseurModeComponent } from './founisseur-mode/founisseur-mode.component';
import { FounisseurSecteursComponent } from './founisseur-secteurs/founisseur-secteurs.component';
import { FounisseurModesComponent } from './founisseur-modes/founisseur-modes.component';
import { AddDaComponent } from './da/add-da/add-da.component';
import { DasComponent } from './da/das/das.component';
import { DaComponent } from './da/da/da.component';
import { DaService } from './da/services/da.service';
import { DaArticleComponent } from './da/da-article/da-article.component';
import { ArticleService } from '../magasin/services/article.service';
import { GererDasComponent, RejeterEntry, ReporterEntry } from './da/gerer-das/gerer-das.component';
import { GererDaComponent } from './da/gerer-da/gerer-da.component';
import { RejeterComponent } from './da/rejeter/rejeter.component';
import { ReporterComponent } from './da/reporter/reporter.component';
import { AddCmdComponent } from './cmd/add-cmd/add-cmd.component';
import { CmdService } from './cmd/services/cmd.service';
import { ListeCmdComponent } from './cmd/liste-cmd/liste-cmd.component';
import { CmdComponent } from './cmd/cmd/cmd.component';
import { CmdCorbeilleComponent } from './cmd/cmd-corbeille/cmd-corbeille.component';
import { ReceptionCmdComponent } from './cmd/reception-cmd/reception-cmd.component';
import { ReceptionComponent } from './cmd/reception/reception.component';
import { EditReceptionComponent } from './cmd/edit-reception/edit-reception.component';
import { CmdReceptionModifComponent } from './cmd/cmd-reception-modif/cmd-reception-modif.component';
import { ImprimerCmdComponent } from './cmd/imprimer-cmd/imprimer-cmd.component';
import { AppercuImpressionCmdComponent } from './cmd/appercu-impression-cmd/appercu-impression-cmd.component';
import { AppercuImpressionReceptionComponent } from './cmd/appercu-impression-reception/appercu-impression-reception.component';
import { AppercuImpressionModificationComponent } from './cmd/appercu-impression-modification/appercu-impression-modification.component';
import { ListeReceptionComponent } from './cmd/liste-reception/liste-reception.component';
import { ListeModifComponent } from './cmd/liste-modif/liste-modif.component';
import { CmdAddBonComponent } from './cmd/cmd-add-bon/cmd-add-bon.component';
import { CmdAffBonComponent } from './cmd/cmd-aff-bon/cmd-aff-bon.component';
import { CmdFacAddFactureComponent } from './cmd/facture/cmd-fac-add-facture/cmd-fac-add-facture.component';
import { AppercuImpressionFactureComponent } from './cmd/facture/appercu-impression-facture/appercu-impression-facture.component';
import { CmdAffFactureComponent } from './cmd/facture/cmd-aff-facture/cmd-aff-facture.component';
import { CmdListeFactureComponent } from './cmd/facture/cmd-liste-facture/cmd-liste-facture.component';
import { CmdListeBonComponent } from './cmd/cmd-liste-bon/cmd-liste-bon.component';
import { CmdCorbeilleBonComponent } from './cmd/cmd-corbeille-bon/cmd-corbeille-bon.component';
import { CmdAddRetourComponent } from './cmd/retour/cmd-add-retour/cmd-add-retour.component';
import { CmdAffRetourComponent } from './cmd/retour/cmd-aff-retour/cmd-aff-retour.component';
import { CmdListeRetourComponent } from './cmd/retour/cmd-liste-retour/cmd-liste-retour.component';
import { CmdAppercuRetourComponent } from './cmd/retour/cmd-appercu-retour/cmd-appercu-retour.component';
import { CmdListeRetourCorbComponent } from './cmd/retour/cmd-liste-retour-corb/cmd-liste-retour-corb.component';
//import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
//======>

//######

//import { MatFormFieldModule, MatSelectModule } from '@angular/material';


@NgModule({
  declarations: [AddFournisseurComponent, ListeFournisseursComponent, FounisseurSecteurComponent, FounisseurModeComponent, FounisseurSecteursComponent, FounisseurModesComponent, AddDaComponent, DasComponent, DaComponent, DaArticleComponent, GererDasComponent, GererDaComponent, RejeterComponent, ReporterComponent,RejeterEntry,ReporterEntry,Confirmation, AddCmdComponent, ListeCmdComponent, CmdComponent, CmdCorbeilleComponent, ReceptionCmdComponent, ReceptionComponent, EditReceptionComponent, CmdReceptionModifComponent, ImprimerCmdComponent, AppercuImpressionCmdComponent, AppercuImpressionReceptionComponent, AppercuImpressionModificationComponent, ListeReceptionComponent, ListeModifComponent, CmdAddBonComponent, CmdAffBonComponent,CmdFacAddFactureComponent, AppercuImpressionFactureComponent, CmdAffFactureComponent, CmdListeFactureComponent, CmdListeBonComponent, CmdCorbeilleBonComponent, CmdAddRetourComponent, CmdAffRetourComponent, CmdListeRetourComponent, CmdAppercuRetourComponent, CmdListeRetourCorbComponent],
  imports: [
    CommonModule,
    AchatRoutingModule,
    SharedModule,
    NgbModule

   // ,ReactiveFormsModule,FormsModule

  ],
  providers:[FournisseurService,DaService,ArticleService,CmdService],
  entryComponents: [FounisseurModeComponent,FounisseurSecteurComponent,DaArticleComponent,RejeterComponent,ReporterComponent,RejeterEntry,ReporterEntry,Confirmation,AppercuImpressionCmdComponent,AppercuImpressionReceptionComponent, AppercuImpressionModificationComponent,AppercuImpressionFactureComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AchatModule {}
