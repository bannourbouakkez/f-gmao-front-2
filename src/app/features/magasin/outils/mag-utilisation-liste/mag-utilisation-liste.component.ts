import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { OutilService } from '../../services/outil.service';

import { debounceTime , distinctUntilChanged  } from 'rxjs/operators';

@Component({
  selector: 'app-mag-utilisation-liste',
  templateUrl: './mag-utilisation-liste.component.html',
  styleUrls: ['./mag-utilisation-liste.component.scss']
})
export class MagUtilisationListeComponent implements OnInit {

  
   //---------- breadcrumb ---------
   autres=[ 
    {url:'gmao/magasin/outils/addoredit',title:'Ajouter outil'},
    {url:'gmao/magasin/outils/outils/1',title:'Liste Outils Supprimées'}
    //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    ];
  autres2=[ 
      {url:'gmao/magasin/outils/addoredit',title:'Ajouter outil'},
      {url:'gmao/magasin/outils/outils/0',title:'Liste Outils'}

      //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
      ];
   breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/magasin',title:'magasin'} ,
    {url:'gmao/magasin/outillage',title:'outillage'},
    {url:'',title:'Liste Outils'}
  ];
  breadcrumb2=[
    {url:'gmao',title:'home'},
    {url:'gmao/magasin',title:'magasin'} ,
    {url:'gmao/magasin/outillage',title:'outillage'},
    {url:'',title:'Liste Outils Supprimées'}
  ];

  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  isCorbeille(corbeille){
    var isCorbeille=+corbeille;
    console.log('isCorbeille:'+isCorbeille);
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
    searchFilterText: new FormControl(),
    datemin: new FormControl(this.firstDay),
    datemax: new FormControl(),
    Opened:new FormControl(true),
    NonOpened:new FormControl(true)
  });
  //###################################

  uses=<any>[];
  me: any;
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
     Opened:new FormControl(true),
     NonOpened:new FormControl(true)
   });
   // ######
   p: number = 1;
   */

   


  constructor(private outilService:OutilService,private _currentRoute: ActivatedRoute) { }

  ngOnInit() {
    let corbeille = +this._currentRoute.snapshot.paramMap.get('corbeille');
    this.corbeille=corbeille;
    this.getUses(1,corbeille);
    this.FilterValuesChanges();
  }

  getUses(page: number,corbeille){
    /*
    this.outilService.getUses(corbeille).then(
      res=>{
        this.uses=res;
      },
      err=>console.log(err)
    );
    */
    this.loadingFilter = true;
    this.outilService.getUses(page,this.itemsPerPage,this.filterForm.value,corbeille).then(
      res=>{
        console.log(res);
        this.total = res.total; this.p = page; this.loadingFilter = false;
        this.me = res.me;
        this.uses=res.uses;
      },
      err=>console.log(err)
    );

   }
   
    
   // ==================================> Filter 
   /*
   filter(){
     console.log(this.filterForm.value);
     this.outilService.filterUses(this.filterForm.value,this.corbeille).then(
       res=>{ this.uses=res; }
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
     Opened:true,
     NonOpened:true
      });
    this.formDate.reset();
    this.formDate.patchValue({minformdate:this.firstDay});
    this.filter();
  }
 
  FilterValuesChanges(){
  
    this.filterForm.controls.searchFilterText.valueChanges
    .pipe(debounceTime(500),distinctUntilChanged())
    .subscribe( value => this.auto() )
 
    this.filterForm.controls.Opened.valueChanges
    .pipe(debounceTime(10),distinctUntilChanged())
    .subscribe( value => this.auto() )
    
    this.filterForm.controls.NonOpened.valueChanges
    .pipe(debounceTime(10),distinctUntilChanged())
    .subscribe( value => this.auto() )
  
    }
    */
  // ###################################

  // New Filter && Pagination ---------------------------------
  filter() {
    this.getUses(1,this.corbeille);
  }
  auto() {
    if (this.rechercheAuto.value == true) {
      this.filter();
    }
  }
  resetFilter() {
    this.filterForm.patchValue({
      searchFilterText: '',
      datemin: this.firstDay,
      datemax: '',
      Opened:true,
      NonOpened:new FormControl(true)
    });
    //this.nodes=[];
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



}
