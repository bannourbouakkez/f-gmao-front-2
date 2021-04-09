import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '../../services/article.service';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { FieldConfig } from '../../../material/field.interface';
import { Subject } from 'rxjs';
import { DynamicFormComponent } from 'src/app/features/material/components/dynamic-form/dynamic-form.component';
import { FournisseurService } from 'src/app/features/achat/services/fournisseur.service';
import { UploadService } from 'src/app/shared/upload.service';
import { environment } from 'src/environments/environment';

import {FileUploader} from "ng2-file-upload"; 
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { OuiOuNonComponent } from 'src/app/shared/others/oui-ou-non/oui-ou-non.component';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss']
})
export class AddArticleComponent implements OnInit {

   //---------- breadcrumb ---------
   autres=[ 
    {url:'gmao/magasin/articles/all',title:'Liste articles'}
    //,{url:'gmao/preventif/intervention/addoredit',title:'Ajouter Intervention'}
    ];
  breadcrumb = [
    { url: 'gmao', title: 'home' },
    { url: 'gmao/magasin', title: 'magasin' },
    { url: 'gmao/magasin/article', title: 'Article' },
    //{ url: '#', title: this.AjouterOuModifier(this.DiID)+' DI' }
    { url: '#', title: 'Ajouter article' }
  ];
  breadcrumb2 = [
    { url: 'gmao', title: 'home' },
    { url: 'gmao/magasin', title: 'magasin' },
    { url: 'gmao/magasin/article', title: 'Article' },
    //{ url: '#', title: this.AjouterOuModifier(this.DiID)+' DI' }
    { url: '#', title: 'Modifier article' }
  ];

  LoadingReactBtn1=false;
  AjouterOuModifier(bool){
    if(bool){return 'Modifier';}
    else{ return 'Ajouter';}
  }
  PageLoaded=false;
  //###############################


  sousfamilles=[];
  fournisseurs=<any>[];
  familles=<any>[];
  emplacements=<any>[];
  unites=<any>[];

  ArticeleID:number=0;
  ArticleForm:FormGroup;
  article:any;
  CaraForm:any;
  isValid=false;
  regConfig: FieldConfig[]=[];
  isDynamic=false;

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
  */


@ViewChild(DynamicFormComponent,{static:true}) form: DynamicFormComponent; 
eventsSubject: Subject<void> = new Subject<void>();
emitEventToChild(res) {
  this.eventsSubject.next(res);
}


  constructor(private articleService:ArticleService,private fb:FormBuilder,private fournisseurService:FournisseurService,
              private _uploadService:UploadService,private _currentRoute: ActivatedRoute,private matDialog: MatDialog
              ,private _notification: MessageService,private _router:Router

              ) { }

  ngOnInit() {
    this.getFamilles();
    this.getEmplacements();
    this.getUnites();
    this.getFournisseurs();
    this.ArticleFormOnInit();
    //this.onInitUploadForm();
    //console.log('id:'+this.ArticeleID+', pl:'+this.PageLoaded);
    let ArticleID = +this._currentRoute.snapshot.paramMap.get('id');
    if(ArticleID>0){ 

      this.ArticeleID=ArticleID;
      let source='modification';
      this.articleService.GetArticle(ArticleID,source).then(
        res=>{
        //console.log('9bal res');
        //console.log(res);
        let FamCaraID=res.article.sous_famille_id;
       // console.log(res.article);
        this.article=res.article;
        //console.log(this.ArticleForm.value);
        this.ArticleForm.patchValue(res.article);
        //console.log(this.ArticleForm.value);
        //this.getFiles();
 
        //this.ArticeleID=ArticleID;

        //this.getFiles();
        this.PageLoaded=true;
        this.GetFiles1=true;
        this.GetFiles2=true;
      

        //console.log('id:'+this.ArticeleID+', pl:'+this.PageLoaded);


        this.SelectFamille(res.article.famille_id,FamCaraID,res.cara);
        
        if(FamCaraID==0){
        this.ArticleForm.patchValue({sous_famille_id:''});
        }else{
          this.ArticleForm.patchValue({sous_famille_id:FamCaraID});
        }
        /*
        this.ArticeleID=ArticleID;
        this.getFiles();
        this.PageLoaded=true;
        this.GetFiles1=true;
        this.GetFiles2=true;
        */


        },
        err=>console.log(err)
      );
    }


  }

