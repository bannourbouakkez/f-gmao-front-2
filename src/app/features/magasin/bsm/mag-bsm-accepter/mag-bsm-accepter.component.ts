import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MagBsmService } from '../../services/mag-bsm.service';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DumpReasonComponent } from 'src/app/shared/dumps/dump-reason/dump-reason.component';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-mag-bsm-accepter',
  templateUrl: './mag-bsm-accepter.component.html',
  styleUrls: ['./mag-bsm-accepter.component.scss']
})
export class MagBsmAccepterComponent implements OnInit {

    //---------- breadcrumb ---------
    autres=[ 
      {url:'gmao/magasin/bsm/bsms',title:'Liste Bsms'}
      ];
    breadcrumb = [
      { url: 'gmao', title: 'home' },
      { url: 'gmao/correctif', title: 'magasin' },
      { url: 'gmao/correctif/bsm', title: 'bsm' },
      { url: '#', title: 'Accepter Bsm' }
    ];
    LoadingReactBtn1=false;
    LoadingReactBtn2=false;
    ReactBtn=false;
    PageRetourLoaded=false;
    //###############################
    
  BsmID:number=0;
  bsm:any;
  bsm_det=<any>[];
  array=<any>[];
  loaded:boolean=false;
  Src='correctif';
  isCorrectif=true;

  isData=true;

  constructor(private _currentRoute: ActivatedRoute,private magBsmService:MagBsmService,private dialog: MatDialog
    ,private _router:Router
    , private _notification: MessageService
    ,public dialogRef: MatDialogRef<MagBsmAccepterComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data) { }
  
  ngOnInit() {
    var BsmID = +this._currentRoute.snapshot.paramMap.get('id');
    var Src = +this._currentRoute.snapshot.paramMap.get('src');
    if(!BsmID){
      BsmID=this.data.BsmID;
      Src=+this.data.Src;
    }
    if(Src==2){this.Src='preventif'; this.isCorrectif=false;}
    if(BsmID>0){ this.BsmID=BsmID; this.getBsm(BsmID,this.Src); }

  }


  getBsm(BsmID:number,Src:string){  
   this.magBsmService.getBsm(BsmID,Src).then(
     res=>{
       //console.log(res);
       
       if(res.bsm.statut=='accepted' || res.bsm.statut=='refused'){
        this._router.navigate(['/index']);
       }
       
       this.bsm=res.bsm;
       this.bsm_det=res.bsm_det;
       this.addFormControl();
       this.loaded=true;
     },
     err=>console.log(err)
   );
  }


  addFormControl(){
    for (let i = 0; i < this.bsm_det.length; i++) {  
      this.bsm_det[i]['formControl'] = new FormControl(this.bsm_det[i].qte);
    }
  }

  submit(AcceptedOrRefused:string){

    if(true){
      
     

    let isRefused=false;
    let Reason='';
    if(AcceptedOrRefused=='refused'){
      
      
                
      isRefused=true;
      const dialogRef = this.dialog.open(DumpReasonComponent, {width: '500px' });
      dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(result.envoyer){
        
          if(!this.LoadingReactBtn2 && !this.ReactBtn){
            this.LoadingReactBtn2=true;
            this.ReactBtn=true;
            console.log('refusedddddddd');

        Reason=result.message;
        this.magBsmService.acceptBsm(this.BsmID,isRefused,Reason,[],this.Src).then(
          res=>{
            console.log(res);
            this.notification('success', "Bsm est envoyée avec success.", 1500);
            //this.redirection(this.UrlToRedirection+this.BsmID+'/'+this.isCorrectifOuPreventif(this.isCorrectif));
            this.dialogRef.close('refused');
          },
          err=>console.log(err)
        );

      }
    }
  }
    });
  
    }else{
      if(!this.LoadingReactBtn1 && !this.ReactBtn){
        this.LoadingReactBtn1=true;
        this.ReactBtn=true;
        
        console.log('accccccepted');
     this.ResultArray();
     this.magBsmService.acceptBsm(this.BsmID,isRefused,Reason,this.array,this.Src).then(
       res=>{
         console.log(res);
         this.notification('success', "Bsm est envoyée avec success.", 1500);
         //this.redirection(this.UrlToRedirection+this.BsmID+'/'+this.isCorrectifOuPreventif(this.isCorrectif));
         this.dialogRef.close('accepted');

      },
       err=>console.log(err)
     );
    }
    
    }
  
}
}

  
  ResultArray(){
    for (let i = 0; i < this.bsm_det.length; i++) {
     if(this.isNumber(this.bsm_det[i].formControl.value)){
      let obj = {
        BsmDetID:this.bsm_det[i].BsmDetID, 
        qte:this.bsm_det[i].formControl.value
      };
      this.array.push(obj);
     }
    }
  }

  isRefused(){
    for (let i = 0; i < this.bsm_det.length; i++) {  
      let qte=this.bsm_det[i]['formControl'].value;
      if(qte>0){return false;}
    }
    return true;
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
  if(isCorrectif){return 'correctif';}
  if(!isCorrectif){return 'preventif';}
 }
 

 
 // ------ Notification & Redirection  --------------
 UrlToRedirection="/gmao/magasin/bsm/aff/";//10/2

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