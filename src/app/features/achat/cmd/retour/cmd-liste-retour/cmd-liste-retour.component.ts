import { Component, OnInit } from '@angular/core';
import { RetourService } from '../../services/retour.service';

import { debounceTime , distinctUntilChanged  } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/@pages/components/message/message.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CmdAffRetourComponent } from '../cmd-aff-retour/cmd-aff-retour.component';

@Component({
  selector: 'app-cmd-liste-retour',
  templateUrl: './cmd-liste-retour.component.html',
  styleUrls: ['./cmd-liste-retour.component.scss']
})
export class CmdListeRetourComponent implements OnInit {
   //---------- breadcrumb ---------
   autres=[ 
    {url:'gmao/achat/cmd/receptions/liste',title:'Liste receptions'},
    {url:'gmao/achat/retour/retours/1',title:'Liste retours Supprimées'}
   ];
   autres2=[ 
    {url:'gmao/achat/cmd/receptions/liste',title:'Liste receptions'},
    {url:'gmao/achat/retour/retours/0',title:'Liste retours'}
   ];
   breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/achat',title:'achat'} ,
    {url:'gmao/achat/retour',title:'retour'},
    {url:'',title:'Liste retours'}
  ];
  breadcrumb2=[
    {url:'gmao',title:'home'},
    {url:'gmao/achat',title:'achat'} ,
    {url:'gmao/achat/retour',title:'retour'},
    {url:'',title:'Liste retours Supprimées'}
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
      auto:new FormControl(true)
    });
    //###################################
    me:any;

  retours=<any>[];
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
    auto:new FormControl(true)
  });
  // ######
  p: number = 1;
  */

  constructor(private retourService:RetourService,private _currentRoute: ActivatedRoute,
    private _notification: MessageService,private matDialog: MatDialog) { }

  ngOnInit() {
    let corbeille = +this._currentRoute.snapshot.paramMap.get('corbeille');
    this.corbeille=corbeille;
    this.getRetours(1,corbeille);
    this.FilterValuesChanges();
  }

  
  
  getRetours(page: number,corbeille){
    this.loadingFilter = true;
    this.retourService.filterRetours(page,this.itemsPerPage, this.filterForm.value,corbeille).then(
      res=>{
        this.total = res.total; this.p = page; this.loadingFilter = false;
        this.me = res.me;
        this.retours=res.retours;
     },
      err=>console.log(err)
    );
   }
   
   deleteRetour(RetourID:number,i){ 
    this.retourService.deleteRetour(RetourID).then(
      res=>{
        console.log(res);
        if(res){
          this.retours = this.retours.filter(d => d.RetourID !== RetourID);
          this.notification('success', "Retour est suprimée avec succées .", 1500);
        }
      },
      err=>console.log(err)
    );
  }

  openRetour(RetourID){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={RetourID};
        this.matDialog.open(CmdAffRetourComponent, dialogConfig)
        .afterClosed().subscribe( res=> {
          if(res=='delete'){
              this.retours = this.retours.filter(d => d.RetourID !== RetourID);
          }
        });
  }
    
   
  // New Filter && Pagination ---------------------------------
  filter() {
    this.getRetours(1,this.corbeille);
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
      datemax:''
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



  // New Filter && Pagination #####################################

   // ==================================> Filter 
   /*
   filter(){
     console.log(this.filterForm.value);
     this.retourService.filterRetours(this.filterForm.value,this.corbeille).then(
       res=>{ this.retours=res; }
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
     datemax:''
      });
    this.formDate.reset();
    this.formDate.patchValue({minformdate:this.firstDay});
    this.filter();
  }
 
 
  FilterValuesChanges(){
  
    this.filterForm.controls.searchFilterText.valueChanges
    .pipe(debounceTime(500),distinctUntilChanged())
    .subscribe( value => this.auto() )
    }
  */
  // ###################################

}
