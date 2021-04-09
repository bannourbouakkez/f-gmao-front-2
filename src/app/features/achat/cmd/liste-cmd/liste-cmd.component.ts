import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CmdService } from '../services/cmd.service';
import { OuiOuNonComponent } from 'src/app/shared/others/oui-ou-non/oui-ou-non.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

import { debounceTime , distinctUntilChanged  } from 'rxjs/operators';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-liste-cmd',
  templateUrl: './liste-cmd.component.html',
  styleUrls: ['./liste-cmd.component.scss']
})
export class ListeCmdComponent implements OnInit {
 //---------- breadcrumb ---------
 autres=[ 
  {url:'gmao/achat/cmd/add',title:'Ajouter Commande'},
  {url:'gmao/achat/cmd/corbeille',title:'Liste Commandes supprimées'}
  //,{url:'gmao/correctif/ot/ots',title:'Liste OTs'}
  //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
  ];
 breadcrumb=[
  {url:'gmao',title:'home'},
  {url:'gmao/achat',title:'achat'} ,
  {url:'gmao/achat/commande',title:'commande'},
  {url:'',title:'Liste Commandes'}
];
lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
//###############################


// Pagination && Filter Form -------
  // Pagination 
  p: number = 1; total: number; itemsPerPage = 10; loadingFilter: boolean;
  selectedItemPerPage="10";
  // Filter Form 
  rechercheAuto = new FormControl(true);
  firstDay = new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, 2);
  filterForm: FormGroup = new FormGroup({
    searchFilterText:new FormControl(),
    datemin:new FormControl(this.firstDay),
    datemax:new FormControl(),
    auto:new FormControl(true),
    ouvert:new FormControl(true),
    ferme:new FormControl(false),
    vide:new FormControl(false)
  });
  //###################################

  cmds=<any>[];
  me:any;
  /*
  // ====> Filter 
  date = new Date();
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth()-1, 1);
  formDate:FormGroup=new FormGroup({
   minformdate:new FormControl(this.firstDay),
   maxformdate:new FormControl()
  });
  //-------------
  filterForm:FormGroup=new FormGroup({
    searchFilterText:new FormControl(),
    datemin:new FormControl(this.firstDay),
    datemax:new FormControl(),
    auto:new FormControl(true),
    ouvert:new FormControl(true),
    ferme:new FormControl(false),
    vide:new FormControl(false)
  });
  // ######
  p: number = 1;
  */
  constructor(private cmdService:CmdService,private dialog: MatDialog,private _notification: MessageService) { }

  ngOnInit() {
    this.getListeCmd(1,1);
    this.FilterValuesChanges();
  }

  getListeCmd(page: number,exist) {
    this.loadingFilter = true;
    this.cmdService.getListeCmd(page, this.itemsPerPage, this.filterForm.value ,exist).then(
      res=>{
        console.log(res);
        this.total = res.total; this.p = page; this.loadingFilter = false;
        this.me = res.me;
        this.cmds=res.cmds;
      },
      err=>console.log('ListeCmdComponent:getListeCmd:',err)
    );

  }
  


  supprimerCmd(ComandeID:number,i){
    /*
    let type='danger'; let msg='Voulez vraiment supprimer la commande ? ';
    let btnoui='Confirmer'; let btnnon='Annuler';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { type, msg , btnoui , btnnon };
    this.dialog.open(OuiOuNonComponent, dialogConfig).afterClosed().subscribe(res => { 
    if(res==1){
      this.cmdService.supprimerCmd(ComandeID).then(
        res=>{ this.cmds.splice(i, 1);},
        err=>console.log('ListeCmdComponent:supprimerCmd:',err)
      );
    }
    });
    */

   this.cmdService.supprimerCmd(ComandeID).then(
    res=>{
      this.cmds.splice(i, 1);
      this.notification('success', "Commande est supprimé avec succées .", 1500);
    },
    err=>console.log('ListeCmdComponent:supprimerCmd:',err)
  );

  }


  fermerCmd(ComandeID:number,j){
    this.cmdService.fermerCmd(ComandeID).then(
      resferme=>{
        for(let i=0; i<this.cmds.length;i++){
          if(this.cmds[i].CommandeID==ComandeID){
           this.cmds[i].statut="ferme";
          }
        }
        console.log('ferme : '+JSON.stringify(resferme));
      },
      errferme=>console.log(errferme)
    ); 
  }

  ouvrirCmd(ComandeID:number,j){
    this.cmdService.ouvrirCmd(ComandeID).then(
      resferme=>{
        for(let i=0; i<this.cmds.length;i++){
          if(this.cmds[i].CommandeID==ComandeID){
           this.cmds[i].statut="ouvert";
          }
        }
        console.log('ouvrir : '+resferme);
    },
      errferme=>console.log(errferme)
    ); 
  }

  // New Filter && Pagination ---------------------------------
  filter() {
    this.getListeCmd(1,1);
  }
  auto() {
    if (this.rechercheAuto.value == true) {
      this.filter();
    }
  }
  resetFilter() {
    this.filterForm.patchValue({
     searchFilterText:'',
     datemin:this.firstDay,
     datemax:'',
     ouvert:true,
     ferme:false,
     vide:false
    });

    if (this.rechercheAuto.value == false) {this.filter();}
  }
  FilterValuesChanges() {
    this.filterForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(value => this.auto())
  }
  incrementsItemsPerPage(e) {
    //this.itemsPerPage = e.target.value;
    this.itemsPerPage = e;
    this.filter();
  }
  // New Filter && Pagination #####################################

  // ------ Notification & Redirection  --------------
  UrlToRedirection="/gmao/preventif/bonp/bonp/";
  redirection(url) {
    //this._router.navigate([url]);
  }
  
  notification(type: string, msg: string, duree: number) {
    // type : primary , success , danger 
    this._notification.create(
      type,
      msg,
      {
        Position: "top-right",
        Style: "simple",
        Duration: duree
      }
    );
  }
