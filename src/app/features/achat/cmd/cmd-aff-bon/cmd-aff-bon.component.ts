import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CmdService } from '../services/cmd.service';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../interfaces/article';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-cmd-aff-bon',
  templateUrl: './cmd-aff-bon.component.html',
  styleUrls: ['./cmd-aff-bon.component.scss']
})
export class CmdAffBonComponent implements OnInit {

//---------- breadcrumb ---------
 autres=[ 
  {url:'gmao/achat/cmd/bons/0',title:"Liste bons"}
];
breadcrumb=[
  {url:'gmao',title:'home'},
  {url:'gmao/achat',title:'achat'} ,
  {url:'gmao/achat/bon',title:'bon'} ,
  {url:'',title:'Affichage bon'}
];
lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
//###############################
BonID:number=0;
isData=false;
loaded=false;

  bon:any;
  bon_det=[];
  isDeleted=0;

  reception:any;
  receptiondet=[];
  receptiondetsomme=[];

  constructor(private cmdService:CmdService,private _currentRoute: ActivatedRoute
  ,private _notification: MessageService
  ,public dialogRef: MatDialogRef<CmdAffBonComponent>,@Optional() @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    /*
    let BonID = +this._currentRoute.snapshot.paramMap.get('id');
    if(BonID>0){ 
    this.getBon(BonID);
    }
    */

    let BonID = +this._currentRoute.snapshot.paramMap.get('id');
    if(BonID>0){
      this.BonID=BonID;
      this.getBon(BonID);
    }else{  
      BonID=this.data.BonID;
      if(BonID>0){
        this.isData=true;
        this.BonID=BonID;
        this.getBon(BonID);
      }
    }

  }

  getBon(BonID:number){
     this.cmdService.getBon(BonID).then(
       res=>{
         console.log(res);
         this.bon=res.bon;
         this.bon_det=res.bon_det;
         this.isDeleted=res.isDeleted;
         this.getReception(this.bon.cmd_rec_id);
        
       },
       err=>console.log('CmdAffBonComponent:getBon:',err)
     );
  }


  getReception(CmdRecID:number){
    this.cmdService.getReception(CmdRecID).then(
      res=>{
        console.log(res);
        this.reception=res.reception;
        this.receptiondet=res.reception_det;
        this.receptiondetsomme=this.somme();
        this.loaded=true;
      },
      err=>console.log('CmdAffBonComponent:getReception:',err)
    )
  }

  suprimerBon(){
    this.cmdService.suprimerBon(this.bon.BonID).then(
      res=>{
        console.log(res);
        if(res){ 
          this.notification('success', "Le bon # "+this.bon.BonID+" est supprimé avec succées .", 2000);
          this.dialogRef.close('delete');
       }
      },
      err=>console.log(err)
    );
  }


  somme(){
    let somme:Article[]=[];
    let sommeRet=[];
    for (var i = 0;  i<this.receptiondet.length; i++ ) {
     let article_id = this.receptiondet[i].ArticleID;
     if(somme[article_id]){
     somme[article_id].Des=this.receptiondet[i].des;
     somme[article_id].TTQteCmde+=this.receptiondet[i].QteCmde; 
     somme[article_id].TTQteRecu+=this.receptiondet[i].QteRecu;
     
     }else{

       somme[article_id]={Des:this.receptiondet[i].des,TTQteCmde:this.receptiondet[i].QteCmde,TTQteRecu:this.receptiondet[i].QteRecu};
     }
    }
    var j=0;
    for (var i = 0;  i<somme.length; i++ ) {
     if(somme[i]){
        let obj = {ArticleID:i,Des:somme[i].Des,TTQteCmde:somme[i].TTQteCmde,TTQteRecu:somme[i].TTQteRecu,open:0};
        sommeRet[j]=obj; j++; 
       } 
    }
    return sommeRet;
   }


   roundMath(value){ return (Math.round(value * 1000000)/1000000); }


   affPrixHT(ArticleID:number){
    for (var i = 0;  i<this.bon_det.length; i++ ) {
       if(ArticleID==this.bon_det[i].article_id){
         return this.bon_det[i].PrixHT;
       }
    }
   }

   affAnPrixHT(ArticleID:number){
    for (var i = 0;  i<this.bon_det.length; i++ ) {
      if(ArticleID==this.bon_det[i].article_id){
        return this.bon_det[i].AnPrixHT;
      }
   }
   }

   affQteBon(ArticleID:number){
    for (var i = 0;  i<this.bon_det.length; i++ ) {
      if(ArticleID==this.bon_det[i].article_id){
        return this.bon_det[i].QteBon;
      }
   }
   }

   PrxiTTHT(){
    let PrixTTHT=0;
    for (var i = 0;  i<this.bon_det.length; i++ ) {
      var PrixUnHT=this.bon_det[i].PrixHT;
      var qte=this.bon_det[i].QteBon;
        PrixTTHT=PrixTTHT+ ( PrixUnHT * qte ) ;
    }
    return PrixTTHT;
  }

  PrxiTTC(){
    return  this.PrxiTTHT() * ( 1 + ( this.reception.TVA/100) ) ;
  }

  diffirence(ArticleID:number){
    let qtebon=0;
    let qterec=0;
    for (var i = 0;  i<this.bon_det.length; i++ ) {
      if(ArticleID==this.bon_det[i].article_id){
        qtebon= this.bon_det[i].QteBon;
      }
   }
   
   for (var i = 0;  i<this.receptiondetsomme.length; i++ ) {
    if(ArticleID==this.receptiondetsomme[i].ArticleID){
      qterec=this.receptiondetsomme[i].TTQteRecu;
    }
   }

   return qtebon - qterec ; 

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
