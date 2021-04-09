import { Component, OnInit } from '@angular/core';
import { OutilService } from '../../services/outil.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

import { debounceTime , distinctUntilChanged  } from 'rxjs/operators';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-mag-outil-liste',
  templateUrl: './mag-outil-liste.component.html',
  styleUrls: ['./mag-outil-liste.component.scss']
})
export class MagOutilListeComponent implements OnInit {


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
  corbeille:number;
  outils=<any>[];
  me: any;

  /*
  filterForm:FormGroup=new FormGroup({
     searchFilterText:new FormControl(),
     auto:new FormControl(true),
     Reserved:new FormControl(true),
     NonReserved:new FormControl(true)
  });
  */
 // Pagination && Filter Form -------
  // Pagination 
  p: number = 1; total: number; itemsPerPage = 10; loadingFilter: boolean;
  selectedItemPerPage="10";
  // Filter Form 
  rechercheAuto = new FormControl(true);
  //firstDay = new Date((new Date()).getFullYear(), (new Date()).getMonth() - 1, 2);
  filterForm: FormGroup = new FormGroup({
    searchFilterText: new FormControl(),
    Reserved:new FormControl(true),
    NonReserved:new FormControl(true)
  });
  //###################################
   

  constructor(private outilService:OutilService,private _currentRoute: ActivatedRoute
    ,private _notification: MessageService) { }

  ngOnInit() {
    let corbeille = +this._currentRoute.snapshot.paramMap.get('corbeille');
    this.corbeille=corbeille;
    this.getOutils(1,corbeille);
    this.FilterValuesChanges();
  }

  
  getOutils(page: number,corbeille){
    this.loadingFilter = true;
    this.outilService.getOutils(page,this.itemsPerPage,this.filterForm.value,corbeille).then(
      res=>{
        console.log(res);
        
        this.total = res.total; this.p = page; this.loadingFilter = false;
        this.me = res.me;
        this.outils=res.outils;
      },
      err=>console.log(err)
    );
   }


   deleteOutil(OutilID){
    this.outilService.deleteOutil(OutilID).then(
      res=>{
        console.log(res);
        if(res.success){
          this.outils = this.outils.filter(d => d.OutilID !== OutilID);
          this.notification('success', "L'outil # "+OutilID+" est supprimé.", 2000);
        }
      },
      err=>console.log(err)
    );
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
     this.outilService.filterOutils(this.filterForm.value,this.corbeille).then(
       res=>{ this.outils=res; }
       );
   }
 
  auto(){
    if(this.filterForm.controls['auto'].value==true){
      console.log(this.filterForm.value);
      this.filter();
    }
  }
 
  resetFilter(){
    this.filterForm.patchValue({
     searchFilterText:'',
     Reserved:true,
     NonReserved:true
      });
     this.filter();
  }
 
  FilterValuesChanges(){
    this.filterForm.controls.searchFilterText.valueChanges
    .pipe(debounceTime(500),distinctUntilChanged())
    .subscribe( value => this.auto() )

    this.filterForm.controls.Reserved.valueChanges
    .pipe(debounceTime(10),distinctUntilChanged())
    .subscribe( value => this.auto() )
  
    this.filterForm.controls.NonReserved.valueChanges
    .pipe(debounceTime(10),distinctUntilChanged())
    .subscribe( value => this.auto() )
  }
  */  
  // ###################################



   // New Filter && Pagination ---------------------------------
   filter() {
    this.getOutils(1,this.corbeille);
  }
  auto() {
    if (this.rechercheAuto.value == true) {
      this.filter();
    }
  }
  resetFilter() {
    this.filterForm.patchValue({
      searchFilterText: '',
      Reserved:true,
      NonReserved:true
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