//###################################################





/*
  // ==================================> Filter 
  filter(){
     console.log(this.filterForm.value);
     this.cmdService.filterCmd(this.filterForm.value,1).then(
       res=>{  this.cmds=res; }
       );
    }

  auto(){
    if(this.filterForm.controls['auto'].value==true){
      console.log(this.filterForm.value);
      this.filter();
    }
  }

  dateMinFilter(e){
    let dmin = new Date(e.value);
    dmin.setHours(0); dmin.setMinutes(0); dmin.setSeconds(0); dmin.setMilliseconds(0); 
    this.filterForm.patchValue({datemin:dmin}); 
    this.auto();
  }
  dateMaxFilter(e){
    let dmax = new Date(e.value);
    dmax.setHours(0); dmax.setMinutes(0); dmax.setSeconds(0); dmax.setMilliseconds(0); 
    this.filterForm.patchValue({datemax:dmax}); 
    this.auto();
  }

  resetFilter(){
    this.filterForm.patchValue({
     searchFilterText:'',
     datemin:this.firstDay,
     datemax:'',
     ouvert:true,
     ferme:false,
     vide:false
    });
    this.formDate.reset();
    this.formDate.patchValue({minformdate:this.firstDay});
    this.filter();
  }


  FilterValuesChanges(){
  
    this.filterForm.controls.searchFilterText.valueChanges
    .pipe(debounceTime(500),distinctUntilChanged())
    .subscribe( value => this.auto() )

    this.filterForm.controls.ouvert.valueChanges
    .pipe(debounceTime(10),distinctUntilChanged())
    .subscribe( value => this.auto() )
    
    this.filterForm.controls.ferme.valueChanges
    .pipe(debounceTime(10),distinctUntilChanged())
    .subscribe( value => this.auto() )
  
    this.filterForm.controls.vide.valueChanges
    .pipe(debounceTime(10),distinctUntilChanged())
    .subscribe( value => this.auto() )

    }
    
  // ###################################
  */





}
