import { Component, OnInit } from '@angular/core';
import {FileUploader} from "ng2-file-upload"; 
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { UploadService } from 'src/app/shared/upload.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { OuiOuNonComponent } from 'src/app/shared/others/oui-ou-non/oui-ou-non.component';
import { OutilService } from '../../services/outil.service';
import { MessageService } from 'src/app/@pages/components/message/message.service';


/*
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/others/format-datepicker';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;
*/

@Component({
  selector: 'app-mag-outil-add',
  templateUrl: './mag-outil-add.component.html',
  styleUrls: ['./mag-outil-add.component.scss'],
  providers: [

    //{provide: DateAdapter, useClass: AppDateAdapter},
    //{provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
    // {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: false}}

  ]
})
export class MagOutilAddComponent implements OnInit {

    //---------- breadcrumb ---------
    autres=[ 
      {url:'gmao/magasin/outils/outils/0',title:'Liste outils'}
      //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
      ];
    breadcrumb = [
      { url: 'gmao', title: 'home' },
      { url: 'gmao/magasin', title: 'magasin' },
      { url: 'gmao/magasin/Outillage', title: 'Outillage' },
      //{ url: '#', title: this.AjouterOuModifier(this.DiID)+' DI' }
      { url: '#', title: 'Ajouter Outil' }
    ];
    breadcrumb2 = [
      { url: 'gmao', title: 'home' },
      { url: 'gmao/magasin', title: 'magasin' },
      { url: 'gmao/magasin/Outillage', title: 'Outillage' },
      //{ url: '#', title: this.AjouterOuModifier(this.DiID)+' DI' }
      { url: '#', title: 'Modifier Outil' }
    ];

    LoadingReactBtn1=false;
    AjouterOuModifier(bool){
      if(bool){return 'Modifier';}
      else{ return 'Ajouter';}
    }
    PageLoaded=false;
    //###############################


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


  
  public uploader2:FileUploader = new FileUploader({
    isHTML5: true
  });
  myFiles2= [];

  files2=<any>[];
  isFiles2=false;
  publicFolder2=environment.publicFolder;
  uploadForm2: FormGroup;
  progress2 = { loaded : 0 , total : 1 };
  loadingIsStart2=false;
  nbOfFiles2:number=0;
  actualFileNameUpload2="";
  nbOfFileUploaded2=0;


  OutilForm:FormGroup;
  OutilID:number=0;
  outil:any;
  secteurs=<any>[];
  types=<any>[];
  etats=<any>[];
  utilisations=<any>[];
  ListeValueUtilisations=[];
  constructor(private fb:FormBuilder,private _uploadService:UploadService,private matDialog: MatDialog,
              private outilService:OutilService,private _currentRoute: ActivatedRoute,public uploadService:UploadService
              ,private _notification: MessageService,private _router:Router) { }
              
  ngOnInit() {

    this.onInitUploadForm();
    this.OutilFormOnInit();
    

    let OutilID = +this._currentRoute.snapshot.paramMap.get('id');
    if(OutilID>0){
      this.OutilID=OutilID;
      let source='modification';
      this.outilService.getOutilAndTables(OutilID,source).then(
        res=>{
        console.log(res)
        this.OutilForm.setValue(res.outil);
        this.ListeValueUtilisations=res.ListeValueUtilisations;

        this.secteurs=res.secteurs;
        this.etats=res.etats;
        this.types=res.types;
        this.utilisations=res.utilisations;

        this.outil=res.outil;
        this.getFiles();
        this.PageLoaded=true;

        this.GetFiles1=true;
        this.GetFiles2=true;
        },
        err=>console.log(err)
      );
      }else{
        let source='ajouter';
        this.getOutilAndTables(0,source);
      }

  }

  ReceptListeValueUtilisationsEmitted(e){ 
  this.ListeValueUtilisations=e;
  }

  getOutilAndTables(OutilID:number,source:string){
   this.outilService.getOutilAndTables(OutilID,source).then(
     res=>{
    this.secteurs=res.secteurs;
    this.etats=res.etats;
    this.types=res.types;
    this.utilisations=res.utilisations;
    this.ListeValueUtilisations=res.ListeValueUtilisations;
    //this.outil=res.outil;
     },
     err=>console.log(err)
   );
  }

  onInitUploadForm() {
    this.uploadForm = this.fb.group({
      document: [null],type:[''],OriginaleName:[''],BDName:[''],size:[''],extention:['']
    });
    this.uploadForm2 = this.fb.group({
      document: [null],type:[''],OriginaleName:[''],BDName:[''],size:[''],extention:['']
    });
  }

  OutilFormOnInit(){
    this.OutilForm=this.fb.group({
      OutilID:[''],
      exist:[1],
      reserve:[0],
      created_at:[''],
      updated_at:[''],
      des:['',Validators.required],
      secteur_id:[''],
      type_id:[''],
      etat_id:[''],
      
      prixTTC:[0,Validators.pattern("\\-?\\d*\\.?\\d{1,9}")],

      code_outil:[''],
      num_serie:[''],
      num_modele:[''],
      fournisseur:[''],

      achat:[''],
      FinGarentie:[''],
      MiseEnService:[''],

      remarques:[''],

      imgs_dossier_id:[1],
      fichiers_dossier_id:[1]
    });
  }

