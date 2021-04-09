import { Component, OnInit , Inject, ElementRef, ViewChild  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DaService } from '../services/da.service';
import { AuthService } from 'src/app/shared/auth.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { debounceTime , distinctUntilChanged  , map} from 'rxjs/operators';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatInput, MatDatepicker } from '@angular/material';
import { MessageService } from 'src/app/@pages/components/message/message.service';
import moment from 'moment';

@Component({
  selector: 'app-gerer-das',
  templateUrl: './gerer-das.component.html',
  styleUrls: ['./gerer-das.component.scss']
})
export class GererDasComponent implements OnInit  {
  
  ///gmao/achat/da/add

  //---------- breadcrumb ---------
  autres=[ 
    {url:'gmao/achat/da/add',title:'Ajouter DA'}
    //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    ];
   breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/achat',title:'achat'} ,
    {url:'gmao/achat/da',title:'DA'},
    {url:'',title:'Liste DAs'}
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
    delaimin:new FormControl(),
    periodedelaimin:new FormControl('jour'),
    delaimax:new FormControl(),
    periodedelaimax:new FormControl('jour'),
    auto:new FormControl(true),
    statusencours:new FormControl(true),
    statusreporte:new FormControl(false),
    statusconfirme:new FormControl(false),
    statusrejete:new FormControl(false),
    all:new FormControl(false) 
  });
  //###################################
  me:any;

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    console.log(id);
    if (checked) {
      this.expandSet.add(id);
      
    } else {
      this.expandSet.delete(id);
    }
  }

   date = new Date();
  /*
  firstDay = new Date(this.date.getFullYear(), this.date.getMonth()-1, 1);
  formDate:FormGroup=new FormGroup({
    minformdate:new FormControl(this.firstDay),
    maxformdate:new FormControl()
  });
  */
  das=<any>[];
  CanClickBtn=true;
  daClicked:number;
  
  ResponsableAchat:boolean=false;
  Admin:boolean=false;

  message:string='';
  delaidereportation:number=0;
  //========>tir variables
   sortedByReference=true;
   sortedByDemandeur=true;
   sortedByDelai=true;
   sortedByDateDeCreation=true;
  //######################
  //p: number = 1;

 //filter input text ma ghir form // https://stackoverflow.com/questions/54757071/how-to-fix-debouncetime-distinctuntilchanged-rxjs-error-in-angular-5-using
  /*
  filterForm:FormGroup=new FormGroup({
    searchFilterText:new FormControl(),
    datemin:new FormControl(this.firstDay),
    datemax:new FormControl(),
    delaimin:new FormControl(),
    periodedelaimin:new FormControl('jour'),
    delaimax:new FormControl(),
    periodedelaimax:new FormControl('jour'),
    auto:new FormControl(true),
    statusencours:new FormControl(true),
    statusreporte:new FormControl(false),
    statusconfirme:new FormControl(false),
    statusrejete:new FormControl(false),
    all:new FormControl(false)

  });
  */


  constructor(private _currentRoute: ActivatedRoute,private _daService:DaService,private _authService:AuthService,
              public dialog: MatDialog,public router:Router) { }
 
  ngOnInit() {

    //this.checkDasReportees();

    this.ResponsableAchat=this.isPoste('ResponsableAchat');
    this.Admin=this.isPoste('Admin');

    let statut = this._currentRoute.snapshot.paramMap.get('statut');
    let isStatut=false;
    if(statut==null || statut=="encours" || statut=="enattente" || statut=="rejete" || statut=="confirme" || statut=="repote" || statut=="renvoye" ){isStatut=true;}
    if(isStatut){
      /*
      this._daService.getDas(statut).subscribe(
        res=>{ console.log(res); this.das=res;},
        err=>console.log('GererDasComponent:ngOnInit:'+err)
      );
      */
     this.getDas(1,statut);
     //this.FilterValuesChanges();


    }else{
      console.log('ma3ach tmes lien el foo9 ');
    }

    this.FilterValuesChanges();

  }

  