  /*
  onInitUploadForm() {
    this.uploadForm = this.fb.group({
      document: [null],type:[''],OriginaleName:[''],BDName:[''],size:[''],extention:['']
    });
    this.uploadForm2 = this.fb.group({
      document: [null],type:[''],OriginaleName:[''],BDName:[''],size:[''],extention:['']
    });
  }
  */

  SelectFamille(e,FamCaraID,res){
    //if(!(this.ArticeleID>0)){this.ArticleForm.patchValue({famille_id:e});}

    this.regConfig=[];
    this.CaraForm=undefined;
    this.sousfamilles=[];
    
    this.ArticleForm.setControl('sous_famille_id', new FormControl());
    this.ArticleForm.patchValue({sous_famille_id:''});
    if(e>0){ this.getListeSousFamilles(e,FamCaraID,res); }

  }

  getListeSousFamilles(e:number,FamCaraID:number,res2){
    this.articleService.getListeSousFamilles(e).then(
      res=>{
      


        this.sousfamilles=res;
        //this.ArticleForm.patchValue({sous_famille_id:0});
        this.Selectsous_famille_id(FamCaraID,res2);
      },
      err=>console.log(err)
    );
  }

  getFournisseurs(){
    this.fournisseurService.getFournisseurs().then(
      res=>{this.fournisseurs=res;},
      err=>console.log(err)
    );
  }

  getFamilles(){
    this.articleService.getFamilles().then(
      res=>{this.familles=res;},
      err=>console.log(err)
    );
  }

  getEmplacements(){
    this.articleService.getEmplacements().then(
      res=>{this.emplacements=res;},
      err=>console.log(err)
    );
  }

  getUnites(){
    this.articleService.getUnites().then(
      res=>{this.unites=res;},
      err=>console.log(err)
    );
  }


  ArticleFormOnInit(){
    this.ArticleForm=this.fb.group({
      ArticleID:[''],
      exist:[1],
      created_at:[''],
      updated_at:[''],
      des:['',Validators.required],
      unite_id:['',Validators.required],
      code_article:[''],//,Validators.required],
      code_a_barre:[''],//,Validators.required],
      fournisseur_id:[''],//,Validators.required],
      artTVA:[0],//,[Validators.required,Validators.pattern("\\-?\\d*\\.?\\d{1,9}")]],
      stock:['',Validators.required],//,[Validators.required,Validators.pattern("\\-?\\d*\\.?\\d{1,9}")]],
      stock_min:[''],//,Validators.required],//,[Validators.required,Validators.pattern("\\-?\\d*\\.?\\d{1,9}")]],
      stock_max:[''],//,Validators.required],//,[Validators.required,Validators.pattern("\\-?\\d*\\.?\\d{1,9}")]],
      stock_alert:[''],//,Validators.required],//,[Validators.required,Validators.pattern("\\-?\\d*\\.?\\d{1,9}")]],
      famille_id:['',Validators.required],
      sous_famille_id:[''],
      PrixHT:[''],//,[Validators.required,Validators.pattern("\\-?\\d*\\.?\\d{1,9}")]],
      emplacement_id:[''],//,Validators.required],
      remarques:[''],
      imgs_dossier_id:[1],
      fichiers_dossier_id:[1]
      //reserved:['']
    });
  }

