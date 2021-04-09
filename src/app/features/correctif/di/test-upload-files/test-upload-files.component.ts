import { Component, Input, OnInit , Output , EventEmitter} from '@angular/core';
import { UploadService } from 'src/app/shared/upload.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-test-upload-files',
  templateUrl: './test-upload-files.component.html',
  styleUrls: ['./test-upload-files.component.scss']
})
export class TestUploadFilesComponent implements OnInit {

  /*
  @Output() action: EventEmitter<any> = new EventEmitter<any>();
  //Action(date){this.action.emit(date);}
  */
 IsActualFileUploadedTotally=false;
 IsAllFileUploadedTotally=false;
 //iupload=0;
 //nbFileExist=0;
 iloaded=0;
 AllFileIsLoaded=false;
 
 @Input() InputIDComp:number=0;  
 @Input() InputID:number;  
 @Input() InputDossierID:number;
 @Input() UploadOrder:boolean;
 @Input() InputGetFiles:boolean;
 @Input() ResetUplaodComp:boolean;
 @Input() InputType:string; // ajouter // affichage // modifier
          
 

 
 
 
 @Output() ActionDossierID: EventEmitter<any> = new EventEmitter<any>();
 @Output() ActionUpload: EventEmitter<any> = new EventEmitter<any>();


 getFileLoading=false;
  
 
 
  JustFirstTime=true;

  constructor(private _uploadService:UploadService,private fb: FormBuilder) { }

  ngOnInit() {
    this.onInitUploadForm();
  }

  ngOnChanges(){
    if(this.UploadOrder && this.JustFirstTime){
      this.onSubmitAfterUpload();
      this.JustFirstTime=false;
    }
    if(this.InputGetFiles){
       if(!this.AllFileIsLoaded && !this.UploadOrder){
       this.getFiles();
       }
    }
    if(this.ResetUplaodComp){
    
     this.uploadForm.reset();
     this.onInitUploadForm();
     this.JustFirstTime=true;
     this.InputGetFiles=false;
     this.UploadOrder=false;
     this.myFiles= [];
this.files=<any>[];
  this.isFiles=false;
  //this.publicFolder=environment.publicFolder;
  //uploadForm: FormGroup;
  this.progress = { loaded : 0 , total : 1 };
  this.loadingIsStart=false;
  this.nbOfFiles=0;
  this.actualFileNameUpload="";
  this.nbOfFileUploaded=1;
  
 //this.ngOnInit();
    }
  }




  
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

  NewToTaleSize=1;
  ActualSizeUploaded=0;

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
   
