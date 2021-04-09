import { Component, Inject, OnInit, Optional } from '@angular/core';
import { RetourService } from '../../services/retour.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-cmd-aff-retour',
  templateUrl: './cmd-aff-retour.component.html',
  styleUrls: ['./cmd-aff-retour.component.scss']
})
export class CmdAffRetourComponent implements OnInit {
    //---------- breadcrumb ---------
    autres=[ 
      {url:'gmao/achat/retour/retours/0',title:"Liste retours"}
    ];
    breadcrumb=[
      {url:'gmao',title:'home'},
      {url:'gmao/achat',title:'achat'} ,
      {url:'gmao/achat/retour',title:'retour'} ,
      {url:'',title:'Affichage retour'}
    ];
    lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
    //###############################
  RetourID:number=0;
  isData=false;
  loaded=false;
  
  Retour:any;
  RetourDet=[];
  isDeleted=1;
  
  constructor(private retourService:RetourService,private _currentRoute: ActivatedRoute
  ,private _notification: MessageService
  ,public dialogRef: MatDialogRef<CmdAffRetourComponent>,@Optional() @Inject(MAT_DIALOG_DATA) public data) { }
  
  ngOnInit(){
    let RetourID = +this._currentRoute.snapshot.paramMap.get('id');
    if(RetourID>0){
      this.RetourID=RetourID;
      this.getRetour(RetourID);
    }else{  
      RetourID=this.data.RetourID;
      if(RetourID>0){
        this.isData=true;
        this.RetourID=RetourID;
        this.getRetour(RetourID);
      }
    }
  }

  getRetour(RetourID:number){
    this.retourService.getRetour(RetourID).then(
      res=>{
       this.Retour=res.Retour;
       this.RetourDet=res.RetourDet;
       this.isDeleted=res.isDeleted;
       this.loaded=true;
      },
      err=>console.log(err)
    );
  }

  deleteRetour(){
    
    this.retourService.deleteRetour(this.Retour.RetourID).then(
      res=>{
        console.log(res);
        if(res){
          this.notification('success', "Le retour # "+this.Retour.RetourID+" est supprimé avec succées .", 2000);
           this.dialogRef.close('delete');
        }
      },
      err=>console.log(err)
    );
  }


// ------ Notification & Redirection  --------------

  //UrlToRedirection="/gmao/preventif/bonp/bonp/";
  redirection(url) {
    //this._router.navigate([url]);
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
