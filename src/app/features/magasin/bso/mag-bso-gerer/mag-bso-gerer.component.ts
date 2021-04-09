import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/@pages/components/message/message.service';
import { MagBsoService } from '../../services/mag-bso.service';


@Component({
  selector: 'app-mag-bso-gerer',
  templateUrl: './mag-bso-gerer.component.html',
  styleUrls: ['./mag-bso-gerer.component.scss']
})
export class MagBsoGererComponent implements OnInit {
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
 
  //###############################

  BsoID:number=0;
  bso:any;
  bso_dets=<any>[];
  response_bso:any;
  response_bso_dets=<any>[];
  combined=<any>[];
  //bsoWithNullOtID:any;
  
  loaded=false;
  loading=false;

  Src='correctif';
  isData=true;

  isCorrectif=true;
  UseID:number=0;
  use:any;
  absobsodetid=0;


  constructor(private bsoService:MagBsoService,private _currentRoute: ActivatedRoute, private _router:Router
    ,private _notification: MessageService
    ,public dialogRef: MatDialogRef<MagBsoGererComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data

    ) { }

  ngOnInit() {
    var BsoID = +this._currentRoute.snapshot.paramMap.get('id');
    var Src = +this._currentRoute.snapshot.paramMap.get('src');

    if(!BsoID){
     BsoID=this.data.BsoID;
     Src=this.data.Src;
    }

    if(Src==2){this.Src='preventif'; this.isCorrectif=false;}
    if(BsoID>0){ this.BsoID=BsoID; this.getBsoWithResponse(BsoID,this.Src); }
  }

  getBsoWithResponse(BsoID:number,Src:string){  
    this.bsoService.getBsoWithResponse(BsoID,Src).then(
      res=>{
        console.log(res);

        this.bso=res.bso;
        if(this.bso==null){this.bso=res.bsoWithNullOtID};

        if(this.bso.statut=='ferme' || this.bso.statut=='ouvert'){
          this._router.navigate(['/']);
        }
        
        
        //this.bsoWithNullOtID=res.bsoWithNullOtID;
        this.bso_dets=res.bso_dets;
        this.response_bso=res.response_bso;
        this.response_bso_dets=res.response_bso_dets;
        this.combined=res.combined;
        this.UseID=res.UseID; 
        this.use=res.use; 
        this.loaded=true;
        
      },
      err=>console.log(err)
    );
   }

   termineUtilisation(BsoDetID:number){
     this.loading=true;
     this.absobsodetid=BsoDetID;
     this.bsoService.termineUtilisation(BsoDetID).then(
       res=>{  
         console.log(res);
         if(res==true){
            this.UpdateStatutTermine(BsoDetID); 

            if(this.testerifttesterminer()){
              this.dialogRef.close('ttesttermine');
            }
          }
         this.loading=false;
         this.absobsodetid=0;
        },
       err=>console.log(err)
     );

   }

   testerifttesterminer(){
     for(let i=0; i<this.combined.length;i++){
       if(this.combined[i].bso.statut=='enUtilisation'){ return false;}
     }
     return true;
   }


   terminerTous(){
    if(!this.LoadingReactBtn1){
      this.LoadingReactBtn1=true;
    
    this.bsoService.terminerTous(this.BsoID).then(
      res=>{
        
        //console.log(res);
        //this.LoadingReactBtn1=false;
        this.notification('success', "Tous article est términé .", 1500);
        //this.redirection(this.UrlToRedirection+this.BsoID+'/'+this.isCorrectifOuPreventif(this.isCorrectif));

        this.dialogRef.close('ttesttermine');


      },
      err=>console.log(err)
    );
    

   }
  }

   UpdateStatutTermine(BsoDetID:number){
     
     for(let i=0;i<this.combined.length;i++){
      if(this.combined[i].bso.BsoDetID==BsoDetID){
        this.combined[i].bso.statut='termine';
      }
     }
   }

   PouC(isCorrectif:boolean){
    if(isCorrectif==true){return "C";}
    if(isCorrectif==false){return "P";}
   }

   isRetourCoP(isCorrectif:boolean){
    if(isCorrectif==true){return 1;}
    if(isCorrectif==false){return 2;}
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
