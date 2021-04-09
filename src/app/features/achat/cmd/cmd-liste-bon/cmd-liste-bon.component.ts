import { Component, OnInit } from '@angular/core';
import { CmdService } from '../services/cmd.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { debounceTime , distinctUntilChanged  } from 'rxjs/operators';
import { MessageService } from 'src/app/@pages/components/message/message.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CmdAffBonComponent } from '../cmd-aff-bon/cmd-aff-bon.component';

@Component({
  selector: 'app-cmd-liste-bon',
  templateUrl: './cmd-liste-bon.component.html',
  styleUrls: ['./cmd-liste-bon.component.scss']
})
export class CmdListeBonComponent implements OnInit {
//---------- breadcrumb ---------
autres=[ 
  {url:'gmao/achat/facture/add',title:'Ajouter Facture'},
  {url:'gmao/achat/cmd/bons/1',title:'Liste bons Supprimées'}
 ];
 autres2=[ 
  {url:'gmao/achat/facture/add',title:'Ajouter Facture'},
  {url:'gmao/achat/cmd/bons/0',title:'Liste bons'}
 ];
 breadcrumb=[
  {url:'gmao',title:'home'},
  {url:'gmao/achat',title:'achat'} ,
  {url:'gmao/achat/bon',title:'bon'},
  {url:'',title:'Liste bons'}
];
breadcrumb2=[
  {url:'gmao',title:'home'},
  {url:'gmao/achat',title:'achat'} ,
  {url:'gmao/achat/bon',title:'bon'},
  {url:'',title:'Liste bons Supprimées'}
];
lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
isCorbeille(corbeille){
  var isCorbeille=+corbeille;
  //console.log('isCorbeille:'+isCorbeille);
  if(isCorbeille==1){return 'Supprimées';}
  else{ return '';}
}
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
     Factured:new FormControl(true),
     NonFactured:new FormControl(true)
    });
    
    //###################################
    me:any;

  bons=<any>[];
  corbeille:number;

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
     Factured:new FormControl(true),
     NonFactured:new FormControl(true)
   });
   // ######
   p: number = 1;
  */

  constructor(private cmdService:CmdService,private _currentRoute: ActivatedRoute,private _notification: MessageService
    ,private matDialog: MatDialog) { }
  
  ngOnInit() {
    let corbeille = +this._currentRoute.snapshot.paramMap.get('corbeille');
    this.corbeille=corbeille;
    this.getBons(1,corbeille);
    this.FilterValuesChanges();
  }
  
  getBons(page: number,corbeille){
    this.loadingFilter = true;
   this.cmdService.filterBons(page,this.itemsPerPage, this.filterForm.value,corbeille).then(
     res=>{
      this.total = res.total; this.p = page; this.loadingFilter = false;
      this.me = res.me;
      this.bons=res.bons;
    },
     err=>console.log(err)
   );
  }

  openBon(BonID){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={BonID};
        this.matDialog.open(CmdAffBonComponent, dialogConfig)
        .afterClosed().subscribe( res=> {
          if(res=='delete'){
              this.bons= this.bons.filter(d => d.BonID !== BonID);

              //this.reception.BonID=null;
              /*
              for(let i=0; i<this.receptions.length ; i++){
                 if(this.receptions[i].CmdRecID==CmdRecID){
                  this.receptions[i].BonID=null;
                 }
              }
              */
          }
        });
  }


  /*
  suprimerBon(BonID:number,i){
    this.cmdService.suprimerBon(BonID).then(
      res=>{
        console.log(res);
        this.bons.splice(i,1);
        this.notification('success', "Bon est supprimé avec succées .", 1500);
      },
      err=>console.log(err)
    );
  }
  */
  
  
  // New Filter && Pagination ---------------------------------
  filter() {
    this.getBons(1,this.corbeille);
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
      Factured:true,
      NonFactured:true
      //,auto:true
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

  // ------ Notification & Redirection  --------------
  //UrlToRedirection="/gmao/preventif/bonp/bonp/";
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

   
  // ==================================> Filter 
  /*
  filter(){
    console.log(this.filterForm.value);
    this.cmdService.filterBons(this.filterForm.value,this.corbeille).then(
      res=>{ this.bons=res; }
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
    Factured:true,
    NonFactured:true
     });
   this.formDate.reset();
   this.formDate.patchValue({minformdate:this.firstDay});
   this.filter();
 }


 FilterValuesChanges(){
 
   this.filterForm.controls.searchFilterText.valueChanges
   .pipe(debounceTime(500),distinctUntilChanged())
   .subscribe( value => this.auto() )

   this.filterForm.controls.Factured.valueChanges
   .pipe(debounceTime(10),distinctUntilChanged())
   .subscribe( value => this.auto() )
   
   this.filterForm.controls.NonFactured.valueChanges
   .pipe(debounceTime(10),distinctUntilChanged())
   .subscribe( value => this.auto() )
 

   }
   */
 // ###################################


  
}
