import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl , NgForm} from '@angular/forms';
import { FournisseurService } from '../services/fournisseur.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as errors from './errors';
import { FounisseurModeComponent } from '../founisseur-mode/founisseur-mode.component';
import { FounisseurSecteurComponent } from '../founisseur-secteur/founisseur-secteur.component';

import {FileUploader} from "ng2-file-upload"; 
import { UploadService } from 'src/app/shared/upload.service';
import {environment} from '../../../../environments/environment';


@Component({
  selector: 'app-add-fournisseur',
  templateUrl: './add-fournisseur.component.html',
  styleUrls: ['./add-fournisseur.component.scss']
})
export class AddFournisseurComponent implements OnInit {


  constructor(private _fournisseursService: FournisseurService, private _router: Router,
     private _route: ActivatedRoute, private _fb: FormBuilder,private _uploadService:UploadService,
     private matDialog: MatDialog ) { }
  
  id: number;
  private sub: any;
  private sub2: any;
  secteurs=<any>[];
  modes=<any>[];
  form: FormGroup;
  formErrors = errors.formErrors;
  validationMessages = errors.validationMessages;

  files=<any>[];
  isFiles=false;
  publicFolder=environment.publicFolder;
  uploadForm: FormGroup;
  progress = { loaded : 0 , total : 1 };
  loadingIsStart=false;
  nbOfFiles:number=0;
  actualFileNameUpload="";
  nbOfFileUploaded=0;
  //progressLoaded = 0;
  //progressTotal = 1;

  ngOnInit() {
   
    this.getSecteurs();
    this.getModes();
    this.onInitForm();
    this.onInitUploadForm();
    this.sub = this._route.params.subscribe(params => { this.id = +params['id']; });
    if (this.id) { 
      this.getFournisseur(); 
      //this.getFiles();
    }

  }
  

   async onSubmit() {
    
     if(this.form.valid){
     
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
          (this.form.controls['nom'].value),
          'Fournisseur',
          'les fichiers de fournisseur :'+this.form.controls['nom'].value,
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

    
     this._fournisseursService.addoredit(this.form.value).then(
     res => { 
       console.log(res);
       //this._router.navigate(['/achat/fournisseurs/all']);
       },
     err => console.log('AddFournisseurComponent:onSubmit:' + JSON.stringify(err) )
    )
    }else{
      Object.keys(this.form.controls).forEach(key => { this.form.controls[key].markAsDirty();  } )
      this.form.controls['nom'].setValue(this.form.controls['nom'].value);
    }

  }
  




 async  getFournisseur() {
    await this._fournisseursService.getFournisseur(this.id).then(res => {
      this.form.setValue(res);
      this.getFiles();
    })
  }

  async getSecteurs(res?){
    await this._fournisseursService.getSecteurs().then(
      res=>this.secteurs=res ,
      err=>console.log('AddFournisseurComponent:getSecteurs:' + err)
    )
    if(res=='fromSubmit'){this.patchLastValueSecteur(res); }
  }

  async getModes(res?){ 
    await this._fournisseursService.getModes().then(
      res=>this.modes=res ,
      err=>console.log('AddFournisseurComponent:getModes:' + err)
    )
    if(res=='fromSubmit'){this.patchLastValueMode(res); }
  }

async getFiles(){
  console.log('getFiles:'+JSON.stringify(this.form.value));
    if(this.id){

      console.log('this.form.controls[dossier_id].value = '+this.form.controls['dossier_id'].value);
      await this._fournisseursService.getFiles(this.form.controls['dossier_id'].value).then(
        res=>{
          console.log(JSON.stringify(res));
          this.files=res;
          if ( this.files.length>0 ) this.isFiles=true;
        },
        err=>console.log('AddFournisseurComponent:getFiles:' + err)
      )
    } 
}

removeFile(id:number,i:number){
  const dialogRef = this.matDialog.open(Confirmation, {});
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

  ngOnDestroy() { this.sub.unsubscribe(); this.sub2.unsubscribe(); }

  onInitForm() {
    this.form = this._fb.group({
      id: [''],
      nom: ['', Validators.required],
      livmode_id: ['', Validators.required],
      secteur_id: ['', Validators.required],
      TVA: ['', [Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)] ],
      ref: [''], abr: [''],
      adresse: [''],
      tel1: ['', [Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)] ],
      tel2: ['',Validators.pattern(/^-?(0|[1-9]\d*)?$/)], portable1: ['',Validators.pattern(/^-?(0|[1-9]\d*)?$/)], portable2: ['',Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      fax1: ['',Validators.pattern(/^-?(0|[1-9]\d*)?$/)], fax2: ['',Validators.pattern(/^-?(0|[1-9]\d*)?$/)], email1: ['',Validators.email], email2: ['',Validators.email],
      siteweb: [''], fraisliv: [''], autresfrais: [''], remise: [''],
      cond_regl: [''], remarques: [''], dossier_id: [1], created_at: [''], updated_at: ['']
    });

    this.sub2=this.form.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.form);
    });

  }

  onInitUploadForm() {
  this.uploadForm = this._fb.group({
    document: [null],type:[''],OriginaleName:[''],BDName:[''],size:[''],extention:['']
  });
}
    

  resetForm(){ this.form.reset();}


  openModeDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "500px";
    dialogConfig.data="dialog";
    this.matDialog.open(FounisseurModeComponent, dialogConfig)
    .afterClosed().subscribe( res=> { this.getModes(res); });
  }

  openSecteurDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "500px";
    dialogConfig.data="dialog";
    this.matDialog.open(FounisseurSecteurComponent, dialogConfig)
    .afterClosed().subscribe( res=> { this.getSecteurs(res); });
  }


  patchLastValueSecteur(res){
    if(res=="fromSubmit"){ this.form.get('secteur_id').setValue(this.secteurs[this.secteurs.length-1].id); }
    //else{console.log('ne faire rien');}
  }

  patchLastValueMode(res){
    if(res=="fromSubmit"){ this.form.get('livmode_id').setValue(this.modes[this.modes.length-1].id); }
    //else{console.log('ne faire rien');}
  }

//========================> Upload 

public uploader:FileUploader = new FileUploader({
  isHTML5: true
});
title: string = 'Angular File Upload';
myFiles= [];

  async uploadFile(sommeSize:number,name:string,DossierID:number){ 
    this.loadingIsStart=true;
    await this._uploadService
   /*
   .uploadFile(toFormData(this.uploadForm.value)).then(
   res=>console.log('uploadFile res : '+res),
   err=>console.log('uploadFile err : '+err)
   );
   */

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




}


@Component({
  selector: 'confirmation',
  template:  ` 
  vous voulez vraiment suprimer ... <br>
  <button (click)="confirmer()">Confirmer</button>
  <button (click)="annuler()">Annuler</button>
  `,
})
export class Confirmation {
  constructor(
    public dialogRef: MatDialogRef<Confirmation>,
    @Inject(MAT_DIALOG_DATA) public data) {}

    confirmer(): void {this.dialogRef.close(1); }
    annuler(): void {this.dialogRef.close(0); }

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