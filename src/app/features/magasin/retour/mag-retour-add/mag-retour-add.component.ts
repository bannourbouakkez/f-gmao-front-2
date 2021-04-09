import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MagRetourService } from '../../services/mag-retour.service';
import { FormControl } from '@angular/forms';
import { MessageService } from 'src/app/@pages/components/message/message.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-mag-retour-add',
  templateUrl: './mag-retour-add.component.html',
  styleUrls: ['./mag-retour-add.component.scss']
})
export class MagRetourAddComponent implements OnInit {

  RetourID=0;
  //---------- breadcrumb ---------
  autres=[ 
   //{url:'gmao/correctif/di/dis',title:'Liste DIs'}
   ];
 breadcrumb = [
   { url: 'gmao', title: 'home' },
   { url: 'gmao/magasin', title: 'magasin' },
   { url: 'gmao/magasin/retour', title: 'retour' },
   { url: '#', title: this.AjouterOuModifier(this.RetourID)+' Retour' }
 ];
 LoadingReactBtn1=false;
 AjouterOuModifier(bool){
   if(bool){return 'Modifier';}
   else{ return 'Repondre';}
 }
 PageRetourLoaded=false;
 //###############################

  retour:any;
  retour_dets=<any>[];
  retours_TS=<any>[];

  Src='correctif';
  isCorrectif=true;
  isData=true;



  constructor(private _currentRoute: ActivatedRoute,private magRetourService:MagRetourService
    , private _notification: MessageService,private _router:Router
    ,public dialogRef: MatDialogRef<MagRetourAddComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data) { }
    


  ngOnInit() {
    var RetourID = +this._currentRoute.snapshot.paramMap.get('id');
    var Src = +this._currentRoute.snapshot.paramMap.get('src');

    if(!RetourID){
      RetourID=this.data.RetourID;
      Src=+this.data.Src;
    }

    if(Src==2){this.Src='preventif';}
    this.getRetour(RetourID,this.Src);
    
  }

  getRetour(RetourID:number,Src:string){
    this.magRetourService.getRetour(RetourID,Src).then(
      res=>{
        console.log(res);
        this.isCorrectif=res.isCorrectif;
        this.RetourID=RetourID;
        this.retour=res.retour;
        this.retour_dets=res.retour_det;
        //console.log(res); 
        if(this.retour.statut=='enAttente'){
        for (let i = 0; i < this.retour_dets.length; i++) {
              this.retour_dets[i]['formControl'] = new FormControl(this.retour_dets[i].qtear);
        }
        }
        if(this.retour.statut!='enAttente'){
          for (let i = 0; i < this.retour_dets.length; i++) {
                this.retour_dets[i]['formControl'] = new FormControl(this.retour_dets[i].qter);
          }
        }

        this.PageRetourLoaded=true;
      }
    );
  }

  submit(){
   
  
  if(this.isValide()){
    if(!this.LoadingReactBtn1){
      this.LoadingReactBtn1=true;
    this.newArray();
    this.magRetourService.addRetour(this.RetourID,this.retours_TS,this.Src).then(
      res=>{
        console.log(res);
        this.notification('success', "Retour est modifié avec success.", 1500);
        //this.redirection(this.UrlToRedirection+this.RetourID+'/'+this.isRetourCoP(this.isCorrectif));
        this.dialogRef.close('envoyer');
      },
      err=>console.log()
    );
   }
  }
  


}

  newArray(){
    for (let i = 0; i < this.retour_dets.length; i++) {
     if(this.isNumber(this.retour_dets[i].formControl.value)){
      let obj = {
        article_id:this.retour_dets[i].article_id,
        qter:this.retour_dets[i].formControl.value
         };
      this.retours_TS.push(obj);
     }
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

 CoP(isCorrectif:boolean){
  if(isCorrectif==true){return "C";}
  if(isCorrectif==false){return "P";}
 }

 SrcToNumber(){
  if(this.Src=='correctif'){ return 1;}
  if(this.Src=='preventif'){ return 2;}
 }


 isValide(){
  for (let i = 0; i < this.retour_dets.length; i++) {  
    let qtear=this.retour_dets[i]['formControl'].value;
    if(qtear==null || qtear==undefined || !this.isNumber(qtear) ){return false;}
  }
  return true;
}





 // ------ Notification & Redirection  --------------
 UrlToRedirection="/gmao/magasin/retour/retour/";//10/2

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
