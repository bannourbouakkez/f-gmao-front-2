import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EquipementService } from 'src/app/features/equipement/services/equipement.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { EquiAnomalieAddComponent } from 'src/app/features/equipement/anomalie/equi-anomalie-add/equi-anomalie-add.component';

import { TreeNode } from 'angular-tree-component';
import { GlobalService } from 'src/app/shared/global.service';
import { UploadService } from 'src/app/shared/upload.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { OuiOuNonComponent } from 'src/app/shared/others/oui-ou-non/oui-ou-non.component';
import { DiService } from '../../services/di.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { MessageService } from 'src/app/@pages/components/message/message.service';
import * as errors from './errors';


@Component({
  selector: 'app-corr-di-add',
  templateUrl: './corr-di-add.component.html',
  styleUrls: ['./corr-di-add.component.scss']
})
export class CorrDiAddComponent implements OnInit {
  
  DiID:number=0;
   //---------- breadcrumb ---------
   autres=[ 
    {url:'gmao/correctif/di/dis',title:'Liste DIs'}
    //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    ];
  breadcrumb = [
    { url: 'gmao', title: 'home' },
    { url: 'gmao/correctif', title: 'correctif' },
    { url: 'gmao/correctif/di', title: 'Di' },
    //{ url: '#', title: this.AjouterOuModifier(this.DiID)+' DI' }
    { url: '#', title: 'DI' }
  ];
  LoadingReactBtn1=false;
  AjouterOuModifier(bool){
    if(bool){return 'Modifier';}
    else{ return 'Ajouter';}
  }
  PageDiLoaded=false;
  LoadGetAnomalies=false;
  //###############################

  haveOt=false;
  plan:any;

  niveaux=<any>[];

  // ---- form errors --------------------------
  formErrors = errors.formErrors;
  validationMessages = errors.validationMessages;
  private sub_errors: any;
  //############################################

  isChefDeEquipe=false;


  public selectedMoment = new Date();
  
  date=new Date();
  form:FormGroup;
  users=<any>[];
  demandeurs=<any>[];
  recepteurs=<any>[];
  me:any;
  di:any;
  
  anomalies=<any>[];
  node:TreeNode;
  EquipementID:number=0;
  InpuEquipementID:number;
  InpuName:string;

  /*
  protected banks=<any>[] ;
  public AnomalieID: FormControl = new FormControl();
  public bankServerSideFilteringCtrl: FormControl = new FormControl();
  public searching: boolean = false;
  public  filteredServerSideBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();
  */

  constructor( private fb: FormBuilder,private equipementService:EquipementService,private matDialog: MatDialog
              ,private globalService:GlobalService,private _uploadService:UploadService,private diService:DiService
              ,private _currentRoute: ActivatedRoute,private _authService:AuthService,private _router:Router
              , private _notification: MessageService
             ){}
 
  ngOnInit() {
    
    if( !this.isPosts(['Admin','Methode','ChefDeEquipe']) ){
      this._router.navigate(['/index']);
    }

    this.InitForm();

    let DiID = +this._currentRoute.snapshot.paramMap.get('id');
    if(DiID>0){
      this.DiID=DiID;
      this.getDi(DiID);
    }else{
      this.date=this.ReglageDate(this.date);
      this.form.patchValue({time:this.date});
      this.form.patchValue({date:this.date});
    }
    
    this.getUsersPosts([]);
    //this.onInitUploadForm();

    
   
  
  /*
  this.bankServerSideFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),tap(() => this.searching = true),takeUntil(this._onDestroy), debounceTime(200),
        mergeMap(search => {
          if (!this.banks) {
            return [];
          } 
         // return this.singleDbService.getFournisseurs(search);
         return this.equipementService.anomalieSearch(search);
         //return [];
        }),
        tap((anomalies:any[]) =>{
          this.anomalies=anomalies;
        }),
        delay(500))
      .subscribe(filteredBanks => {
        this.searching = false; this.filteredServerSideBanks.next(filteredBanks);
      },error => {this.searching = false; });
   */

  }



  getDi(DiID:number){
    this.diService.getDi(DiID).then(
      res => {
        console.log(res);
        if(res.di.statut=='ferme'){
          //this._router.navigate(['/index']); // Security
        }

        this.di=res.di;
        this.plan=res.plan;
        //if(this.plan && this.plan.isExecuted==1){this._router.navigate(['/index']);} // Security
        this.EquipementID=res.di.equipement_id;
        this.InpuEquipementID=this.EquipementID;
        this.InpuName=res.di2.equipement;
        this.form.patchValue(res.di);
        this.form.patchValue({time:res.di.datetime});
        this.form.patchValue({date:res.di.date});
        this.getAnomaliesByEquipementID(this.EquipementID,res.di.anomalie_id);
        
        let obj2:any={};
        obj2.id=this.EquipementID;
        obj2.name=res.di2.equipement;
        obj2.depth=res.di2.Niv;
        let obj3:any={};
        obj3.data=obj2;
        this.node=obj3;
        
        this.niveaux=res.niveaux;
        //this.getFiles();
        this.GetFiles=true; // uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
        this.PageDiLoaded=true;
        
        },
      err => console.log('AddFournisseurComponent:onSubmit:' + JSON.stringify(err) )
     );
  }


  openDialogAddAnomalie(){
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data=this.node;
    this.matDialog.open(EquiAnomalieAddComponent, dialogConfig)
    .afterClosed().subscribe( res=> {
      if( res != undefined && res!=null ) {
      this.getAnomaliesByEquipementID(this.EquipementID,res.AnomalieID);
      }
      });
  }
  
  ReceptNode(node:TreeNode){
    this.EquipementID=node.data.id;
    this.node=node;
    this.getAnomaliesByEquipementID(node.data.id,0);
  }
  
  getAnomaliesByEquipementID(EquipementID:number,AnomalieID){
   //console.log('EquipementID:'+EquipementID);
   this.LoadGetAnomalies=true;
   this.equipementService.getAnomaliesByEquipementID(EquipementID).then(
     res=>{
      
      //this.form.setControl('anomalie_id', new FormControl());
      //this.form.patchValue({anomalie_id:''});
     

       this.anomalies=res;
       this.form.patchValue({equipement_id:EquipementID});
       if(AnomalieID>0){
        this.form.patchValue({anomalie_id:AnomalieID});
       }else{
        this.form.patchValue({anomalie_id:''});
       }

       this.LoadGetAnomalies=false;
      },
     err=>console.log()
   );
  }

    // _______________________________________________________________________________________


  InitForm(){
    this.form = this.fb.group({
      DiID: [''],
      user_id: [''],
      demandeur_user_id: ['',Validators.required],
      recepteur_user_id: ['',Validators.required],
      equipement_id: [''],
      anomalie_id: ['',Validators.required],
      dossier_id: [1],
      date: ['',Validators.required],
      time: ['',Validators.required],
      datetime: [''],
      description: [''],
      type:['autres',Validators.required],
      degre:['faible',Validators.required],
      statut:[null],
      updated_at:[''],
      created_at:['']
  });

  this.sub_errors = this.form.valueChanges.subscribe((data) => {
    this.logValidationErrors(this.form);
  });

    }

    submit(){
      if(this.form.valid){
        if(!this.LoadingReactBtn1){
          this.LoadingReactBtn1=true;
         //this.onSubmitAfterUpload();
         this.UploadOrder=true;  // uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
        }
    }else{
      this.form.markAllAsTouched();
      this.logValidationErrors(this.form);
      this.notification('danger', 'Formulaire est non valide', 1000);
    }
    }
  
    addoreditDi(formValue,DiID:number){
      if(!(this.DiID>0)){
      this.diService.addoreditDi(formValue,0).then(
        res => {
          this.LoadingReactBtn1=false;

          if(res.success){
            //this.InitForm(); this.niveaux=[]; this.InpuEquipementID=null;this.InpuName=null;
            let reset_equipement_id=this.form.controls.equipement_id.value;
            let reset_date=this.form.controls.date.value;
            let reset_demandeur_user_id=this.form.controls.demandeur_user_id.value;
            if(!this.isChefDeEquipe){ reset_demandeur_user_id=null; }
            
            this.form.reset();
            this.uploadReset(); // uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
          
            this.form.patchValue({equipement_id:reset_equipement_id,date:reset_date,demandeur_user_id:reset_demandeur_user_id,type:'autres',degre:'faible',dossier_id:1});
            this.notification('success',res.msg, 3000);
          }else{
            this.notification('danger',res.msg, 3000);
          }

        },
        err => console.log('AddFournisseurComponent:onSubmit:' + JSON.stringify(err) )
       );
        }else{      
          this.diService.addoreditDi(formValue,this.DiID).then(
            res => {
              this.LoadingReactBtn1=false;

              if(res.success){
                this.notification('success',res.msg, 3000);
                this.redirection(this.UrlToRedirection+this.DiID);
                }else{
                this.notification('danger',res.msg, 5000);
                }

            },
            err => console.log('AddFournisseurComponent:onSubmit:' + JSON.stringify(err) )
           );  
        }
      }

  // _______________________________________________________________________________________


  usersHavePosts(users,arrPosts){
    let NvArrUser=new Array();
    for (var i = 0;  i<this.users.length; i++ ) {
      let user=false;
      let posts=this.users[i].posts;
        for (var j = 0;  j<arrPosts.length; j++ ) {
          if(posts.includes(arrPosts[j])){
            user=true;
          }
        }
    if(user){NvArrUser.push(this.users[i]);}
    }
  return NvArrUser;
  }

  getUsersPosts(posts?){
    this.globalService.getUsersPosts(posts).then(
      res=>{
        this.users=res.users;
        this.me=res.me;
        this.demandeurs=this.usersHavePosts(this.users,["ChefDeEquipe"]);
        this.recepteurs=this.usersHavePosts(this.users,["ChefDePoste","ResponsableMaintenance"]);
        this.IfIAmChefDeEquipeDeleteAllDemandeursExceptMe();
        
       if(this.DiID==0){
        for (var i=0;i<this.me[0].posts.length;i++ ) {
          if(this.me[0].posts.includes("ChefDeEquipe")){
            this.form.patchValue({demandeur_user_id:this.me[0].id});
          }
        }
       }
      },
      err=>console.log(err)
    );
  }

  IfIAmChefDeEquipeDeleteAllDemandeursExceptMe(){
   if(this.me[0].posts.includes("ChefDeEquipe") && !this.me[0].posts.includes("Admin") && !this.me[0].posts.includes("Methode")){
     this.demandeurs=[];
     this.demandeurs.push(this.me[0]);
     this.isChefDeEquipe=true;
   }
  }

  
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
    //return date;

    let userTimezoneOffset = date.getTimezoneOffset() * 60000;
    let date2=new Date(this.date.getTime() - userTimezoneOffset);
    return date2;

  }