getDas(page: number,statut) {
console.log(this.filterForm.value);

let interdas=new Array(); // SPAAP
interdas=this.das; // SPAAP
this.das=interdas; // SPAAP
this.p=1; // SPAAP

    this.loadingFilter = true;
    this._daService.getDas(page, this.itemsPerPage, this.filterForm.value , statut ).then(
      res => {  
        console.log(res);                                                    // SBN 
        this.total = res.total; this.p = page; this.loadingFilter = false;
        this.me = res.me;
        this.das=res.das;
        console.log(this.me);

      }
    );
  }

  

  open(DaID){
    this.das.forEach(e=>{
        if(e.da.id!=DaID){e.da.open=0;}
        if(e.da.id==DaID){
          if(e.da.open==1)e.da.open=0;
          else e.da.open=1;
        }
    });
   
    //console.log('DaID : '+DaID); console.log(this.das);

  }



  openStatus(DaID){
    this.das.forEach(e=>{
        if(e.da.id!=DaID){e.da.openStatus=0; }
        if(e.da.id==DaID){
          if(e.da.openStatus==1)e.da.openStatus=0;
          else e.da.openStatus=1;
        }
    });
    //console.log('DaID : '+DaID); console.log(this.das);
  }


  isPoste(ExpectedPoste:string){ 
    console.log('ExpectedPoste : '+ExpectedPoste+ ' , result => '+this._authService.isPoste(ExpectedPoste))
    return this._authService.isPoste(ExpectedPoste); 
  }

  action(index:number,action:string,DaID:number){
    
  if(action=='rejeter'){ this.actionRejeterOpenDialog(index,action,DaID);}
  else if( action=='reporter' || action=='rereporter' ){ this.actionReporterOpenDialog(index,action,DaID); }
  else {
    let message=""; let delaidereportation=0;
    let interdas= new Array(); // SPAAP
    interdas=this.das; // SPAAP
    if(this.CanClickBtn){
    this.daClicked=DaID;  this.CanClickBtn=false;
    this._daService.action(action,DaID,message,delaidereportation).then(res=>{
      interdas[index]=res; // SPAAP
      this.das=interdas; // SPAAP

      //====> // SPAAP solution lel probleme changement apres l'action ba3d el pgination 
      let interp=1;
      if(this.p!=1){
        interp=this.p;
        this.filter();
        this.p=interp;
        }
      //#####
      this.daClicked=0;  
      this.CanClickBtn=true;     
    });
  }
  
  }

  }

  
  HistoriquePasse(statut:string){
    if(statut=='encours'){return 'Crée';}
    if(statut=='reenvoye'){return 'Modifié et envoye de nouveau';}
    if(statut=='confirme'){return 'Confirmé ';}
    if(statut=='confirmeCommande'){return 'Confirmé ';}
    if(statut=='confirmeFerme'){return 'Confirmé ';}
    if(statut=='confirmeParAdmin'){return 'Confirmé ';}
    if(statut=='confirmeParAdminCommande'){return 'Confirmé ';}
    if(statut=='confirmeParAdminFerme'){return 'Confirmé ';}
    if(statut=='rejete'){return 'Rejeté ';}
    if(statut=='rejeteParAdmin'){return 'Rejeté ';}
    if(statut=='reporte'){return 'Reporté ';}
    if(statut=='reporteParAdmin'){return 'Reporté ';}
    if(statut=='reencours'){return 'Mise en cours de nouveau ';}
    if(statut=='reenattenteParAdmin'){return 'Mise en cours de nouveau ';}
    if(statut=='enattente'){return 'Transféré au administrateur ';}
  }

  conversionStatut(statut:string){
    if(statut=='encours'){return 'En Cours';}
    if(statut=='reenvoye'){return 'En Cours';}
    if(statut=='confirme'){return 'Confirmé';}
    if(statut=='confirmeParAdmin'){return 'Confirmé';}
    if(statut=='rejete'){return 'Rejeté';}
    if(statut=='rejeteParAdmin'){return 'Rejeté';}
    if(statut=='reporte'){return 'Reporté';}
    if(statut=='reporteParAdmin'){return 'Reporté';}
    if(statut=='reencours'){return 'En Cours';}
    if(statut=='reenattenteParAdmin'){return 'En cours';}
    if(statut=='enattente'){return 'En Cours';}

    if(statut=='confirmeCommande'){return 'Confirmé';}
    if(statut=='confirmeFerme'){return 'Confirmé';}
    if(statut=='confirmeParAdmin'){return 'Confirmé';}
    if(statut=='confirmeParAdminCommande'){return 'Confirmé';}
    
  }

  actionRejeterOpenDialog(index:number,action:string,DaID:number): void {
    if(this.CanClickBtn){
    this.daClicked=DaID;  this.CanClickBtn=false;

    var delaidereportation=0;
    const dialogRef = this.dialog.open(RejeterEntry, {width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
    
      //let message=""; message=result;

    let interdas= new Array(); // SPAAP
    interdas=this.das; // SPAAP 
    
      //if(message !='AnnulerLaRejetXXX'){
      if(result && result.envoyer){

       
        

        let message=result.message;

      this._daService.action(action,DaID,message,delaidereportation).then(res=>{
        interdas[index]=res; // SPAAP
        this.das=interdas; // SPAAP

      //====> // SPAAP solution lel probleme changement apres l'action ba3d el pgination  
      let interp=1;
      if(this.p!=1){
        interp=this.p;
        this.filter();
        this.p=interp;
        }
        //#####
        this.daClicked=0;
        this.CanClickBtn=true;
      });
    
    
  }else{
    this.daClicked=0;
    this.CanClickBtn=true;
  }

    });
  }
  }
  
  actionReporterOpenDialog(index:number,action:string,DaID:number): void {
    if(this.CanClickBtn){
      this.daClicked=DaID;  this.CanClickBtn=false;

    // lenna béch nediyou calucer Delai avec DaID , index 
    let reste = this.calculerResteDelai(index,DaID);
    var message="";
    let interdas= new Array();// SPAAP
    interdas=this.das;// SPAAP
    const dialogRef = this.dialog.open(ReporterEntry, {width: '300px'  , data: {reste:reste}  });
    dialogRef.afterClosed().subscribe(result => {
    
    var delaidereportation=result;
    if(delaidereportation>0){
      
     

      this._daService.action(action,DaID,message,delaidereportation).then(res=>{
      interdas[index]=res;// SPAAP
      this.das=interdas; // SPAAP
      //====> // SPAAP solution lel probleme changement apres l'action ba3d el pgination 
      let interp=1;
      if(this.p!=1){
        interp=this.p;
        this.filter();
        this.p=interp;
        }
      //#####
      this.daClicked=0;
      this.CanClickBtn=true;
    }) ;
  
  
}else{
  this.daClicked=0;
  this.CanClickBtn=true;
}

    });
  }
  }
  


  checkDasReportees(){
    this._daService.checkDasReportees().then(res=>console.log(res));
  }


  calculerResteDelai(index,DaID){
    let delai=this.das[index].da.delai;
    let dateDeCreation =new Date(this.das[index].da.created_at); 
    let today=new Date();

    dateDeCreation.setHours(0); dateDeCreation.setMinutes(5); dateDeCreation.setSeconds(0); dateDeCreation.setMilliseconds(0); 
    today.setHours(0); today.setMinutes(5); today.setSeconds(0); today.setMilliseconds(0); 
    let diff= ((today.getTime() - dateDeCreation.getTime())/100000)/864;
    let reste = delai - diff ;
    return reste;

  }


