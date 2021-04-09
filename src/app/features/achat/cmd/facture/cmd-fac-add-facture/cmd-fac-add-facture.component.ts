import { Component, OnInit } from '@angular/core';
import { FactureService } from '../../services/facture.service';
import { ActivatedRoute, Data } from '@angular/router';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { debounceTime , distinctUntilChanged} from 'rxjs/operators';
import { AppercuImpressionFactureComponent } from '../appercu-impression-facture/appercu-impression-facture.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { CmdAffBonComponent } from '../../cmd-aff-bon/cmd-aff-bon.component';
@Component({
  selector: 'app-cmd-fac-add-facture',
  templateUrl: './cmd-fac-add-facture.component.html',
  styleUrls: ['./cmd-fac-add-facture.component.scss']
})
export class CmdFacAddFactureComponent implements OnInit {
   
 
   autres=[ 
    {url:'gmao/achat/cmd/receptions/liste',title:'Liste bons'},
    {url:'gmao/achat/facture/all/0',title:'Liste factures'}
   ];

   breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/achat',title:'achat'} ,
    {url:'gmao/achat/facture',title:'facture'},
    {url:'',title:'Ajouter facture'}
  ];
  

  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}

  /*
  isCorbeille(corbeille){
    var isCorbeille=+corbeille;
    //console.log('isCorbeille:'+isCorbeille);
    if(isCorbeille==1){return 'Supprimées';}
    else{ return '';}
  }
  */
 LoadingReactBtn1=false;
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
      datemin:new FormControl(),
      datemax:new FormControl(),
      auto:new FormControl(true)
    });
    //###################################


  // ---------------------- Check Box ---------------------
  isAllDisplayDataChecked = false;
  isOperating = false;
  isIndeterminate = false;
  listOfDisplayData: Data[] = [];
  //listOfAllData: Data[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;
  
  currentPageDataChange($event: Data[]): void {
    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData
      .filter(item => !item.disabled)
      .every(item => this.mapOfCheckedId[item.BonID]);
    this.isIndeterminate =
      this.listOfDisplayData.filter(item => !item.disabled).some(item => this.mapOfCheckedId[item.BonID]) &&
      !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.bons.filter(item => this.mapOfCheckedId[item.BonID]).length;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.filter(item => !item.disabled).forEach(item => (this.mapOfCheckedId[item.BonID] = value));
    this.refreshStatus();
  }

  operateData(): void {
    this.isOperating = true;
    setTimeout(() => {
      this.bons.forEach(item => (this.mapOfCheckedId[item.BonID] = false));
      this.refreshStatus();
      this.isOperating = false;
    }, 1000);
  }


    //########################################################
    me:any;
    FournisseurID:number=0;
    BonsIds=<any>[];
  
  fournisseurs=<any>[];
  fournisseur_id:number;
  bons=<any>[];
  form:FormGroup;
  
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

  constructor(private factureService:FactureService, private _currentRoute: ActivatedRoute,public dialog: MatDialog
    ) { }

  ngOnInit() {
    this.formInit();
    let FournisseurID = +this._currentRoute.snapshot.paramMap.get('id');
    if(FournisseurID>0){ // nthabbit yatla3ch null zeda normalement 
      this.FournisseurID=FournisseurID;
      this.getFournisseursHasNonFacturedBons(FournisseurID);
      this.fournisseur_id=FournisseurID;

    }else{
      this.getFournisseursHasNonFacturedBons();
    }
    this.FilterValuesChanges();
  }


  formInit(){
    this.form=new FormGroup({
      fournisseur:new FormControl()
    });
  }

  getFournisseursHasNonFacturedBons(FournisseurID?){
    this.factureService.getFournisseursHasNonFacturedBons().then(
      res=>{
        this.fournisseurs=res;
        if(FournisseurID>0){
           this.form.controls['fournisseur'].setValue(FournisseurID);
           this.bons=this.getFournisseurBons(1,FournisseurID);
        }
      },
      err=>console.log('CmdFacAddFactureComponent:',err)
    )
  }

  getFournisseurBons(page: number,FournisseurID:number){
    // nthabbit esque FournisseurID ma7tout walla ? 
    if(FournisseurID>0){
    this.loadingFilter = true;
    this.factureService.getFournisseurBons(page, this.itemsPerPage, this.filterForm.value,FournisseurID).then(
      res=>{
        
        console.log(res); 
        this.total = res.total; this.p = page; this.loadingFilter = false;
        this.me = res.me;
        this.bons=res.bons;
        for (let i = 0; i < this.bons.length; i++) {  
          this.bons[i]['formControl'] = new FormControl(false);
        }
      },
      err=>console.log('CmdFacAddFactureComponent:getFournisseurBons:',err)
    );
  }
  }

  selectFournisseur(e){ 
    this.mapOfCheckedId={};
    this.fournisseur_id=e; if(e>0){
    this.FournisseurID=e;
    this.getFournisseurBons(1,e);
    } 
    if(e==0){this.bons=[];}

  }


