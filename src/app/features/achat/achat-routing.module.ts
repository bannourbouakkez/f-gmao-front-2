import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddFournisseurComponent } from './add-fournisseur/add-fournisseur.component';
import { ListeFournisseursComponent } from './liste-fournisseurs/liste-fournisseurs.component';
import { FounisseurSecteursComponent } from './founisseur-secteurs/founisseur-secteurs.component';
import { FounisseurModesComponent } from './founisseur-modes/founisseur-modes.component';
import { FounisseurModeComponent } from './founisseur-mode/founisseur-mode.component';
import { FounisseurSecteurComponent } from './founisseur-secteur/founisseur-secteur.component';
import { AddDaComponent } from './da/add-da/add-da.component';
import { DasComponent } from './da/das/das.component';
import { DaComponent } from './da/da/da.component';
import { GererDasComponent } from './da/gerer-das/gerer-das.component';
import { GererDaComponent } from './da/gerer-da/gerer-da.component';
import { AddCmdComponent } from './cmd/add-cmd/add-cmd.component';
import { CmdComponent } from './cmd/cmd/cmd.component';
import { ListeCmdComponent } from './cmd/liste-cmd/liste-cmd.component';
import { CmdCorbeilleComponent } from './cmd/cmd-corbeille/cmd-corbeille.component';
import { ReceptionCmdComponent } from './cmd/reception-cmd/reception-cmd.component';
import { ReceptionComponent } from './cmd/reception/reception.component';
import { EditReceptionComponent } from './cmd/edit-reception/edit-reception.component';
import { CmdReceptionModifComponent } from './cmd/cmd-reception-modif/cmd-reception-modif.component';
import { ImprimerCmdComponent } from './cmd/imprimer-cmd/imprimer-cmd.component';
import { ListeReceptionComponent } from './cmd/liste-reception/liste-reception.component';
import { ListeModifComponent } from './cmd/liste-modif/liste-modif.component';
import { CmdAddBonComponent } from './cmd/cmd-add-bon/cmd-add-bon.component';
import { CmdAffBonComponent } from './cmd/cmd-aff-bon/cmd-aff-bon.component';
import { CmdFacAddFactureComponent } from './cmd/facture/cmd-fac-add-facture/cmd-fac-add-facture.component';
import { CmdAffFactureComponent } from './cmd/facture/cmd-aff-facture/cmd-aff-facture.component';
import { CmdListeFactureComponent } from './cmd/facture/cmd-liste-facture/cmd-liste-facture.component';
import { CmdListeBonComponent } from './cmd/cmd-liste-bon/cmd-liste-bon.component';
import { CmdAddRetourComponent } from './cmd/retour/cmd-add-retour/cmd-add-retour.component';
import { CmdAffRetourComponent } from './cmd/retour/cmd-aff-retour/cmd-aff-retour.component';
import { CmdListeRetourCorbComponent } from './cmd/retour/cmd-liste-retour-corb/cmd-liste-retour-corb.component';
import { CmdListeRetourComponent } from './cmd/retour/cmd-liste-retour/cmd-liste-retour.component';


const routes: Routes = [

  { path: '', redirectTo: '/achat/fournisseurs/all', pathMatch: "full" },
  {
    path: 'fournisseurs',
    children: [
      { path: '', redirectTo: '/achat/fournisseurs/all' ,  pathMatch: "full"},
      { path: 'all', component: ListeFournisseursComponent },
      { path: 'addoredit', component: AddFournisseurComponent },
      { path: 'addoredit/:id', component: AddFournisseurComponent }
    ]
  },
  {
    path: 'secteurs',
    children: [
      { path: '', redirectTo: '/achat/secteurs/all' ,  pathMatch: "full"},
      { path: 'all', component: FounisseurSecteursComponent },
      { path: 'addoredit', component: FounisseurSecteurComponent },
      { path: 'addoredit/:id', component: FounisseurSecteurComponent }
    ]
  },
  {
    path: 'modes',
    children: [
      { path: '', redirectTo: '/achat/modes/all' ,  pathMatch: "full"},
      { path: 'all', component: FounisseurModesComponent },
      { path: 'addoredit', component: FounisseurModeComponent },
      { path: 'addoredit/:id', component: FounisseurModeComponent }
    ]
  },
  {
    path: 'da',
    children: [
      { path: '', redirectTo: '/achat/da/das' ,  pathMatch: "full" },
      { path: 'add', component: AddDaComponent }, // add 
      { path: 'add/:id', component: AddDaComponent }, // modifier 
      // { path: 'das', component: DasComponent }, // afficher , annuler , renvoyer  
      // { path: 'das/:id', component: DaComponent }, // annuler renvoyer  
      { path: 'gererda/das', component: GererDasComponent }, // afficher confirmé rejeter transferer reporté  
      { path: 'gererdas/das/:statut', component: GererDasComponent }, // afficher confirmé rejeter transferer reporté  
      { path: 'gererda/da', component: GererDaComponent }, //  confirmé rejeter transferer reporté
      { path: 'da/:id', component: DaComponent } //  confirmé rejeter transferer reporté
    ]
  },
  {
    path: 'cmd',
    children: [
      { path: '', redirectTo: '/achat/cmd/add' ,  pathMatch: "full" },
      { path: 'add', component: AddCmdComponent },
      { path: 'liste', component: ListeCmdComponent },
      { path: 'cmd/:id', component: CmdComponent },
      { path: 'corbeille', component: CmdCorbeilleComponent },
      { path: 'cmdreception/:id', component: ReceptionCmdComponent },
      { path: 'reception/:id', component: ReceptionComponent },
      { path: 'editreception/:id', component: EditReceptionComponent }, 
      { path: 'modif/:id', component: CmdReceptionModifComponent },
      { path: 'imprimer', component: ImprimerCmdComponent },
      { path: 'imprimer/:id', component: ImprimerCmdComponent },
      { path: 'receptions/liste', component: ListeReceptionComponent },
      { path: 'modifs/liste', component: ListeModifComponent },
      { path: 'addbon/:id', component: CmdAddBonComponent },
      { path: 'affbon/:id', component: CmdAffBonComponent },
      { path: 'bons/:corbeille', component: CmdListeBonComponent }
      
    ]
  },
  {
    path: 'facture',
    children: [
        { path: '', redirectTo: '/achat/facture/all' ,  pathMatch: "full"},
        { path: 'all/:corbeille', component: CmdListeFactureComponent },
        { path: 'add', component: CmdFacAddFactureComponent },
        { path: 'add/:id', component: CmdFacAddFactureComponent },
        { path: 'facture/:id', component: CmdAffFactureComponent },
    ]
  },
  {
    path: 'retour',
    children: [
       // { path: '', redirectTo: '/achat/facture/all' ,  pathMatch: "full"},
       // { path: 'all', component: CmdListeFactureComponent },
        //{ path: 'add', component: CmdFacAddFactureComponent },
        { path: 'add/:id', component: CmdAddRetourComponent },
        { path: 'retour/:id', component: CmdAffRetourComponent },
        { path: 'retours/:corbeille', component: CmdListeRetourComponent },
        { path: 'pagination', component: CmdListeRetourCorbComponent }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AchatRoutingModule { }