// ===============================> Filter functions 
/*
FilterValuesChanges(){
  
this.filterForm.controls.searchFilterText.valueChanges
.pipe(debounceTime(500),distinctUntilChanged())
.subscribe( value => this.auto() )

this.filterForm.controls.delaimin.valueChanges
.pipe(debounceTime(500),distinctUntilChanged())
.subscribe( value => this.auto() )

this.filterForm.controls.delaimax.valueChanges
.pipe(debounceTime(500),distinctUntilChanged())
.subscribe( value => this.auto() )

this.filterForm.controls.periodedelaimin.valueChanges
.pipe(debounceTime(10),distinctUntilChanged())
.subscribe( value => {
   this.auto();
} )

this.filterForm.controls.periodedelaimax.valueChanges
.pipe(debounceTime(10),distinctUntilChanged())
.subscribe( value => this.auto() )


this.filterForm.controls.statusencours.valueChanges
.pipe(debounceTime(10),distinctUntilChanged())
.subscribe( value => this.auto() )

this.filterForm.controls.statusreporte.valueChanges
.pipe(debounceTime(10),distinctUntilChanged())
.subscribe( value => this.auto() )


this.filterForm.controls.statusconfirme.valueChanges
.pipe(debounceTime(10),distinctUntilChanged())
.subscribe( value => this.auto() )


this.filterForm.controls.statusrejete.valueChanges
.pipe(debounceTime(10),distinctUntilChanged())
.subscribe( value => this.auto() )

this.filterForm.controls.all.valueChanges
.pipe(debounceTime(10),distinctUntilChanged())
.subscribe( value => this.auto() )

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


filter(){
let interdas=new Array(); // SPAAP
interdas=this.das; // SPAAP
this.das=interdas; // SPAAP
this.p=1; // SPAAP

 console.log(this.filterForm.value);
 this._daService.filter(this.filterForm.value).then(
   res=>{
     this.das=res;
     console.log(res);
    }
   
   );
}

resetFilter(){
  this.filterForm.patchValue({
   searchFilterText:'',
   datemin:this.firstDay,
   datemax:'',
   delaimin:'',
   delaimax:'',
   statusencours:true,
   statusreporte:false,
   statusconfirme:false,
   statusrejete:false,
   all:false
  });
  
  this.formDate.reset();
  this.formDate.patchValue({minformdate:this.firstDay});

  this.filter();
}

auto(){
  if(this.filterForm.controls['auto'].value==true){
    console.log(this.filterForm.value);
    this.filter();
  
  }
}
*/


 // New Filter && Pagination ---------------------------------
 filter() {
  this.getDas(1,null); //"encours" 
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
    delaimin:'',
    periodedelaimin:'jour',
    delaimax:'',
    periodedelaimax:'jour',
    auto:'',
    statusencours:true,
    statusreporte:false,
    statusconfirme:false,
    statusrejete:false,
    all:false
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



CalculerDelai(delai,periode){
  var unite=1;
  if(periode=="jour"){unite=1;}  if(periode=="semaine"){unite=7;} if(periode=="mois"){unite=30;}if(periode=="annee"){unite=365;}
  let delaiFinale= Number( Number(delai) * unite);
  return delaiFinale;
}

//####################################################

//===========================================> sort function 
triParReference(){
if(this.sortedByReference==true){
this.das.sort((a,b) => a.da.ref.localeCompare(b.da.ref));
this.sortedByReference=false;
}else{
  this.das.sort((a,b) => b.da.ref.localeCompare(a.da.ref));
  this.sortedByReference=true;
}
}

triParDemandeur(){
  if(this.sortedByDemandeur==true){
  this.das.sort((a,b) => a.da.user.localeCompare(b.da.user));
  this.sortedByDemandeur=false;
  }else{
    this.das.sort((a,b) => b.da.user.localeCompare(a.da.user));
    this.sortedByDemandeur=true;
  }
  }

  triParDelai(){
    if(this.sortedByDelai==true){
      this.das.sort((a,b)=> Number(a.da.restededelai) - Number(b.da.restededelai) );
     // this.das.sort((a,b) => a['ResteDeDelai'].localeCompare(b['ResteDeDelai']));
      //this.das.sort((c,d) => c.da.restededelai.toInteger().localeCompare(d.da.restededelai.toInteger()) );
      this.sortedByDelai=false;
    }else{
      this.das.sort((a,b)=> Number(b.da.restededelai) - Number(a .da.restededelai) );
      //this.das.sort((a,b) => b['ResteDeDelai'].localeCompare(a['ResteDeDelai']));
      //this.das.sort((c,d) => d.da.restededelai.toInteger().localeCompare(c.da.restededelai.toInteger()));
      this.sortedByDelai=true;
    }
    }

    triParDateDeCreation(){
      if(this.sortedByDateDeCreation==true){
      this.das.sort((a,b) => a.da.created_at.localeCompare(b.da.created_at));
      this.sortedByDateDeCreation=false;
      }else{
        this.das.sort((a,b) => b.da.created_at.localeCompare(a.da.created_at));
        this.sortedByDateDeCreation=true;
      }
      }

//############################################

//===============================> Pagination 

paginationClicked(){
  // SPAAP
  //probleme non resolu 
  // ki ta3mil next changement ba3d l'action ma3ach tothhir 
  // thahari lazim pagination nasna3ha wa7di pluto nejbedha mel internet
  // wa ella kol action yejbed array men jdid 
  /*
  console.log('clicked');
  let interdas=new Array();
  interdas=this.das;
  this.das=new Array();
  this.das=interdas;
  */
}

//###########################################



afficherDa(DaID){
 this.router.navigate(['achat/da/da/',DaID]);
}


}