   //progress
   .uploadFile(toFormData(this.uploadForm.value),DossierID)
   .subscribe(
     (data: any) => { 
       console.log(data);   
       //this.dataloadedbefore=0;
       if(data.type == 1 && data.loaded && data.total){

        this.ActualSizeUploaded+=data.loaded - this.progress.loaded ;

         this.progress.loaded = data.loaded;
         this.progress.total = data.total;
         this.actualFileNameUpload=name;
      
         //this.dataloadedafter=data.loaded;
         

       }
       else if(data.body){
        
        this.nbOfFileUploaded=this.nbOfFileUploaded+1;
        this.progress= { loaded : 0 , total : 1 };
        this.IsActualFileUploadedTotally=true;
        //this.iupload=this.iupload+1;
        console.log('upload single file kémlét ');
        this.iloaded=this.iloaded+1;
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

    /*
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
     */

      this._uploadService.removeFile(id).then(
        res=>{
          //console.log(res);
          if(res==1){
            this.files.splice(i, 1);
          }
        },
        err=>console.log(err)
      );
/*
    }
  });
*/

  }

  async getFiles(){
    //console.log('getFiles:'+JSON.stringify(this.form.value));
      console.log('get files');
      if(this.InputID){
        this.getFileLoading=true;
        //console.log('this.form.controls[dossier_id].value = '+this.form.controls['dossier_id'].value);
        await this._uploadService.getFiles(this.InputDossierID).then(
          res=>{
            //console.log(JSON.stringify(res));
            
            this.files=res;
            if ( this.files.length>0 ){this.isFiles=true;}
            this.getFileLoading=false;
          },
          err=>console.log(err)
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

      this.NewToTaleSize+=fileItem.size;

      nbFiles=nbFiles+1;
      //this.nbFileExist=nbFiles;
      if(fileItem.size > 100000000){ 
        alert("Each File should be less than 100 MB of size.");
        return;
      }
    }

    var DossierID=+this.InputDossierID;
    if(DossierID<=1){
      console.log('d5al <=1');
    if(this.uploader.queue.length>0 && sommeSize>2){
      console.log('d5al '+this.uploader.queue.length+'>0 && '+sommeSize+'>2');
       await this._uploadService.CreerUnDossier(
        (this.InputID),
        'di',
        'les fichiers de di :'+this.InputID,
        'rien'
        ).then(
           res=>{
             console.log('DossierID=+res : '+res)
             DossierID=+res;
             
             this.PatchValueDossierID(DossierID); // this.form.patchValue({dossier_id:DossierID});

            // console.log();
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
     
      /*
      for  (let j = 0; j < this.uploader.queue.length; j++) {
      let fileItem = this.uploader.queue[j]._file;
       // data.append('file', fileItem);
       this.uploadForm.patchValue({document:fileItem });
       this.uploadForm.patchValue({size:fileItem.size });
       await this.uploadFile(sommeSize,fileItem.name,DossierID); 
      }
      */

      var index=0;
      var queueLength=this.uploader.queue.length;
      this.IsActualFileUploadedTotally=false;
      while(index<queueLength){
        let fileItem = this.uploader.queue[index]._file;
        this.uploadForm.patchValue({document:fileItem });
        this.uploadForm.patchValue({size:fileItem.size });
        await this.uploadFile(sommeSize,fileItem.name,DossierID); 
        //myLoop();
        //this.troiscentsms();
        
        while(this.IsActualFileUploadedTotally==false){
           await this.delay(300);
        }

        console.log('while index:'+index);

        this.IsActualFileUploadedTotally=false;
        index=index+1;
      }

    //this.IsActualFileUploadedTotally=true;

    if(!this.InputID){
    this.uploader.clearQueue();
    }
    
    this.AllFileIsLoaded=true;
    
    }

    //console.log(this.form.value);

    this.ExecuteFunction(); //this.addoreditDi(this.form.value,this.DiID);
  

  }

  
  
  PatchValueDossierID(DossierID){
    this.ActionDossierID.emit(DossierID);
  }
  ExecuteFunction(){
    this.ActionUpload.emit(true);
  }

 delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

  /*
  async troiscentsms(){
    if(!this.IsActualFileUploadedTotally){
    await setTimeout(function() {   
        console.log('300 ms');
        this.troiscentsms();
    }, 300);
    }else{
      console.log('5rajjj');
    }

  }
*/
/*
   troiscentsms() {
    if (!this.IsActualFileUploadedTotally) {
      console.log('300 ms');
      setTimeout(this.troiscentsms, 300);
    }else{
      console.log('5rajjjj');
    }
  }
  */


  



  
  extention(fileName){
  if(fileName){
  var ext = fileName.substr(fileName.lastIndexOf('.') + 1);
  //console.log(ext);
  return ext;
  }else{
    return null;
  }
  }

  imagefile(filename:any){
  if(filename){
    let extention = this.extention(filename);
   if(extention=='txt'){ return "/assets/img/ext/txt.png";}
   else if(extention=='pdf'){ return "/assets/img/ext/pdf.png";}
   else if(extention=='doc' || extention=='docx' ){ return "/assets/img/ext/doc.png";}
   else if(extention=='ppt' || extention=='pptm' || extention=='pptx' ){ return "/assets/img/ext/ppt.png";}
   else if(extention=='zip' || extention=='rar'){ return "/assets/img/ext/zip.png";}
   else if(extention=='mp4' || extention=='avi' || extention=='flv' || extention=='mov' 
        || extention=='wmv' || extention=='m4p' || extention=='m4v' || extention=='mpg'
        || extention=='mpeg' || extention=='m2v' || extention=='svi' || extention=='3gp'
        || extention=='3g2' || extention=='f4v' || extention=='f4b' || extention=='f4a'
        || extention=='f4p' || extention=='nsv' || extention=='rm' || extention=='gifv'
        || extention=='m4a' 
        ){ return "/assets/img/ext/mp4.png";}
   else { return "/assets/img/ext/file.png" ;}
  }else{
    return null; 
  }
  }

  isImage(filename:string){
    let extention =this.extention(filename);
    if ( extention=='jpg'
      || extention=='png'
      || extention=='jpeg'
      //|| extention=='jfif'
      //|| extention=='exif'
      || extention=='gif'
      || extention=='bmp'
      /*|| extention=='ppm'
      || extention=='pgm'
      || extention=='pbm'
      || extention=='pnm'
      *
      || extention=='webp'
      || extention=='hdr'
      || extention=='heif'
      || extention=='bat'
      */
    ) return true;
    else return false;
  }

  rienafaire(){
    
  }

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

/*
function myLoop() {
  setTimeout(function() {   
    if (!this.IsActualFileUploadedTotally) {
      console.log('loop:'+!this.IsActualFileUploadedTotally);
      myLoop();         
    }else{
      console.log('5raj m loop');
    }                
  }, 200);
}
*/


