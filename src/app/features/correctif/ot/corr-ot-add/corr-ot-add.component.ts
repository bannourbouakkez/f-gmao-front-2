import { Component, OnInit , AfterViewInit, OnDestroy , ViewChild  } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EquipementService } from 'src/app/features/equipement/services/equipement.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { EquiTacheAddComponent } from 'src/app/features/equipement/tache/equi-tache-add/equi-tache-add.component';

import { TreeNode } from 'angular-tree-component';
import { GlobalService } from 'src/app/shared/global.service';
import { UploadService } from 'src/app/shared/upload.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { OuiOuNonComponent } from 'src/app/shared/others/oui-ou-non/oui-ou-non.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { OtService } from '../../services/ot.service';
import { DiService } from '../../services/di.service';


import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';
import { MatSelect } from '@angular/material';
import { MessageService } from 'src/app/@pages/components/message/message.service';



@Component({
  selector: 'app-corr-ot-add',
  templateUrl: './corr-ot-add.component.html',
  styleUrls: ['./corr-ot-add.component.scss']
})
export class CorrOtAddComponent implements OnInit {

  data=false; // data héthi béch kén n7ébbou naffichyoua fi popup hawki yétna77aw zaydin 
  di:any;
  niveaux=<any>[];
 
  //---------- breadcrumb ---------
  autres=[ 
    {url:'gmao/correctif/di/dis',title:'Liste DIs'},
    {url:'gmao/correctif/ot/ots',title:'Liste OTs'},
    ];
  breadcrumb=[
    {url:'gmao',title:'home'},
    {url:'gmao/correctif',title:'correctif'} ,
    {url:'gmao/correctif/ot',title:'ot'},
    {url:'',title:'Executer OT'}
  ];
  lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
  LoadingReactBtn1=false;
  //###############################

  public selectedMoment = new Date();
  
  DiID:number=0;
  date=new Date();
  form:FormGroup;

  demandeur:any=null;
  recepteur:any=null;
  
  me:any;
  
  niveaus=<any>[];
  node:TreeNode;
  EquipementID:number=0;
  
  taches=<any>[];
  intervenants=<any>[];
  intervenantsIDs=<any>[];
  
  /*
  protected banks= <any>[];
  public bankMultiCtrl: FormControl = new FormControl();
  public bankMultiFilterCtrl: FormControl = new FormControl();
  public filteredBanksMulti: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  @ViewChild('multiSelect',{static:true}) multiSelect: MatSelect;
  protected _onDestroy = new Subject<void>();
  */

  
  constructor( private fb: FormBuilder,private equipementService:EquipementService,private matDialog: MatDialog
              ,private globalService:GlobalService,private _uploadService:UploadService,private otService:OtService
              ,private _currentRoute: ActivatedRoute,private _authService:AuthService,private _router:Router
              ,private diService:DiService
              ,private _notification: MessageService
             ){}
 
  
             consoleIIDs(){
               //console.log(this.intervenantsIDs);
               //console.log(this.form.controls.intervenants.value);
             }

  ngOnInit() {
    
    if( !this.isPosts(['Admin','Methode','ChefDePoste','ResponsableMaintenance']) ){
      this._router.navigate(['/index']);
    }
      
      this.InitForm();
      this.getIntervenants();

      let DiID = +this._currentRoute.snapshot.paramMap.get('id');

      this.DiID=DiID;

      this.form.patchValue({di_id:DiID});
      this.getDi(DiID);

      this.date=this.ReglageDate(this.date);
      this.form.patchValue({time:this.date});
      this.form.patchValue({date:this.date});

  }

getIntervenants(){
  this.globalService.getIntervenants().then(
    res=>{
      let inialValues=new Array();
      this.seletMultiMyFunc(res,inialValues);
    },
    err=>console.log(err)
  );
}


  getDi(DiID:number){
    this.diService.getDi(DiID).then(
      res => {
        console.log(res);
        if(res.di.statut=='ferme'){
          this._router.navigate(['/index']);
        }

        this.EquipementID=res.di.equipement_id;

        this.niveaus=res.niveaus;
        this.niveaux=res.niveaux;
        this.taches=res.taches;
        //this.getTachesByEquipementID(this.EquipementID,0);

        let obj2:any={};
        obj2.id=this.EquipementID;
        obj2.name=res.di2.equipement;
        obj2.depth=res.di2.Niv;
        let obj3:any={};
        obj3.data=obj2;
        this.node=obj3;

        this.demandeur=res.demandeur;
        this.recepteur=res.recepteur;
        this.di=res.di;

       

        },
      err => console.log('AddFournisseurComponent:onSubmit:' + JSON.stringify(err) )
     );
  }


  getOt(){
  
    console.log(this.form.value);
  //  this.form.patchValue({time:res.ot.datetime});
  //  this.form.patchValue({date:res.ot.date});

  }


  openDialogAddTache(){
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data=this.node;
    this.matDialog.open(EquiTacheAddComponent, dialogConfig)
    .afterClosed().subscribe( res=> {
      if( res != undefined && res!=null ) {
      this.getTachesByEquipementID(this.EquipementID,res.TacheID);
      }
      });
  }

/*
  ReceptNode(node:TreeNode){
    this.EquipementID=node.data.id;
    this.node=node;
    this.getTachesByEquipementID(node.data.id,0);
  }
*/