@Component({
  selector: 'dialog-overview-example-dialog',
  template: ` 
  <!--<button (click)="close()" >Close</button>-->
  <!--
  Cause de refus : <br>
  <form (ngSubmit)="onSubmit(msg.value)" >
  <input #msg ><br>
  <button type="submit" > Submit </button> 
  </form>
  <button (click)="annuler()" >Annuler La Rejet</button>
  -->



  <div id="card-body-popup" class="card-body"  style="margin:0px;padding:0px;" >
       
    <div id="card-header-popup" class="card-header separator">
    <ol id="breadcrumb-popup" class="breadcrumb" >
        <li  class="breadcrumb-item active"><span class='breadcrumb-title'>Cause de refus</span></li>
     </ol>
    </div>
        
            
            <form (ngSubmit)="onSubmit(msg.value)" class="form-horizontal" role="form" autocomplete="off">


                <div class="form-group row">
                  <label for="name" class=" col-md-4 control-label">Message</label>
                  <div class="col-md-8">
  
  
                   
                      <!--<input  class='form-control input-sm'  maxlength="50" #msg>-->

                      <textarea  #msg class="form-control" rows="2" placeholder="" style="font-size: 14px;"></textarea>

  
  
                  </div>
                </div>
                <div class="row">
  
                  <div class="col-md-6">
  
                  </div>
                  <div class="col-md-3">
                     
                    <button style="display:block;width:100%;" (click)="annuler()" id="button-popup"  aria-label="" class="btn btn-lg btn-larger "
                       type="button">Annuler</button>

                  </div>
                  <div class="col-md-3">
                     
                    <button style="display:block; width:100%;" id="button-popup"  aria-label="" class="btn  btn-lg btn-larger"
                       type="submit">Envoyer</button>

                  </div>
                </div>
              </form>
        </div>


  `
})
export class RejeterEntry {