  /* 
  // Test DateTime 
  // fil init --------------------
   this.form = this.fb.group({
      time: [''],
      date: [''],
      datetime:['']
    });
    this.equipementService.affectDateTime(11).then(
      res=>{ console.log(res) ;
      this.form.patchValue({
        time:res.datetime1,
        date:res.date,
        datetime:res.datetime1
      });
      },
      err=>console.log('err')
    );

  //#############################
  consoleForm(){
    console.log(this.form.value);
    this.equipementService.datetimetest(this.form.value).then(
      res=>console.log(res),
      err=>console.log(err)
    );
  }
*/
 

ActionDossierIDFunc(DossierID){
  this.form.patchValue({dossier_id:DossierID});
  //console.log('ActionDossierIDFunc');
  //console.log(this.form.value);
}

ActionUploadFunc(){
  //console.log('ActionUploadFunc');
  //console.log(this.form.value);
  this.addoreditDi(this.form.value,this.DiID);
}
 
uploadReset(){
  this.ResetUplaodComp=true;  
  this.UploadOrder=false;
}
UploadOrder=false;
GetFiles=false;
ResetUplaodComp=false;

/*
public uploader:FileUploader = new FileUploader({
  isHTML5: true
});

myFiles= [];
files=<any>[];
  isFiles=false;
  publicFolder=environment.publicFolder;
  uploadForm: FormGroup;
  progress = { loaded : 0 , total : 1 };
  loadingIsStart=false;
  nbOfFiles:number=0;
  actualFileNameUpload="";
  nbOfFileUploaded=0;

  onInitUploadForm() {
    this.uploadForm = this.fb.group({
      document: [null],type:[''],OriginaleName:[''],BDName:[''],size:[''],extention:['']
    });
  }

  async uploadFile(sommeSize:number,name:string,DossierID:number){ 
    this.loadingIsStart=true;
    await this._uploadService
   /*
   .uploadFile(toFormData(this.uploadForm.value)).then(
   res=>console.log('uploadFile res : '+res),
   err=>console.log('uploadFile err : '+err)
   );
   */
/*
   //progress
   .uploadFile(toFormData(this.uploadForm.value),DossierID)
   .subscribe(
     (data: any) => { 
       console.log(data);   
       if(data.type == 1 && data.loaded && data.total){
         this.progress.loaded = data.loaded;
         this.progress.total = data.total;
       }
       else if(data.body){
        this.actualFileNameUpload=name;
        this.nbOfFileUploaded=this.nbOfFileUploaded+1;
        this.progress= { loaded : 0 , total : 1 };
       }
      },
     error => console.log(error) 
   );
}

fileEvent(event) {
  const file = (event.target as HTMLInputElement).files[0];
  this.uploadForm.patchValue({document:file });
  this.uploadForm.get('document').updateValueAndValidity();
  // this.myFiles.push(fileItem);
  //this.uploadFile();
}

//################################



  removeFile(id:number,i:number){

    let data:any={};
    data.msg="messageee";
    data.type="danger";
    data.btnoui="Suprimer";
    data.btnnon="Annuler";
   
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = "500px";
    dialogConfig.data=data;

    const dialogRef = this.matDialog.open(OuiOuNonComponent, {});
    dialogRef.afterClosed().subscribe(result => {
   if(result==1){
      this._uploadService.removeFile(id).then(
        res=>{
          console.log(res);
          if(res==1){
            this.files.splice(i, 1);
          }
        },
        err=>console.log(err)
      );
  
    }
  });
    
  }

  async getFiles(){
    console.log('getFiles:'+JSON.stringify(this.form.value));
      if(this.DiID){
  
        console.log('this.form.controls[dossier_id].value = '+this.form.controls['dossier_id'].value);
        await this._uploadService.getFiles(this.form.controls['dossier_id'].value).then(
          res=>{
            console.log(JSON.stringify(res));
            this.files=res;
            if ( this.files.length>0 ) this.isFiles=true;
          },
          err=>console.log('AddFournisseurComponent:getFiles:' + err)
        )
      } 
  }
  
  async onSubmitAfterUpload(){
    var sommeSize=1;
    var nbFiles=0;

    for (let i = 0; i < this.uploader.queue.length; i++) {
      let fileItem = this.uploader.queue[i]._file;
      console.log('Size='+fileItem.size);
      sommeSize=sommeSize+fileItem.size;
      nbFiles=nbFiles+1;
      if(fileItem.size > 100000000){ 
        alert("Each File should be less than 100 MB of size.");
        return;
      }
    }

    var DossierID=+this.form.controls['dossier_id'].value; 
    if(DossierID<=1){
      console.log('d5al <=1');
    if(this.uploader.queue.length>0 && sommeSize>2){
      console.log('d5al '+this.uploader.queue.length+'>0 && '+sommeSize+'>2');
       await this._uploadService.CreerUnDossier(
        (this.form.controls['DiID'].value),
        'di',
        'les fichiers de di :'+this.form.controls['DiID'].value,
        'rien'
        ).then(
           res=>{
             console.log('DossierID=+res : '+res)
             DossierID=+res;
             this.form.patchValue({dossier_id:DossierID});
             console.log();
           },
           err=>console.log(err)
           );
    }
  }
    //this.form.controls['fichier'].setValue(DossierID);
    //this.form.patchValue({fichier:DossierID});
   // console.log('DossierID = '+DossierID);


    this.nbOfFiles=nbFiles;
    
    if(DossierID>1){
      //console.log('DossierID = '+DossierID);
    //this.progressTotal=sommeSize;
      for  (let j = 0; j < this.uploader.queue.length; j++) {
      let fileItem = this.uploader.queue[j]._file;
     // data.append('file', fileItem);
       this.uploadForm.patchValue({document:fileItem });
       this.uploadForm.patchValue({size:fileItem.size });
       await this.uploadFile(sommeSize,fileItem.name,DossierID); 
    }
    this.uploader.clearQueue();
    }

    //console.log(this.form.value);

    this.addoreditDi(this.form.value,this.DiID);
  

  }
  
*/


// ------ Notification & Redirection  --------------
  UrlToRedirection="/gmao/correctif/di/di/";
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

// -------------- Form Errors -----------------------------
ngOnDestroy() { this.sub_errors.unsubscribe(); }

logValidationErrors(group: FormGroup = this.form): void {
  Object.keys(group.controls).forEach((key: string) => {
    const abstractControl = group.get(key);
    if (abstractControl instanceof FormGroup) {
      this.logValidationErrors(abstractControl);
    } else {
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid
        && (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            //console.log( 'this.formErrors : '+this.formErrors +' , key : '+key+ ' , this.formErrors[key] : '+this.formErrors[key]);
            //console.log('messages : '+messages+' , messages[errorKey] : '+messages[errorKey])
            this.formErrors[key] += messages[errorKey] + ' <br> ';
          }
        }
      }
    }
  })
}
// ############################################################


  
}



export function toFormData<T>( formValue: T ) {
  const formData = new FormData();

  for ( const key of Object.keys(formValue) ) {
    var value = formValue[key];
    if(value==null){value='';}
    formData.append(key, value);
  }

  return formData;
}