  date = new Date();
   firstDay = new Date(this.date.getFullYear(), this.date.getMonth()-1, 1);
   formDate:FormGroup=new FormGroup({
    minformdate:new FormControl(this.firstDay),
    maxformdate:new FormControl()
   });




  
ActionDossierIDFunc1(DossierID){
  this.OutilForm.patchValue({imgs_dossier_id:DossierID});
}
ActionUploadFunc1(){
  //this.addoreditDi(this.OutilForm.value,this.OutilID);
  this.UploadOrder2=true;
}
ActionDossierIDFunc2(DossierID){
  this.OutilForm.patchValue({fichiers_dossier_id:DossierID});
}
ActionUploadFunc2(){
  var x = setTimeout(() =>{this.envoyer();},1000);
  //this.envoyer();
  //this.addoreditDi(this.OutilForm.value,this.OutilID);
}

uploadReset1(){
  this.ResetUplaodComp1=true;  
  this.UploadOrder1=false;
  console.log('uploadReset1');
}
UploadOrder1=false;
GetFiles1=false;
ResetUplaodComp1=false;

uploadReset2(){
  this.ResetUplaodComp2=true;  
  this.UploadOrder2=false;
  console.log('uploadReset2');

}
UploadOrder2=false;
GetFiles2=false;
ResetUplaodComp2=false;