  constructor(
    public dialogRef: MatDialogRef<RejeterEntry>,
    @Inject(MAT_DIALOG_DATA) public data) {}
  
  obj:any={};
 
  onSubmit(message): void {
    this.obj.envoyer=true;
    this.obj.message=message;
    this.dialogRef.close(this.obj); 
  }
  //close(){this.dialogRef.close('');}
  annuler(){
    this.obj.envoyer=false;
    this.obj.message=""; //message;
    //this.dialogRef.close('AnnulerLaRejetXXX');
    this.dialogRef.close(this.obj);
  }


}


@Component({
  selector: 'dialog-overview-example-dialog',
  template: ` 


  
  
  <div id="card-body-popup" class="card-body" style="margin:0px;padding:0px;" >
       
  <div id="card-header-popup" class="card-header separator">
              <p class="no-margin" style="color:purple">
                  Reporter
              </p>
  </div>


  <div style="width:95%;">
  
  <div class='row'  >
  <div class='col-md-10' >
  <form [formGroup]="dateForm" class="form-horizontal" role="form" autocomplete="off" style="visibility:hidden;">
    <div class="input-group date col-md-12"
    style="padding:0px; margin:0px;">
    <input class='form-control input-sm' nz-input 
    formControlName="date" [(ngModel)]="dateForm.get('date').value"
    [owlDateTimeTrigger]="dt3" [owlDateTime]="dt3" #date ngModel readonly>
    <owl-date-time [pickerType]="'calendar'" #dt3></owl-date-time>
    </div>
  </form>
  </div>
  <div class='col-md-2'>
  <ul class="list-inline m-0"  style="float:right;">
  <li [owlDateTimeTrigger]="dt3"
   class="list-inline-item" style="padding:0px;margin:0px;margin-left:2px;">
     <button  style="margin-top:7px; margin-left:2px;"
     class="btn btn-default btn-xs rounded-0" type="button" data-toggle="tooltip"
       data-placement="top" title="afficher"> <i class="pg-icon md-18"
         style="width:10px;height:10px;position:relative;top:1px;">calendar</i></button>
   </li>
  </ul>
  </div>
  </div>



  <div class="form-group row">
  <!--<label for="fname" class="col-md-3 control-label">Delai</label>-->
  <div class="col-md-12">



  <form [formGroup]="DelaiPeriodeForm" (ngSubmit)="onSubmit(delai.value,periode.value)"  >

  <div class="row">
    <div class="col-md-4">
       <nz-input-number #delai [nzMin]="0" [nzStep]="1" formControlName="delai" [(ngModel)]="DelaiPeriodeForm.get('delai').value"></nz-input-number>
      <br> 
      <span class="help">Delai</span>
       </div>

    <div class="offset-1 col-md-7">
 
  <nz-select #periode [(ngModel)]="DelaiPeriodeForm.get('periode').value" formControlName="periode"
                                                                            
                                                                            nzPlaceHolder="Select periode">
                                                                            <nz-option nzValue="jour" nzLabel="Jour" selected>
                                                                            </nz-option>
                                                                            <nz-option nzValue="semaine"
                                                                                nzLabel="Semaine"></nz-option>
                                                                            <nz-option nzValue="mois" nzLabel="Mois">
                                                                            </nz-option>
                                                                            <nz-option nzValue="annee" nzLabel="Année">
                                                                            </nz-option>
                                                                        </nz-select>
      <br> 
      <span class="help">Periode</span>
  </div>
  </div>
  


  
  <div class="row">
   <div class="col-md-6">
  </div>
  <div class="col-md-6">
    <button  aria-label="" class="btn btn-success btn-lg btn-larger pull-right"
      [ngClass]="true ? 'class': 'disabled'" type="submit" >Envoyer
      <i style='margin-left:10px;' *ngIf="LoadingReactBtn1" nz-icon nzType="loading" class="loading-icon"></i>
    </button>

  </div>

</div>


  </form>

    
  </div>
  </div>

  </div>

</div>


<!--{{data.reste}}-->

  `
})
export class ReporterEntry {
  @ViewChild('delai',{static:true}) delaiElement: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<ReporterEntry>,
    @Inject(MAT_DIALOG_DATA) public data , private _notification: MessageService) {}
  //selectedValue="jour";
  date=new FormControl('');

  delaii:number=0;
  today=new Date();

  dateForm: FormGroup = new FormGroup({
    date:new FormControl()
  });

  DelaiPeriodeForm: FormGroup = new FormGroup({
    delai:new FormControl(),
    periode:new FormControl('jour')
  });

  ngOnInit(){
   this.FilterValuesChanges();
  }

  FilterValuesChanges() {
    this.dateForm.valueChanges
      .pipe(debounceTime(100), distinctUntilChanged())
      .subscribe(value => this.pickDateForReportationDeux())
  }
  
  onSubmit(delai,periode): void {
    //console.log(delai+','+periode);
    if(delai && periode){
     
    var unite=1;
    if(periode=="jour"){unite=1;}  if(periode=="semaine"){unite=7;} if(periode=="mois"){unite=30;}if(periode=="annee"){unite=365;}
    let delaiFinale= Math.round(Number( Number(delai) * unite));
    this.dialogRef.close(delaiFinale);
    
    }else{
      this.notification('danger', "Formulaire pas valide .", 1500);
    }
    
  }

  pickDateForReportation(e){
    let d1 = new Date(e.value);
    d1.setHours(0); d1.setMinutes(0); d1.setSeconds(0); d1.setMilliseconds(0); 
    let today=new Date();
    today.setHours(0); today.setMinutes(5); today.setSeconds(0); today.setMilliseconds(0); 
    let diff= ((d1.getTime() - today.getTime())/100000)/864;
    //document.getElementById('delai').=diff.toString();
    this.delaii=Math.round(diff); if(this.delaii<0){this.delaii=0;}
    setTimeout(()=>{ this.delaiElement.nativeElement.focus();},10);
    //this.delaiElement.nativeElement.focus();
    //console.log(diff);
  }

  pickDateForReportationDeux(){
    //console.log(this.dateForm.controls['date'].value);
    //console.log(typeof this.dateForm.controls['date'].value);

    let d1 = new Date(moment(this.dateForm.controls['date'].value).format("YYYY-MM-DDTHH:mm:00"));
    
    //let DateControl=this.dateForm.controls['date'].value;
    //let d1 = DateControl.format('YYYY-MM-DD');
    //let d1 = new Date(DateControl);
    
    d1.setHours(0); d1.setMinutes(0); d1.setSeconds(0); d1.setMilliseconds(0); 
    let today=new Date();
    today.setHours(0); today.setMinutes(5); today.setSeconds(0); today.setMilliseconds(0); 
    let diff= ((d1.getTime() - today.getTime())/100000)/864;
    //document.getElementById('delai').=diff.toString();
    this.delaii=Math.round(diff); if(this.delaii<0){this.delaii=0;}
    if(this.delaii){
    this.DelaiPeriodeForm.patchValue({delai:this.delaii});
    }
    //setTimeout(()=>{ this.delaiElement.nativeElement.focus();},10);


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





 



}