  fill(){
    this.ArticleForm.patchValue({
      code_article:'test',code_a_barre:'test',fournisseur_id:1,artTVA:18,
      stock:100,stock_min:20,stock_max:200,stock_alert:40,PrixHT:5,emplacement_id:1,
      remarques:'rq',unite_id:1
      //,FamilleID:1,sous_famille_id:0
    });
  }

  

  submitArticle(){
    if(this.validCaraForm()){
     if(this.ArticleForm.valid){
     this.LoadingReactBtn1=true;
      if(this.ArticeleID>0){
        
        if(this.ArticleForm.controls['sous_famille_id'].value==''){
          this.ArticleForm.patchValue({sous_famille_id:0});
        }
       // console.log(this.ArticleForm.value);
       // console.log(this.CaraForm);
        
       //this.uploadFunc();
       this.UploadOrder1=true;


        /*
        this.articleService.EditArticle(this.ArticleForm.value,this.CaraForm,this.ArticeleID).then(
          res=>console.log(res),
          err=>console.log(err)
        );
        */

        }else{

          if(this.ArticleForm.controls['sous_famille_id'].value==''){
            this.ArticleForm.patchValue({sous_famille_id:0});
          }

          //this.uploadFunc();
          this.UploadOrder1=true;

          //console.log(this.ArticleForm.value);
          //console.log(this.CaraForm);
          
          /*
          this.articleService.submitArticle(this.ArticleForm.value,this.CaraForm).then(
            res=>console.log(res),
            err=>console.log(err)
          );
          */
        }
      }else{
        this.notification('danger', 'Formuliare article est invalid .', 1500);
      }
    }else{
        this.notification('danger', 'Formulaire sous famille est invalid .', 1500);
    }
  }

  Selectsous_famille_id(e,res){
   
    this.isValid=false;
    let CaraID=e;
    if(CaraID>0){

      if(this.hasCara(CaraID)){
      this.regConfig=[];
      if(res==null){ this.getForm(CaraID,null); }
      else{ this.getForm(CaraID,res); }
      }else{
        this.regConfig=[];
        this.CaraForm=undefined;
      }
      
    }else{
    this.regConfig=[];
    this.CaraForm=undefined;
    }
  }

  SelectFournisseur(FournisseurID:number){
  if(FournisseurID>0){
    for (var i = 0;  i<this.fournisseurs.length; i++ ) {
      if(this.fournisseurs[i].id==FournisseurID){
        this.ArticleForm.patchValue({artTVA:this.fournisseurs[i].TVA});
      }
    }
  }else{
    this.ArticleForm.patchValue({artTVA:0});
  }

  }

  hasCara(CaraID:number){
    for (var i = 0;  i<this.sousfamilles.length; i++ ) {
      if(this.sousfamilles[i].FamCaraID==CaraID){
        if(this.sousfamilles[i].hasCara==true){
          return true;
        }
      }
    }
    return false;
  }

  getForm(FamCaraID:number,res2){
    this.articleService.getForm(FamCaraID).then(
      res=>{
       this.regConfig=res as FieldConfig[];
       this.CaraForm=this.regConfig;
       this.untilDynamicTrue(res2);
      },
      err=>console.log('AppComponent:getForm',err)
    );
   }

   untilDynamicTrue(res2){
    if(this.isDynamic==false){
      setTimeout(() => {
       this.untilDynamicTrue(res2);
        },50);
    }else{
      this.emitEventToChild(res2);
    }
  }

  
  submit(value: any) { this.CaraForm=value; this.isDynamic=true;}
  isValidFunc(value : any){ this.isValid=value;}


  validCaraForm(){
    //if(this.ArticleForm.controls['sous_famille_id'].value>0){

      if(this.hasCara(this.ArticleForm.controls['sous_famille_id'].value)){

         if(this.CaraForm==undefined){ return false;}
         else{
              if(this.isValid==true){ return true;}
              else{return false;}
          }
      }else{
        console.log('no hasCara , return true');
        return true;
      }

  //}else{
  //  return true;
  //}
  }



