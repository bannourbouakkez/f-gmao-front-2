import { Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit, Input, ViewEncapsulation, Inject } from '@angular/core';
import { RootLayout } from '../root/root.component';
import { DOCUMENT } from '@angular/common';
import { AuthService } from 'src/app/shared/auth.service';
import { pagesToggleService } from '../../services/toggler.service';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'condensed-layout',
  templateUrl: './condensed.component.html',
  styleUrls: ['./condensed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CondensedComponent extends RootLayout implements OnInit {
  _footer = true;

  /*
  menuLinksOrigiale = [
    {
      label: 'Achat',
      //iconType: 'pg',
     // iconName: 'effects',
      toggle: 'close',
      //toggle: 'open',
      iconType: 'letter',
      iconName: 'A',
      submenu: [
        {
          label: "Demande d'achat",
          routerLink: 'achat/da/add',
          iconType: 'letter',
          iconName: 'AD',
          //toggle: 'close',
         
        },
        {
          label: 'Liste DAs',
          routerLink: 'achat/da/gererda/das',
          iconType: 'letter',
          iconName: 'DAs',
          //toggle: 'close',
         
        },
        {
          label: 'Ajouter Commande',
          routerLink: 'achat/cmd/add',
          iconType: 'letter',
          iconName: 'AC',
          //toggle: 'close',
         
        },
        {
          label: 'Liste commandes',
          routerLink: 'achat/cmd/liste',
          iconType: 'letter',
          iconName: 'CMs',
          //toggle: 'close',
         
        },
        {
          label: "Liste receptions",
          routerLink: 'achat/cmd/receptions/liste',
          iconType: 'letter',
          iconName: 'RCs',
          //toggle: 'close',
         
        },
        {
          label: "Liste retours",
          routerLink: 'achat/retour/retours/0',
          iconType: 'letter',
          iconName: 'RTs',
          //toggle: 'close',
         
        },
        {
          label: "Liste bons",
          routerLink: 'achat/cmd/bons/0',
          iconType: 'letter',
          iconName: 'BOs',
          //toggle: 'close',
        },
        {
          label: "Ajouter Facture",
          routerLink: 'achat/facture/add',
          iconType: 'letter',
          iconName: 'AF',
          //toggle: 'close',
        },
        {
          label: "Liste factures",
          routerLink: 'achat/facture/all/0',
          iconType: 'letter',
          iconName: 'FAs',
          //toggle: 'close',
        }

        
      ]
    },
    {
      label: 'Magasin',
      //iconType: 'pg',
     // iconName: 'effects',
      toggle: 'close',
      //toggle: 'open',
      iconType: 'letter',
      iconName: 'M',
      submenu: [
        {
          label: 'Liste Bsm',
          routerLink: 'magasin/bsm/bsms',
          iconType: 'letter',
          iconName: 'Ms',
          //toggle: 'close',
         
        },
        {
          label: 'Liste Bso',
          routerLink: 'magasin/bso/bsos/0',
          iconType: 'letter',
          iconName: 'Os',
          //toggle: 'close',
         
        },
        {
          label: 'Liste Retours',
          routerLink: 'magasin/retour/retours',
          iconType: 'letter',
          iconName: 'Rs',
          //toggle: 'close',
         
        },
        {
          label: 'Articles',
          //routerLink: 'intervention',
          iconType: 'letter',
          iconName: 'Art',
          //toggle: 'close',
          submenu: [
            {
              label: 'Ajouter Article',
              routerLink: 'magasin/articles/addoredit',
              iconType: 'letter',
              iconName: 'AA'
            },
            {
              label: 'Liste Articles',
              routerLink: 'magasin/articles/all',
              iconType: 'letter',
              iconName: 'ARTs'
            },
            {
              label: 'Ajouter Famille',
              routerLink: 'magasin/articles/addsf',
              iconType: 'letter',
              iconName: 'AF'
            },
            {
              label: 'Ajouter Sous Famille',
              routerLink: 'magasin/articles/addsf',
              iconType: 'letter',
              iconName: 'ASF',
              //toggle: 'close',
             
            }
            
          ]
        },
        {
          label: 'Outillage',
          //routerLink: 'intervention',
          iconType: 'letter',
          iconName: 'Out',
          //toggle: 'close',
          submenu: [
            {
              label: 'Ajouter outil',
              routerLink: 'magasin/outils/addoredit',
              iconType: 'letter',
              iconName: 'AO'
            },
            {
              label: 'Liste outils',
              routerLink: 'magasin/outils/outils/0',
              iconType: 'letter',
              iconName: 'OUTs'
            },
            {
              label: 'Ajouter utilisation',
              routerLink: 'magasin/outil/adduse',
              iconType: 'letter',
              iconName: 'AU'
            },
            {
              label: 'Liste Utilisation',
              routerLink: 'magasin/bso/bsos/1',
              iconType: 'letter',
              iconName: 'UTIs',
              //toggle: 'close',
             
            }
            
          ]
        },


       
    
      ]
    },
    {
      label: 'Correctif',
      //iconType: 'pg',
     // iconName: 'effects',
      toggle: 'close',
      //toggle: 'open',
      iconType: 'letter',
      iconName: 'C',
      submenu: [
        {
          label: 'Ajouter DI',
          routerLink: 'correctif/di/add/0',
          iconType: 'letter',
          iconName: 'ADI',
          //toggle: 'close',
         
        },
        {
          label: 'Liste DIs',
          routerLink: 'correctif/di/dis',
          iconType: 'letter',
          iconName: 'DIs',
          //toggle: 'close',
         
        },
        
        {
          label: 'Liste DI planifiées',
          routerLink: 'correctif/plan/plans',
          iconType: 'letter',
          iconName: 'DIs',
          //toggle: 'close',
         
        },
        
        // {
        //   label: 'Liste DI planifiées',
        //   routerLink: 'correctif/plan/calender',
        //   iconType: 'pg',
        //   iconName: 'calendar'
        // },
        

        

        {
          label: 'Ordres De Travail',
          routerLink: 'correctif/ot/ots',
          iconType: 'letter',
          iconName: 'OTs',
          //toggle: 'close',
         
        },
        {
          label: 'Bons De Travail',
          routerLink: 'correctif/bon/bons',
          iconType: 'letter',
          iconName: 'BTs',
          //toggle: 'close',
         
        }
      ]
    },
    {
      label: 'Preventif',
      //iconType: 'pg',
     // iconName: 'effects',
      toggle: 'close',
      iconType: 'letter',
      iconName: 'P',
      submenu: [
        {
          label: 'Intervention',
          //routerLink: 'intervention',
          iconType: 'letter',
          iconName: 'I',
          //toggle: 'close',
          submenu: [
            {
              label: 'Ajouter Intervention',
              routerLink: 'preventif/intervention/addoredit',
              iconType: 'letter',
              iconName: 'AI'
            },
            {
              label: 'Interventions',
              routerLink: 'preventif/intervention/interventions',
              iconType: 'letter',
              iconName: 'Is'
            }
          ]
        },
        {
          label: 'Interventions Planifiées',
          routerLink: 'preventif/plans/list',
          iconType: 'letter',
          iconName: 'IPs',
        },
       
        // {
        //   label: "Interventions Planifiées",
        //   routerLink: 'preventif/plans/ipcalender',
        //   iconType: 'pg',
        //   iconName: 'calendar',
        // },
       
        {
          label: 'Ordres De Travail',
          routerLink: 'preventif/otp/otps',
          iconType: 'letter',
          iconName: 'OTs',
        },
        {
          label: 'Bons De Travail',
          routerLink: 'preventif/bonp/bonps',
          iconType: 'letter',
          iconName: 'BTs',
        }
      ]
    },

    {
      label: 'Equipement',
      //iconType: 'pg',
     // iconName: 'effects',
      toggle: 'close',
      iconType: 'letter',
      iconName: 'E',
      submenu: [
        {
          label: 'Arbre',
          routerLink: 'equipement/equi/arbre',
          iconType: 'letter',
          iconName: 'Ar',
          //toggle: 'close',
         
        }
      ]
    }



  ];

  */










  /*
  
      {
        label: 'Dashboard',
        details: '12 New Updates',
        routerLink: 'dashboard',
        iconType: 'pg',
        iconName: 'home'
      },
      {
        label: 'Email',
        details: '234 New Emails',
        routerLink: 'email/list',
        iconType: 'pg',
        iconName: 'inbox'
      },
      {
        label: 'Social',
        routerLink: 'social',
        iconType: 'pg',
        iconName: 'social'
      },
      {
        label: 'Builder',
        routerLink: 'builder/condensed-builder',
        iconType: 'pg',
        iconName: 'brush'
      },
      {
        label: 'Layouts',
        iconType: 'pg',
        iconName: 'grid',
        toggle: 'close',
        submenu: [
          {
            label: 'Default',
            routerLink: 'layouts/default',
            iconType: 'letter',
            iconName: 'dl'
          },
          {
            label: 'Secondary',
            routerLink: 'layouts/secondary',
            iconType: 'letter',
            iconName: 'sl'
          },
          {
            label: 'Boxed',
            routerLink: 'layouts/boxed',
            iconType: 'letter',
            iconName: 'bl'
          }
        ]
      },
      {
        label: 'UI Elements',
        iconType: 'pg',
        iconName: 'shapes',
        toggle: 'close',
        submenu: [
          {
            label: 'Color',
            routerLink: 'ui/color',
            iconType: 'letter',
            iconName: 'c'
          },
          {
            label: 'Typography',
            routerLink: 'ui/typography',
            iconType: 'letter',
            iconName: 't'
          },
          {
            label: 'Icons',
            routerLink: 'ui/icons',
            iconType: 'letter',
            iconName: 'i'
          },
          {
            label: 'Buttons',
            routerLink: 'ui/buttons',
            iconType: 'letter',
            iconName: 'b'
          },
          {
            label: 'Notifications',
            routerLink: 'ui/notifications',
            iconType: 'letter',
            iconName: 'n'
          },
          {
            label: 'Modals',
            routerLink: 'ui/modal',
            iconType: 'letter',
            iconName: 'm'
          },
          {
            label: 'Progress & Activity',
            routerLink: 'ui/progress',
            iconType: 'letter',
            iconName: 'pa'
          },
          {
            label: 'Tabs & Accordians',
            routerLink: 'ui/tabs',
            iconType: 'letter',
            iconName: 'a'
          },
          {
            label: 'Sliders',
            routerLink: 'ui/sliders',
            iconType: 'letter',
            iconName: 's'
          },
          {
            label: 'Treeview',
            routerLink: 'ui/tree',
            iconType: 'letter',
            iconName: 'tv'
          }
        ]
      },
      {
        label: 'Forms',
        iconType: 'pg',
        iconName: 'note',
        toggle: 'close',
        submenu: [
          {
            label: 'Form Elements',
            routerLink: 'forms/elements',
            iconType: 'letter',
            iconName: 'fe'
          },
          {
            label: 'Form Layouts',
            routerLink: 'forms/layouts',
            iconType: 'letter',
            iconName: 'fl'
          },
          {
            label: 'Form Wizard',
            routerLink: 'forms/wizard',
            iconType: 'letter',
            iconName: 'fq'
          }
        ]
      },
      {
        label: 'Cards',
        routerLink: 'cards',
        iconType: 'pg',
        iconName: 'card'
      },
      {
        label: 'Views',
        routerLink: 'views',
        iconType: 'pg',
        iconName: 'layout'
      },
      {
        label: 'Tables',
        iconType: 'pg',
        iconName: 'table',
        toggle: 'close',
        submenu: [
          {
            label: 'Basic Tables',
            routerLink: 'tables/basic',
            iconType: 'letter',
            iconName: 'bt'
          },
          {
            label: 'Advance Tables',
            routerLink: 'tables/advance',
            iconType: 'letter',
            iconName: 'dt'
          }
        ]
      },
      {
        label: 'Maps',
        iconType: 'pg',
        iconName: 'map',
        toggle: 'close',
        submenu: [
          {
            label: 'Google Maps',
            routerLink: 'maps/google',
            iconType: 'letter',
            iconName: 'gm'
          }
        ]
      },
      {
        label: 'Charts',
        routerLink: 'charts',
        iconType: 'pg',
        iconName: 'chart'
      },
      {
        label: 'Extra',
        iconType: 'pg',
        iconName: 'effects',
        toggle: 'close',
        submenu: [
          {
            label: 'Invoice',
            routerLink: 'extra/invoice',
            iconType: 'letter',
            iconName: 'in'
          },
          {
            label: '404 Page',
            routerLink: 'session/error/404',
            iconType: 'letter',
            iconName: 'pg'
          },
          {
            label: '500 Page',
            routerLink: 'session/error/500',
            iconType: 'letter',
            iconName: 'pg'
          },
          {
            label: 'Login',
            routerLink: 'session/login',
            iconType: 'letter',
            iconName: 'l'
          },
          {
            label: 'Register',
            routerLink: 'session/register',
            iconType: 'letter',
            iconName: 're'
          },
          {
            label: 'Lockscreen',
            routerLink: 'session/lock',
            iconType: 'letter',
            iconName: 'ls'
          },
          {
            label: 'Gallery',
            routerLink: 'extra/gallery',
            iconType: 'letter',
            iconName: 'gl'
          },
          {
            label: 'Timeline',
            routerLink: 'extra/timeline',
            iconType: 'letter',
            iconName: 't'
          }
        ]
      },
      {
        label: 'Docs',
        externalLink: 'https://docs.pages.revox.io/v/angular/',
        target: '_blank',
        iconType: 'pg',
        iconName: 'flag'
      },
      {
        label: 'Changelog',
        externalLink: 'http://changelog.pages.revox.io/',
        target: '_blank',
        iconType: 'pg',
        iconName: 'clipboard'
      }
  
      */




  menuLinks = [];

  Achat: any = { label: 'Achat', toggle: 'close', iconType: 'letter', iconName: 'A', submenu: [] }
  Achat_Da = { label: "Demande d'achat", routerLink: 'achat/da/add', iconType: 'letter', iconName: 'AD' };
  Achat_Liste_Da = { label: 'Liste DAs', routerLink: 'achat/da/gererda/das', iconType: 'letter', iconName: 'DAs' };
  Achat_Ajouter_Commande = { label: 'Ajouter Commande', routerLink: 'achat/cmd/add', iconType: 'letter', iconName: 'AC' };
  Achat_Liste_Commande = { label: 'Liste commandes', routerLink: 'achat/cmd/liste', iconType: 'letter', iconName: 'CMs' };
  Achat_Liste_Reception = { label: "Liste receptions", routerLink: 'achat/cmd/receptions/liste', iconType: 'letter', iconName: 'RCs' };
  Achat_Liste_Retour = { label: "Liste retours", routerLink: 'achat/retour/retours/0', iconType: 'letter', iconName: 'RTs' };
  Achat_Liste_Bon = { label: "Liste bons", routerLink: 'achat/cmd/bons/0', iconType: 'letter', iconName: 'BOs' };
  Achat_Ajouter_Facture = { label: "Ajouter Facture", routerLink: 'achat/facture/add', iconType: 'letter', iconName: 'AF' };
  Achat_Liste_Facture = { label: "Liste factures", routerLink: 'achat/facture/all/0', iconType: 'letter', iconName: 'FAs' };

  Pack_Default_Achat = [this.Achat_Da, this.Achat_Liste_Da, this.Achat_Ajouter_Commande, this.Achat_Liste_Commande,
  this.Achat_Liste_Reception, this.Achat_Liste_Retour, this.Achat_Liste_Bon, this.Achat_Ajouter_Facture,
  this.Achat_Liste_Facture];
  Pack_Achat_Autres = [this.Achat_Da, this.Achat_Liste_Da];



  Magasin: any = { label: 'Magasin', toggle: 'close', iconType: 'letter', iconName: 'M', submenu: [] };
  Magasin_Liste_Bsm = { label: 'Liste Bsm', routerLink: 'magasin/bsm/bsms', iconType: 'letter', iconName: 'Ms' };
  Magasin_Liste_Bso = { label: 'Liste Bso', routerLink: 'magasin/bso/bsos/0', iconType: 'letter', iconName: 'Os' };
  Magasin_Liste_Retour = { label: 'Liste Retours', routerLink: 'magasin/retour/retours', iconType: 'letter', iconName: 'Rs' };
  Magasin_Article = {
    label: 'Articles', iconType: 'letter', iconName: 'Art',
    submenu: [
      { label: 'Ajouter Article', routerLink: 'magasin/articles/addoredit', iconType: 'letter', iconName: 'AA' },
      { label: 'Liste Articles', routerLink: 'magasin/articles/all', iconType: 'letter', iconName: 'ARTs' },
      { label: 'Ajouter Famille', routerLink: 'magasin/articles/addsf', iconType: 'letter', iconName: 'AF' },
      { label: 'Ajouter Sous Famille', routerLink: 'magasin/articles/addsf', iconType: 'letter', iconName: 'ASF' }
    ]
  };
  Magasin_Outillage = {
    label: 'Outillage', iconType: 'letter', iconName: 'Out',
    submenu: [
      { label: 'Ajouter outil', routerLink: 'magasin/outils/addoredit', iconType: 'letter', iconName: 'AO' },
      { label: 'Liste outils', routerLink: 'magasin/outils/outils/0', iconType: 'letter', iconName: 'OUTs' },
      { label: 'Ajouter utilisation', routerLink: 'magasin/outil/adduse', iconType: 'letter', iconName: 'AU' },
      { label: 'Liste Utilisation', routerLink: 'magasin/bso/bsos/1', iconType: 'letter', iconName: 'UTIs' }
    ]
  };
  Pack_Default_Magasin = [this.Magasin_Liste_Bsm, this.Magasin_Liste_Bso, this.Magasin_Liste_Retour, this.Magasin_Article,
  this.Magasin_Outillage];

  Correctif: any = { label: 'Correctif', toggle: 'close', iconType: 'letter', iconName: 'C', submenu: [] }
  Correctif_Ajouter_Di = { label: 'Ajouter DI', routerLink: 'correctif/di/add/0', iconType: 'letter', iconName: 'ADI' };
  Correctif_Liste_Di = { label: 'Liste DIs', routerLink: 'correctif/di/dis', iconType: 'letter', iconName: 'DIs' };
  Correctif_Liste_DIP = { label: 'Liste DI planifiées', routerLink: 'correctif/plan/plans', iconType: 'letter', iconName: 'DIs' };
  Correctif_Calender = { label: 'Calender', routerLink: 'correctif/plan/calender', iconType: 'pg', iconName: 'calendar' };
  Correctif_Liste_Ot = { label: 'Ordres De Travail', routerLink: 'correctif/ot/ots', iconType: 'letter', iconName: 'OTs' };
  Correctif_Liste_Bon = { label: 'Bons De Travail', routerLink: 'correctif/bon/bons', iconType: 'letter', iconName: 'BTs' };

  Pack_Default_Correctif = [this.Correctif_Ajouter_Di, this.Correctif_Liste_Di, this.Correctif_Liste_DIP,
  this.Correctif_Calender,this.Correctif_Liste_Ot, this.Correctif_Liste_Bon];


  Preventif: any = { label: 'Preventif', toggle: 'close', iconType: 'letter', iconName: 'P', submenu: [] }
  Preventif_Intervention = {
    label: 'Intervention', iconType: 'letter', iconName: 'I',
    submenu: [
      { label: 'Ajouter Intervention', routerLink: 'preventif/intervention/addoredit', iconType: 'letter', iconName: 'AI' },
      { label: 'Interventions', routerLink: 'preventif/intervention/interventions', iconType: 'letter', iconName: 'Is' }
    ]
  };
  Preventif_Liste_IP = { label: 'Interventions Planifiées', routerLink: 'preventif/plans/list', iconType: 'letter', iconName: 'IPs' };

  Preventif_Calender = { label: 'Calender', routerLink: 'preventif/plans/ipcalender', iconType: 'pg', iconName: 'calendar' };
  Preventif_Liste_Ot = { label: 'Ordres De Travail', routerLink: 'preventif/otp/otps', iconType: 'letter', iconName: 'OTs' };
  Preventif_Liste_Bon = { label: 'Bons De Travail', routerLink: 'preventif/bonp/bonps', iconType: 'letter', iconName: 'BTs' };

  Pack_Default_Preventif = [this.Preventif_Intervention, this.Preventif_Liste_IP, this.Preventif_Calender, this.Preventif_Liste_Ot,
  this.Preventif_Liste_Bon];

  Equipement: any = { label: 'Equipement', toggle: 'close', iconType: 'letter', iconName: 'E', submenu: [] }
  Equipement_Arbre = { label: 'Arbre', routerLink: 'equipement/equi/arbre', iconType: 'letter', iconName: 'Ar' };
  Pack_Default_Equipement = [this.Equipement_Arbre];

  Parametrage: any = { label: 'Parametrage', toggle: 'close', iconType: 'letter', iconName: 'PA', submenu: [] }
  Parametrage_Gestion_acces = { label: 'Gestion Droits', routerLink: 'index/acceuil', iconType: 'letter', iconName: 'GD' };
  Parametrage_Gestion_Niveau = { label: 'Gestion Niveaux', routerLink: 'index/acceuil', iconType: 'letter', iconName: 'GN' };
  Parametrage_Ajouter_Utilisateur = { label: 'Ajouter Utilisateur', routerLink: 'index/acceuil', iconType: 'letter', iconName: 'AU' };
  Parametrage_Ajouter_Intervenant = { label: 'Ajouter Intervenant', routerLink: 'index/acceuil', iconType: 'letter', iconName: 'IN' };
  Parametrage_Ajouter_Fournisseur = { label: 'Ajouter Fournisseur', routerLink: 'index/acceuil', iconType: 'letter', iconName: 'FO' };
  Parametrage_Ajouter_Unite = { label: 'Ajouter Unite', routerLink: 'index/acceuil', iconType: 'letter', iconName: 'UN' };
  Parametrage_Ajouter_Emplacement = { label: 'Ajouter Emplacement', routerLink: 'index/acceuil', iconType: 'letter', iconName: 'EM' };
  Parametrage_Ajouter_Secteur = { label: 'Ajouter Secteur', routerLink: 'index/acceuil', iconType: 'letter', iconName: 'SE' };
  Parametrage_Ajouter_Mode = { label: 'Ajouter Mode', routerLink: 'index/acceuil', iconType: 'letter', iconName: 'MO' };
  Parametrage_Ajouter_Etat = { label: 'Ajouter Etat', routerLink: 'index/acceuil', iconType: 'letter', iconName: 'ET' };
  Parametrage_Ajouter_Utilisation = { label: 'Ajouter Utilisation', routerLink: 'index/acceuil', iconType: 'letter', iconName: 'UT' };
  
  Pack_Default_Parametrage = [this.Parametrage_Gestion_acces,this.Parametrage_Gestion_Niveau,this.Parametrage_Ajouter_Utilisateur,this.Parametrage_Ajouter_Intervenant,this.Parametrage_Ajouter_Fournisseur,this.Parametrage_Ajouter_Unite,
  this.Parametrage_Ajouter_Emplacement,this.Parametrage_Ajouter_Secteur,this.Parametrage_Ajouter_Mode,this.Parametrage_Ajouter_Etat,
  this.Parametrage_Ajouter_Utilisation];







  //menuLinks=this.menuLinksOrigiale;//[];

  loading:boolean;




  constructor(public toggler: pagesToggleService, router: Router, private _authService: AuthService) {
    super(toggler, router);

    this.loading=false;
    router.events.subscribe((event:RouterEvent)=>{
      if(event instanceof RouteConfigLoadStart){
        this.loading=true;
      }else if(event instanceof RouteConfigLoadEnd){
        this.loading=false;
      }
    });

  }

  ngOnInit() {

    /*
    if(this.isPosts(['Admin','Methode','ChefDeEquipe']) ){
      console.log('Admin ou Methode ou ChefDeEquipe');
      
    }else{
      console.log('7atta wahid ménhom');
    }
    */

    /*
    if(this.isPosts(['Methode']) ){
      this.menuLinks.push(this.menu_correctif);
      this.menuLinks.push(this.menu_preventif);
      this.menuLinks.push(this.menu_achat);
      this.menuLinks.push(this.menu_magasin);
      
    }
    if(this.isPosts(['ResponsableAchat']) ){
     this.menuLinks.push(this.menu_achat);
     this.menuLinks.push(this.menu_magasin);
     this.CreateAchat(['ResponsableAchat'])
    }
 
    if(this.isPosts(['ResponsableMagasin']) ){
      this.menuLinks.push(this.menu_magasin);
     this.menuLinks.push(this.menu_achat);
    }
 
    */



    this.CreateMenu();
    //this.menuLinks=this.menuLinksOrigiale;




  }



  CreateMenu() {

    if (this.isPosts(['Admin'])) {
      this.Achat.submenu = this.Pack_Default_Achat;
      this.Magasin.submenu = this.Pack_Default_Magasin;
      this.Correctif.submenu = this.Pack_Default_Correctif;
      this.Preventif.submenu = this.Pack_Default_Preventif;
      this.Equipement.submenu = this.Pack_Default_Equipement;
      this.Parametrage.submenu = this.Pack_Default_Parametrage;
      
      this.menuLinks.push(this.Achat, this.Magasin, this.Correctif, this.Preventif,this.Equipement,this.Parametrage);
      return;
    }

    if (this.isPosts(['Methode'])) {
      this.Achat.submenu = this.Pack_Achat_Autres;
      this.Magasin.submenu = this.Pack_Default_Magasin;
      this.Correctif.submenu = this.Pack_Default_Correctif;
      this.Preventif.submenu = this.Pack_Default_Preventif;
      this.Equipement.submenu = this.Pack_Default_Equipement;
      this.menuLinks.push(this.Achat, this.Magasin, this.Correctif, this.Preventif, this.Equipement);
      return;
    }

    if (this.isPosts(['ResponsableAchat'])) {
      this.Achat.submenu = this.Pack_Default_Achat;
      this.Magasin.submenu = this.Pack_Default_Magasin;
      this.menuLinks.push(this.Achat, this.Magasin);
      return;
    }

    if (this.isPosts(['ResponsableMagasin'])) {
      this.Magasin.submenu = this.Pack_Default_Magasin;
      this.Achat.submenu = this.Pack_Default_Achat;
      this.menuLinks.push(this.Magasin, this.Achat);
      return;
    }

    if (this.isPosts(['ChefDeEquipe', 'ChefDePoste', 'ResponsableMaintenance'])) {
      this.Achat.submenu = this.Pack_Achat_Autres;
      this.Correctif.submenu = this.Pack_Default_Correctif;
      this.Preventif.submenu = this.Pack_Default_Preventif;
      this.Equipement.submenu = this.Pack_Default_Equipement;
      this.menuLinks.push(this.Correctif, this.Preventif, this.Equipement, this.Achat);
      return;
    }




  }





  isPoste(ExpectedPoste: string) {
    return this._authService.isPoste(ExpectedPoste);
  }

  isPosts(ExpectedPosts) {
    let bool = false;
    for (let i = 0; i < ExpectedPosts.length; i++) {
      if (this.isPoste(ExpectedPosts[i])) { bool = true; }
    }
    return bool;
  }




}
