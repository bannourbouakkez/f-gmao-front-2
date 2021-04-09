import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FactureService } from '../../services/facture.service';

import { debounceTime , distinctUntilChanged  } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/@pages/components/message/message.service';


@Component({
  selector: 'app-cmd-liste-facture',
  templateUrl: './cmd-liste-facture.component.html',
  styleUrls: ['./cmd-liste-facture.component.scss']
})
export class CmdListeFactureComponent implements OnInit {
 //---------- breadcrumb ---------
autres=[ 
  {url:'gmao/achat/cmd/receptions/liste',title:'Liste bons'},
  {url:'gmao/achat/facture/all/1',title:'Liste factures Supprimées'}
 ];
 autres2=[ 
  {url:'gmao/achat/cmd/receptions/liste',title:'Liste bons'},
  {url:'gmao/achat/facture/all/0',title:'Liste factures'}
 ];
 breadcrumb=[
  {url:'gmao',title:'home'},
  {url:'gmao/achat',title:'achat'} ,
  {url:'gmao/achat/facture',title:'facture'},
  {url:'',title:'Liste factures'}
];
breadcrumb2=[
  {url:'gmao',title:'home'},
  {url:'gmao/achat',title:'achat'} ,
  {url:'gmao/achat/facture',title:'facture'},
  {url:'',title:'Liste factures Supprimées'}
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
      TTCmin:new FormControl(),
      TTCmax:new FormControl(),
      auto:new FormControl(true)
  });
  //###################################
  me:any;


  factures=<any>[];

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
    TTCmin:new FormControl(),
    TTCmax:new FormControl(),
    auto:new FormControl(true)
  });
  // ######
  p: number = 1;
  */

  constructor(private factureService:FactureService,private _currentRoute: ActivatedRoute,private _notification: MessageService) { }

  ngOnInit() {
    let corbeille = +this._currentRoute.snapshot.paramMap.get('corbeille');
    this.corbeille=corbeille;
    this.getListeFactures(1,corbeille);
    this.FilterValuesChanges();
  }
  
  getListeFactures(page: number,corbeille){
    this.loadingFilter = true;
    this.factureService.filterFactures(page, this.itemsPerPage, this.filterForm.value,corbeille).then(
      res=>{
        //this.factures=res;
        this.total = res.total; this.p = page; this.loadingFilter = false;
        this.me = res.me;
        this.factures=res.factures;
      },
      err=>console.log('CmdListeFactureComponent:getListeFactures:',err)
    );
  }
  

   // New Filter && Pagination ---------------------------------
   filter() {
    this.getListeFactures(1,this.corbeille);
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
      TTCmin:'',
      TTCmax:''
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
    this.factureService.filterFactures(this.filterForm.value,1).then(
      res=>{  this.factures=res; }
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
    TTCmin:'',
    TTCmax:''
   });
   this.formDate.reset();
   this.formDate.patchValue({minformdate:this.firstDay});
   this.filter();
 }


 FilterValuesChanges(){

   this.filterForm.controls.searchFilterText.valueChanges
   .pipe(debounceTime(500),distinctUntilChanged())
   .subscribe( value => this.auto() )

   this.filterForm.controls.TTCmin.valueChanges
   .pipe(debounceTime(500),distinctUntilChanged())
   .subscribe( value => this.auto() )

   this.filterForm.controls.TTCmax.valueChanges
   .pipe(debounceTime(500),distinctUntilChanged())
   .subscribe( value => this.auto() )

   }
  */
 // ###################################



}