  getTachesByEquipementID(EquipementID:number,TacheID){
   this.equipementService.getTachesByEquipementID(EquipementID).then(
     res=>{
       this.taches=res;
       this.form.patchValue({equipement_id:EquipementID});
       if(TacheID>0){
        this.form.patchValue({tache_id:TacheID});
       }else{
        this.form.patchValue({tache_id:''});
       }
      },
     err=>console.log()
   );
  }


    // _______________________________________________________________________________________


  InitForm(){
    
    this.form = this.fb.group({
      OtID: [''],
      user_id: [''],
      di_id: [''],
      tache_id: ['',Validators.required],
      date: ['',Validators.required],
      time: ['',Validators.required],
      datetime: [''],
      statut:[null],
      updated_at:[''],
      created_at:[''],
      //intervenants:['']
    });
  }

    submit(){
      if(this.form.valid){
        if(!this.LoadingReactBtn1){
          this.LoadingReactBtn1=true;

        //console.log(this.IntervenantsIds());
       // this.intervenants=bankMultiCtrl
       
        
          //this.otService.addOt(this.form.value,this.IntervenantsIds(),0).then(
          this.otService.addOt(this.form.value,this.intervenantsIDs,0).then(
           res=>{
             //console.log(res)
        if(res.success){
        this.notification('success',res.msg, 3000);
        this.redirection(this.UrlToRedirection+res.ot.OtID);
        }else{
          this.LoadingReactBtn1=true;
          this.notification('danger',res.msg, 2000);

        }

          },
           err=>console.log(err)
         );
         
      }
    }else{
      this.notification('danger',"Formulaire pas valide .", 2000);

    }
  }

    IntervenantsIds(){
      let  oldArr=this.intervenants; //this.bankMultiCtrl.value;
      let newArr=new Array();
      for(let i=0;i<oldArr.length;i++){
        newArr.push(oldArr[i].IntervenantID);
      }
      return newArr;
    }

  /*
    addoreditOt(formValue,OtID:number){
      if(!(this.OtID>0)){
      this.otService.addoreditOt(formValue,0).then(
        res => {},
        err => console.log('AddFournisseurComponent:onSubmit:' + JSON.stringify(err) )
       );
        }else{      
          this.otService.addoreditOt(formValue,this.OtID).then(
            res => {},
            err => console.log('AddFournisseurComponent:onSubmit:' + JSON.stringify(err) )
           );  
        }
      }
      */

  // _______________________________________________________________________________________

  
  isPoste(ExpectedPoste:string){
    return this._authService.isPoste(ExpectedPoste); 
   }
   isPosts(ExpectedPosts){
    let bool=false;
    for(let i=0;i<ExpectedPosts.length;i++){
      if(this.isPoste(ExpectedPosts[i])){ bool=true;}
    }
    return bool;
   }

  ReglageDate(date:Date){
    let userTimezoneOffset = date.getTimezoneOffset() * 60000;
    let date2=new Date(this.date.getTime() - userTimezoneOffset);
    return date2;
  }


  
// ------------------------- select Multi with Search --------------------------

 seletMultiMyFunc(res,valeursInitiales){

  let arr=new Array(); arr=res;
  for(let i=0;i<arr.length;i++){
    let obj:any={}; 
    obj.name=arr[i].name;
    obj.IntervenantID=arr[i].IntervenantID;
    //this.banks.push(obj);
    // b disign jdid ma3ach 7achti bil banks
    this.intervenants.push(obj);
  }

/*
let newvaleursInitiales=new Array();
for(let j=0;j<this.banks.length;j++){
  if(valeursInitiales.includes(this.banks[j].IntervenantID)){
    newvaleursInitiales.push(this.banks[j]);
  }
}
*/

/*
let newvaleursInitiales=new Array();
for(let j=0;j<this.intervenants.length;j++){
  if(valeursInitiales.includes(this.intervenants[j].IntervenantID)){
    newvaleursInitiales.push(this.intervenants[j].IntervenantID);
  }
}
this.intervenantsIDs=newvaleursInitiales;
*/

/*
this.bankMultiCtrl.setValue(newvaleursInitiales);

this.filteredBanksMulti.next(this.banks.slice());
this.bankMultiFilterCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filterBanksMulti();
  });
*/

}

  ngAfterViewInit() {
    //this.setInitialValue();
  }

  ngOnDestroy() {
    /*
    this._onDestroy.next();
    this._onDestroy.complete();
    */
  }
  /*
  //Sets the initial value after the filteredBanks are loaded initially
  protected setInitialValue() {
    this.filteredBanksMulti
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.multiSelect.compareWith = (a, b) => a && b && a.IntervenantID === b.IntervenantID;
      });
  }
  */

  /*
  protected filterBanksMulti() {
    if (!this.banks) {
      return;
    }
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.banks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanksMulti.next(
      this.banks.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }
*/
// ########################### select Multi with Search ###########################





// ------ Notification & Redirection  --------------
UrlToRedirection="/gmao/correctif/ot/ot/";
redirection(url) {
  this._router.navigate([url]);
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