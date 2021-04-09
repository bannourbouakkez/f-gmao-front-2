import { Component, OnInit } from '@angular/core';
import { CmdService } from '../services/cmd.service';
import { FormGroup, FormControl } from '@angular/forms';

import { debounceTime , distinctUntilChanged  , map} from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CmdAffBonComponent } from '../cmd-aff-bon/cmd-aff-bon.component';

@Component({
  selector: 'app-liste-reception',
  templateUrl: './liste-reception.component.html',
  styleUrls: ['./liste-reception.component.scss']
})
export class ListeReceptionComponent implements OnInit {
 //---------- breadcrumb ---------
 autres=[ 
  {url:'gmao/achat/cmd/add',title:'Ajouter Commande'},
  {url:'gmao/achat/cmd/liste',title:'Liste commandes'}
 ];
 breadcrumb=[
  {url:'gmao',title:'home'},
  {url:'gmao/achat',title:'achat'} ,
  {url:'gmao/achat/commande',title:'reception'},
  {url:'',title:'Liste Receptions'}
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
     isModified:new FormControl(true),
     isPropre:new FormControl(true)
  });
  //###################################
  me:any;

  receptions=<any>[];

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
     isModified:new FormControl(true),
     isPropre:new FormControl(true)
   });
   // ######
   p: number = 1;
   */
  constructor(private cmdService:CmdService,private matDialog: MatDialog) { }

  ngOnInit() {
    this.getReceptions(1);
    this.FilterValuesChanges();
  }

  getReceptions(page: number){
    this.loadingFilter = true;
    this.cmdService.getReceptions(page, this.itemsPerPage, this.filterForm.value).then(
      res=>{
        console.log(res);
        this.total = res.total; this.p = page; this.loadingFilter = false;
        this.me = res.me;
        this.receptions=res.receptions;
      },
      err=>console.log('ListeReceptionComponent:AllReceptions',err)
    );
  }

  openBon(BonID,CmdRecID){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={BonID};
        this.matDialog.open(CmdAffBonComponent, dialogConfig)
        .afterClosed().subscribe( res=> {
          if(res=='delete'){
              //this.receptions= this.receptions.filter(d => d.BonID !== BonID);
              //this.reception.BonID=null;
              for(let i=0; i<this.receptions.length ; i++){
                 if(this.receptions[i].CmdRecID==CmdRecID){
                  this.receptions[i].BonID=null;
                 }
              }
          }
        });
  }


  // New Filter && Pagination ---------------------------------
  filter() {
    this.getReceptions(1);
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
      isModified:true,
      isPropre:false
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



  // ==================================> Filter 
  /*
  filter(){
    console.log(this.filterForm.value);
    this.cmdService.filterReception(this.filterForm.value).then(
      res=>{  this.receptions=res; }
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
    isModified:true,
    isPropre:false
   });
   this.formDate.reset();
   this.formDate.patchValue({minformdate:this.firstDay});
   this.filter();
 }


 FilterValuesChanges(){
 
   this.filterForm.controls.searchFilterText.valueChanges
   .pipe(debounceTime(500),distinctUntilChanged())
   .subscribe( value => this.auto() )

   this.filterForm.controls.isModified.valueChanges
   .pipe(debounceTime(10),distinctUntilChanged())
   .subscribe( value => this.auto() )
   
   this.filterForm.controls.isPropre.valueChanges
   .pipe(debounceTime(10),distinctUntilChanged())
   .subscribe( value => this.auto() )

   }
   */
 // ###################################



}