Facturer(bonsidsaimp:NgForm){
    
//this.BonsIds=[];
let BonsIds=[];

var values=[];
var keys = Object.keys(this.mapOfCheckedId); // ['key1', 'key2']
//keys.forEach( function(key) {  values = this.mapOfCheckedId[key]; });
for (var i = 0;  i<keys.length; i++ ) {
  if(this.mapOfCheckedId[keys[i]]){
    BonsIds.push(keys[i]);
  }
}
//console.log(BonsIds);

this.eliminerCocheVersionDeux(BonsIds);
this.mapOfCheckedId={};


    if(BonsIds.length>0){ // ma3néha kén famma ds bons coché
      if(!this.LoadingReactBtn1){
      this.LoadingReactBtn1=true;

    this.factureService.Facturer(BonsIds,this.fournisseur_id).then(
      res=>{
      this.LoadingReactBtn1=false;
     // this.eliminerCoche(this.bons);
      this.eliminerCocheVersionDeux(BonsIds);
     
      console.log(res);
      this.openDialog(res);
      },
      err=>console.log('CmdFacAddFactureComponent:Facturer:',err)
    );
    }
    }


  }

 IDsSelected(){
  var values=[];
  var keys = Object.keys(this.mapOfCheckedId); // ['key1', 'key2']
  //keys.forEach( function(key) {  values = this.mapOfCheckedId[key]; });
  for (var i = 0;  i<keys.length; i++ ) {
    if(this.mapOfCheckedId[keys[i]]){
      values.push(keys[i]);
    }
  }
  return values;
 }

 Decocher(ID:number){
  //console.log(this.mapOfCheckedId[ID]);
  this.mapOfCheckedId[ID]=false;
 }

  openDialog(res){
    const dialogRef = this.dialog.open(AppercuImpressionFactureComponent, {
      width: '90%',
      data: {data:res,source:'CmdFacAddFactureComponent'}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('ipression done ');
    });
  }

  eliminerCocheVersionDeux(IDs){
    //this.bons= this.bons.filter(d => d.BonID == BonID);
    console.log(IDs);
    //this.bons= this.bons.filter(d => IDs.includes(d.BonID));
    //this.bons= this.bons.filter(d => IDs.find(x => x != d.BonID));


    /*
    for(let i=0; i<this.bons.length; i++ ){
     //console.log(this.bons[i].BonID + ' => '+ IDs.find(x => x == this.bons[i].BonID));

     
     if( IDs.find(x => x == this.bons[i].BonID)){
       console.log(this.bons[i].BonID);
       this.bons.splice(i,1);
       //this.bons=this.bons.filter(d => d.BonID != this.bons[i].BonID);

     }
     

    }
    */
   
   //for (var i = IDs.length -1; i >= 0; i--) this.bons.splice(IDs[i],1);
   //while(IDs.length) { this.bons.splice(IDs.pop(), 1);}
   var i;
   i = this.bons.length;
   while (i--) {
       if (IDs.find(x => x == this.bons[i].BonID)) {
        this.bons.splice(i, 1);
       }
   }
    
  }

  eliminerCoche(fs){
    var i;
    i = fs.length;
    while (i--) {
        if (fs[i].formControl.value == true) {
            fs.splice(i, 1);
        }
    }
   return fs;
   }



   openBon(BonID){
    const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass="custom-dialog-container";
        dialogConfig.autoFocus = true;
        dialogConfig.width = "80%";
        dialogConfig.data={BonID};
        this.dialog.open(CmdAffBonComponent, dialogConfig)
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
   // New Filter && Pagination ---------------------------------
  filter() {
    this.getFournisseurBons(1,this.FournisseurID);
  }
  auto() {
    if (this.rechercheAuto.value == true) {
      this.filter();
    }
  }
  resetFilter() {
    this.filterForm.patchValue({
      searchFilterText:'',
      datemin:'',//this.firstDay,
      datemax:''
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
    this.factureService.addFacFilter(this.filterForm.value,this.fournisseur_id).then(
      res=>{ 
         this.bons=res;
         for (let i = 0; i < this.bons.length; i++) {  
          this.bons[i]['formControl'] = new FormControl(false);
         }
       }
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