  submit(){

    
    /* 9dim 
    if(this.validCaraForm()){
      if(this.ArticleForm.valid){
      if(this.ArticeleID>0){}
      }
    }
   
   //console.log(this.OutilForm.value);
   */
   
   /* jdid 
   this.uploadFunc();
   */

  if(this.OutilForm.valid){
    if(!this.LoadingReactBtn1){
      this.LoadingReactBtn1=true;
     //this.onSubmitAfterUpload();
     this.UploadOrder1=true;  // uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu
    }
}else{
  //this.OutilForm.markAllAsTouched();
  //this.logValidationErrors(this.form);
  this.notification('danger', 'Formulaire est non valide', 1000);
}
}

/*
async uploadFunc(){
  var sommeSize=1;
  var nbFiles=0;

  for (let i = 0; i < this.uploader.queue.length; i++) {
    let fileItem = this.uploader.queue[i]._file;
    sommeSize=sommeSize+fileItem.size;
    nbFiles=nbFiles+1;
    if(fileItem.size > 100000000){ 
      alert("Each File should be less than 100 MB of size.");
      return;
    }
  }

  var DossierID=+this.OutilForm.controls['imgs_dossier_id'].value; 
  console.log('DossierID:'+DossierID);
  if(DossierID<=1){
  if(this.uploader.queue.length>0 && sommeSize>2){
     await this._uploadService.CreerUnDossier(
      (this.OutilForm.controls['des'].value),
      'Article',
      'les images de cet article :'+this.OutilForm.controls['des'].value,
      'rien'
      ).then(
         res=>{
           DossierID=+res;
           this.OutilForm.patchValue({imgs_dossier_id:DossierID});
         },
         err=>console.log(err)
         );
  }
}

  this.nbOfFiles=nbFiles;
  
  if(DossierID>1){
    console.log('dossier>1');
    for  (let j = 0; j < this.uploader.queue.length; j++) {
    let fileItem = this.uploader.queue[j]._file;
     this.uploadForm.patchValue({document:fileItem });
     this.uploadForm.patchValue({size:fileItem.size });
     await this.uploadFile(sommeSize,fileItem.name,DossierID); 
  }
  this.uploader.clearQueue();
  }
*/
/*
 this.outilService.addoredit(this.form.value).then(
 res => { console.log(res);},
 err => console.log('AddFournisseurComponent:onSubmit:' + JSON.stringify(err) )
 );
*/
/*
this.uploadFunc2();

}
*/
/*
async uploadFunc2(){
  var sommeSize2=1;
  var nbFiles2=0;

  for (let i = 0; i < this.uploader2.queue.length; i++) {
    let fileItem2 = this.uploader2.queue[i]._file;
    sommeSize2=sommeSize2+fileItem2.size;
    nbFiles2=nbFiles2+1;
    if(fileItem2.size > 100000000){ 
      alert("Each File should be less than 100 MB of size.");
      return;
    }
  }

  var DossierID=+this.OutilForm.controls['fichiers_dossier_id'].value; 
  if(DossierID<=1){
  if(this.uploader2.queue.length>0 && sommeSize2>2){
     await this._uploadService.CreerUnDossier(
      (this.OutilForm.controls['des'].value),
      'Article',
      'les fichiers de cet article :'+this.OutilForm.controls['des'].value,
      'rien'
      ).then(
         res=>{
           DossierID=+res;
           this.OutilForm.patchValue({fichiers_dossier_id:DossierID});
         },
         err=>console.log(err)
         );
  }
}

  this.nbOfFiles2=nbFiles2;
  
  if(DossierID>1){
    for  (let j = 0; j < this.uploader2.queue.length; j++) {
    let fileItem2 = this.uploader2.queue[j]._file;
     this.uploadForm2.patchValue({document:fileItem2 });
     this.uploadForm2.patchValue({size:fileItem2.size });
     await this.uploadFile2(sommeSize2,fileItem2.name,DossierID); 
  }
  this.uploader2.clearQueue();
  }


  this.envoyer();
*/
/*
  this.outilService.submitArticle(this.OutilForm.value,this.CaraForm).then(
    res=>console.log(res),
    err=>console.log(err)
  );
*/
//}



envoyer(){
  console.log('envoyer:');
  console.log(this.OutilForm.value);

  if(this.OutilID>0){
    this.outilService.EditOutil(this.OutilForm.value,this.ListeValueUtilisations,this.OutilID).then(
      res=>{
        console.log(res);
        this.LoadingReactBtn1=false;
              if(res.success){
                this.notification('success',res.msg, 3000);
                this.redirection(this.UrlToRedirection+this.OutilID);
                }else{
                this.notification('danger',res.msg, 5000);
                }
      },
      err=>console.log(err)
    );
    }else{
      this.outilService.addOutil(this.OutilForm.value,this.ListeValueUtilisations).then(
        res=>{
          console.log(res);
          this.LoadingReactBtn1=false;
          if(res.success){
            this.OutilForm.reset();
            this.uploadReset1();
            this.uploadReset2(); 
            this.OutilForm.patchValue({exist:1,reserve:0,prixTTC:0,imgs_dossier_id:1,fichiers_dossier_id:1});
            this.notification('success',res.msg, 3000);
          }else{
            this.notification('danger',res.msg, 3000);
          }
        },
        err=>console.log(err)
      );
    }
}


// ------ Notification & Redirection  --------------
UrlToRedirection="/gmao/magasin/outils/outil/";
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


/*
 this.outilService.addoredit(this.form.value).then(
 res => { console.log(res);},
 err => console.log('AddFournisseurComponent:onSubmit:' + JSON.stringify(err) )
 );
*/












/*
async uploadFile(sommeSize:number,name:string,DossierID:number){ 
  this.loadingIsStart=true;
  await this._uploadService
 .uploadFile(toFormData(this.uploadForm.value),DossierID)
 .subscribe(
   (data: any) => { 
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


async uploadFile2(sommeSize:number,name:string,DossierID:number){ 
  this.loadingIsStart2=true;
  await this._uploadService
 .uploadFile(toFormData(this.uploadForm2.value),DossierID)
 .subscribe(
   (data: any) => { 
     if(data.type == 1 && data.loaded && data.total){
       this.progress2.loaded = data.loaded;
       this.progress2.total = data.total;
     }
     else if(data.body){
      this.actualFileNameUpload2=name;
      this.nbOfFileUploaded2=this.nbOfFileUploaded2+1;
      this.progress2= { loaded : 0 , total : 1 };
     }
    },
   error => console.log(error) 
 );
}


*/

async getFiles(){
    if(this.OutilID>0){

      await this.uploadService.getFiles(this.OutilForm.controls['imgs_dossier_id'].value).then(
        res=>{
          this.files=res;
          if ( this.files.length>0 ) this.isFiles=true;
        },
        err=>console.log('AddFournisseurComponent:getFiles:' + err)
      );

      await this.uploadService.getFiles(this.OutilForm.controls['fichiers_dossier_id'].value).then(
        res=>{
          this.files2=res;
          if ( this.files2.length>0 ) this.isFiles2=true;
        },
        err=>console.log('AddFournisseurComponent:getFiles:' + err)
      );

    } 
}

/*
removeFile(id:number,i:number,ImgOuFichier:string){


  
  let type='danger'; let msg='Voulez vraiment supprimer cet '+ ImgOuFichier+' ? ';
  let btnoui='Suprimer'; let btnnon='Annuler';
  const dialogConfig = new MatDialogConfig();
  dialogConfig.autoFocus = true;
  dialogConfig.disableClose = true;
  dialogConfig.width = "50%";
  dialogConfig.data = { type, msg , btnoui , btnnon };
  this.matDialog.open(OuiOuNonComponent, dialogConfig).afterClosed().subscribe(res => { 
  if(res==1){
    this._uploadService.removeFile(id).then(
      res2=>{ 
        if(res2==1){
          
          if(ImgOuFichier=='image'){
            this.files.splice(i, 1);
          }
          if(ImgOuFichier=='fichier'){
            this.files2.splice(i, 1);
          }
         
        }
        //this._router.navigate(['/achat/cmd/liste']);
      },
      err=>console.log('CmdComponent:supprimerCmd:',err)
    );
  }
  });
 
}

*/

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