import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MagBsoService } from '../../services/mag-bso.service';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DumpReasonComponent } from 'src/app/shared/dumps/dump-reason/dump-reason.component';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-mag-bso-accepter',
  templateUrl: './mag-bso-accepter.component.html',
  styleUrls: ['./mag-bso-accepter.component.scss']
})
export class MagBsoAccepterComponent implements OnInit {

  @ViewChild('message',{static:false}) message:ElementRef;


    //---------- breadcrumb ---------
    autres=[ 
      {url:'gmao/magasin/bso/bsos',title:'Liste Bsos'}
      ];
    breadcrumb = [
      { url: 'gmao', title: 'home' },
      { url: 'gmao/correctif', title: 'magasin' },
      { url: 'gmao/correctif/bso', title: 'bso' },
      { url: '#', title: 'Accepter Bso' }
    ];
    LoadingReactBtn1=false;
    LoadingReactBtn2=false;
    ReactBtn=false;
    PageRetourLoaded=false;
    //###############################

  BsoID:number=0;
  bso:any;
  bso_det=<any>[];
  array=<any>[];
  loaded:boolean=false;

  Src='correctif';
  isCorrectif=true;

  isData=true;
  
  constructor(private _currentRoute: ActivatedRoute,private magBsoService:MagBsoService,private dialog: MatDialog
             ,private _router:Router
             , private _notification: MessageService
             ,public dialogRef: MatDialogRef<MagBsoAccepterComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data

             ) { }

  ngOnInit() {
    var BsoID = +this._currentRoute.snapshot.paramMap.get('id');
    var Src = +this._currentRoute.snapshot.paramMap.get('src');
    if(!BsoID){
      BsoID=this.data.BsoID;
      Src=+this.data.Src;
    }
    if(Src==2){this.Src='preventif'; this.isCorrectif=false;}
    if(BsoID>0){ this.BsoID=BsoID; this.getBso(BsoID,this.Src); }
  }
  
  
  getBso(BsoID:number,Src:string){  
   this.magBsoService.getBso(BsoID,Src).then(
     res=>{
      console.log(res);
      
      if(res.bso==null){
        this._router.navigate(['/']);
      }else if(res.bso.statut!='ouvert'){
        this._router.navigate(['/']);
      }

       this.bso=res.bso;
      
       this.bso_det=res.bso_det;
       this.addFormControl();
       
       this.loaded=true;
     },
     err=>console.log(err)
   );
  }

  addFormControl(){
    for (let i = 0; i < this.bso_det.length; i++) {  
        let TrueOrFalse=true;
        if(this.bso_det[i].reserve==1){TrueOrFalse=false;}
        this.bso_det[i]['formControl'] = new FormControl(TrueOrFalse);
    }
  }

  submit(){
    let message=this.message.nativeElement.value;

    
    if(!this.LoadingReactBtn1){
      this.LoadingReactBtn1=true;

     
     this.ResultArray();
     this.magBsoService.acceptBso(this.BsoID,message,this.array).then(
       res=>{
         //console.log(res);
         this.notification('success', "Bso est envoyée avec success.", 1500);
         //this.redirection(this.UrlToRedirection+this.BsoID+'/'+this.isCorrectifOuPreventif(this.isCorrectif));
         
         this.dialogRef.close(this.BsoID);
      },
       err=>console.log(err)
     );
     


  }
  

}
  

  ResultArray(){
    for (let i = 0; i < this.bso_det.length; i++) {
      let obj = {
        BsoDetID:this.bso_det[i].BsoDetID, //777
        bool:this.bso_det[i].formControl.value
      };
      this.array.push(obj);
    }
  }


  isNumber(value: string | number): boolean
  {
     return ((value != null) &&
             (value !== '') &&
             !isNaN(Number(value.toString())));
   }

   isRetourCoP(isCorrectif:boolean){
    if(isCorrectif==true){return 1;}
    if(isCorrectif==false){return 2;}
   }

   PouC(isCorrectif:boolean){
    if(isCorrectif==true){return "C";}
    if(isCorrectif==false){return "P";}
   }

   isCorrectifOuPreventif(isCorrectif:boolean){
      if(isCorrectif==true){return 'correctif';}
      if(isCorrectif==false){return 'preventif';}
   }
   

    
 // ------ Notification & Redirection  --------------
 UrlToRedirection="/gmao/magasin/bso/aff/";//10/2

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