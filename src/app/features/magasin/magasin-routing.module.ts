import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListeArticlesComponent } from './article/liste-articles/liste-articles.component';
import { AddArticleComponent } from './article/add-article/add-article.component';
import { ArtAddSousFamilleComponent } from './article/art-add-sous-famille/art-add-sous-famille.component';
import { ArtArticleComponent } from './article/art-article/art-article.component';
import { ArtTestFilterComponent } from './article/art-test-filter/art-test-filter.component';
import { MagOutilAffComponent } from './outils/mag-outil-aff/mag-outil-aff.component';
import { MagOutilAddComponent } from './outils/mag-outil-add/mag-outil-add.component';
import { MagUtilisationAddComponent } from './outils/mag-utilisation-add/mag-utilisation-add.component';
import { MagUtilisationListeComponent } from './outils/mag-utilisation-liste/mag-utilisation-liste.component';
import { MagUtilisationAffComponent } from './outils/mag-utilisation-aff/mag-utilisation-aff.component';
import { MagOutilListeComponent } from './outils/mag-outil-liste/mag-outil-liste.component';
import { MagBeforeInvAddComponent } from './inventaire/mag-before-inv-add/mag-before-inv-add.component';
import { MagInvAddComponent } from './inventaire/mag-inv-add/mag-inv-add.component';
import { MagInvAffComponent } from './inventaire/mag-inv-aff/mag-inv-aff.component';
import { MagInvIntervenantsComponent } from './inventaire/mag-inv-intervenants/mag-inv-intervenants.component';
import { MagBsmAccepterComponent } from './bsm/mag-bsm-accepter/mag-bsm-accepter.component';
import { MagBsoAccepterComponent } from './bso/mag-bso-accepter/mag-bso-accepter.component';
import { MagBsoGererComponent } from './bso/mag-bso-gerer/mag-bso-gerer.component';
import { MagBsoAddComponent } from './outil/mag-bso-add/mag-bso-add.component';
import { MagUseAffComponent } from './outil/mag-use-aff/mag-use-aff.component';
import { MagBsoAffComponent } from './bso/mag-bso-aff/mag-bso-aff.component';
import { MagBsoListComponent } from './bso/mag-bso-list/mag-bso-list.component';
import { MagBsmListComponent } from './bsm/mag-bsm-list/mag-bsm-list.component';
import { MagRetourAddComponent } from './retour/mag-retour-add/mag-retour-add.component';
import { MagListRetourComponent } from './retour/mag-list-retour/mag-list-retour.component';
import { MagAffRetourComponent } from './retour/mag-aff-retour/mag-aff-retour.component';
import { MagBsmAffComponent } from './bsm/mag-bsm-aff/mag-bsm-aff.component';


const routes: Routes = [

  { path: '', redirectTo: '/magasin/articles/all', pathMatch: "full" },
  {
    path: 'articles',
    children: [
      { path: '', redirectTo: '/magasin/articles/all' ,  pathMatch: "full"},
      { path: 'all', component: ListeArticlesComponent },
      { path: 'article/:id', component: ArtArticleComponent },
      { path: 'addoredit', component: AddArticleComponent },
      { path: 'addoredit/:id', component: AddArticleComponent },
      { path: 'addsf', component: ArtAddSousFamilleComponent },
      { path: 'test', component: ArtTestFilterComponent }
    ]
  },
  {
    path: 'outils',
    children: [
      //{ path: '', redirectTo: '/magasin/outils/all' ,  pathMatch: "full"},
      //{ path: 'all', component: ListeArticlesComponent },
      { path: 'outil/:id', component: MagOutilAffComponent },
      { path: 'addoredit', component: MagOutilAddComponent },
      { path: 'addoredit/:id', component: MagOutilAddComponent },
      { path: 'outils/:corbeille', component: MagOutilListeComponent },

      { path: 'adduse', component: MagUtilisationAddComponent },
      { path: 'utilisations/:corbeille', component: MagUtilisationListeComponent },
      { path: 'utilisation/:id', component: MagUtilisationAffComponent }
    ]
  },
  { 
    // 2222222222222222222222222222222
    path: 'outil',
    children: [
      { path: 'adduse', component: MagBsoAddComponent },
      { path: 'adduse/:id', component: MagBsoAddComponent },
      { path: 'use/:id', component: MagUseAffComponent } 
    ]
  },
  {
    path: 'inv',
    children: [
      //{ path: '', redirectTo: '/magasin/outils/all' ,  pathMatch: "full"},
      //{ path: 'all', component: ListeArticlesComponent },
      //{ path: 'outil/:id', component: MagOutilAffComponent },
      { path: 'beforeadd', component: MagBeforeInvAddComponent },
      { path: 'add', component: MagInvAddComponent },
      { path: 'inventaire/:id', component: MagInvAffComponent },
      { path: 'inventaires', component: MagInvIntervenantsComponent }
      //{ path: 'addoredit/:id', component: MagOutilAddComponent },
      //{ path: 'outils/:corbeille', component: MagOutilListeComponent }
    ]
  },
  {
    path: 'bsm',
    children: [
      { path: 'bsm/:id/:src', component: MagBsmAccepterComponent },
      { path: 'bsms', component: MagBsmListComponent },
      { path: 'aff/:id/:Src', component: MagBsmAffComponent }
    ]
  },
  {
    path: 'bso',
    children: [
      { path: 'aff/:id/:Src', component: MagBsoAffComponent },
      { path: 'bso/:id/:src', component: MagBsoAccepterComponent },
      { path: 'gerer/:id/:src', component: MagBsoGererComponent },
      { path: 'bsos/:utilisation', component: MagBsoListComponent },
    ]
  },
  {
    path: 'retour',
    children: [
      { path: 'add/:id/:src', component: MagRetourAddComponent },
      { path: 'retours', component: MagListRetourComponent },
      { path: 'retour/:id/:src', component: MagAffRetourComponent }
      
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MagasinRoutingModule { }