  ActionDossierIDFunc1(DossierID){
    this.ArticleForm.patchValue({imgs_dossier_id:DossierID});
  }
  ActionUploadFunc1(){
    //this.addoreditDi(this.OutilForm.value,this.OutilID);
    this.UploadOrder2=true;
  }
  ActionDossierIDFunc2(DossierID){
    this.ArticleForm.patchValue({fichiers_dossier_id:DossierID});
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

  var DossierID=+this.ArticleForm.controls['imgs_dossier_id'].value; 
  console.log('DossierID:'+DossierID);
  if(DossierID<=1){
  if(this.uploader.queue.length>0 && sommeSize>2){
     await this._uploadService.CreerUnDossier(
      (this.ArticleForm.controls['des'].value),
      'Article',
      'les images de cet article :'+this.ArticleForm.controls['des'].value,
      'rien'
      ).then(
         res=>{
           DossierID=+res;
           this.ArticleForm.patchValue({imgs_dossier_id:DossierID});
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

/*
 this.articleService.addoredit(this.form.value).then(
 res => { console.log(res);},
 err => console.log('AddFournisseurComponent:onSubmit:' + JSON.stringify(err) )
 );
*/
/*
this.uploadFunc2();

}


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

  var DossierID=+this.ArticleForm.controls['fichiers_dossier_id'].value; 
  if(DossierID<=1){
  if(this.uploader2.queue.length>0 && sommeSize2>2){
     await this._uploadService.CreerUnDossier(
      (this.ArticleForm.controls['des'].value),
      'Article',
      'les fichiers de cet article :'+this.ArticleForm.controls['des'].value,
      'rien'
      ).then(
         res=>{
           DossierID=+res;
           this.ArticleForm.patchValue({fichiers_dossier_id:DossierID});
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
/*
  this.articleService.submitArticle(this.ArticleForm.value,this.CaraForm).then(
    res=>console.log(res),
    err=>console.log(err)
  );
*/


//}




envoyer(){
  if(this.ArticeleID>0){
    this.articleService.EditArticle(this.ArticleForm.value,this.CaraForm,this.ArticeleID).then(
      res=>{
        console.log(res);
        this.LoadingReactBtn1=false;
              if(res.success){
                this.notification('success',res.msg, 3000);
                this.redirection(this.UrlToRedirection+this.ArticeleID);
                }else{
                this.notification('danger',res.msg, 5000);
                }
      },
      err=>console.log(err)
    );
    }else{
      this.articleService.submitArticle(this.ArticleForm.value,this.CaraForm).then(
        res=>{
          console.log(res);
          this.LoadingReactBtn1=false;
          if(res.success){
            this.ArticleForm.reset();
            this.uploadReset1();
            this.uploadReset2(); 
            this.ArticleForm.patchValue({exist:1,artTVA:0,imgs_dossier_id:1,fichiers_dossier_id:1});
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
  UrlToRedirection="/gmao/magasin/articles/article/";
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
 this.articleService.addoredit(this.form.value).then(
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

/*
async getFiles(){
    if(this.ArticeleID>0){

      console.log(this.ArticleForm.controls['imgs_dossier_id'].value,this.ArticleForm.controls['fichiers_dossier_id'].value);
      await this.articleService.getFiles(this.ArticleForm.controls['imgs_dossier_id'].value).then(
        res=>{
          this.files=res;
          if ( this.files.length>0 ) this.isFiles=true;
        },
        err=>console.log('AddFournisseurComponent:getFiles:' + err)
      );

      await this.articleService.getFiles(this.ArticleForm.controls['fichiers_dossier_id'].value).then(
        res=>{
          this.files2=res;
          if ( this.files2.length>0 ) this.isFiles2=true;
        },
        err=>console.log('AddFournisseurComponent:getFiles:' + err)
      );

    } 
}
*/
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

