import { Component, OnInit } from '@angular/core';
import { CmdService } from '../services/cmd.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ArticlePrixHT } from '../interfaces/articlePrixHT';
import { MessageService } from 'src/app/@pages/components/message/message.service';

@Component({
  selector: 'app-cmd-add-bon',
  templateUrl: './cmd-add-bon.component.html',
  styleUrls: ['./cmd-add-bon.component.scss']
})
export class CmdAddBonComponent implements OnInit {
 //---------- breadcrumb ---------
 autres=[ 
  {url:'gmao/achat/cmd/bons/0',title:'Liste bons'}
  ,{url:'gmao/achat/cmd/receptions/liste',title:'Liste receptions'}
];
breadcrumb=[
  {url:'gmao',title:'home'},
  {url:'gmao/achat',title:'achat'} ,
  {url:'gmao/achat/Bon',title:'Bon'},
  {url:'',title:'Bon'}
];
lastbreadcrumb(){return this.breadcrumb[this.breadcrumb.length-1].title;}
LoadingReactBtn1=false;
pageLoaded=false;
//###############################

  reception;
  receptiondet=[];
  ArrArticleIDAnPrixHT=<any>[];
  receptiondetOriginal=[];
  receptiondetsomme=[];
  receptiondetsommeOriginal=[];
  newReceptiondet=[];
  
  constructor(private cmdService:CmdService,private _currentRoute: ActivatedRoute,private _router: Router 
    ,private _notification: MessageService) { }
  
  
  ngOnInit() {
    let CmdRecID = +this._currentRoute.snapshot.paramMap.get('id');
    if(CmdRecID>0){ this.getReception(CmdRecID); }
  }
  
  getReception(CmdRecID:number){
    this.cmdService.getReception(CmdRecID).then(
      res=>{
        this.reception=res.reception;
        this.receptiondet=res.reception_det;
        this.ArrArticleIDAnPrixHT=res.ArrArticleIDAnPrixHT;
        this.receptiondetOriginal = JSON.parse(JSON.stringify( this.receptiondet ));
        this.receptiondetsomme=this.somme();
        this.receptiondetsommeOriginal=JSON.parse(JSON.stringify( this.receptiondetsomme ));

        for (let i = 0; i < this.receptiondetsomme.length; i++) {  
          this.receptiondetsomme[i]['formControl'] = new FormControl(0);
          this.receptiondetsomme[i]['formControlPrixHT'] = new FormControl(0);
        }

        this.pageLoaded=true;

        console.log(res);
        console.log('this.receptiondetsomme: '+JSON.stringify(this.receptiondetsomme));
      },
      err=>console.log('CmdAddBonComponent:getReception:',err)
    )
  }

  submit(){
    if(this.valideBon()){
      if(!this.LoadingReactBtn1){
      this.newArray();
      this.addBon();
     // console.log(this.newReceptiondet);
      this.newReceptiondet=[];
      // Navigate .. 
    }
    }else{
      this.notification('danger',"Formulaire pas valide .", 1500); 
      this.newReceptiondet=[];
    }
  }
  
  addBon(){
    this.LoadingReactBtn1=true;
   let body={BonDet:this.newReceptiondet}
   this.cmdService.addBon(this.reception.CmdRecID,body).then(
     res=>{

      if(res.success){
        this.notification('success',res.msg, 1500);
        this.redirection(this.UrlToRedirection+res.BonID);
        }else{
          this.notification('danger',res.msg, 2000);
        }

       console.log(res);
      },
     err=>console.log('CmdAddBonComponent:addBon:',err)
   );
  }

  newArray(){
    for (let i = 0; i < this.receptiondetsomme.length; i++) {
     if(this.isNumber(this.receptiondetsomme[i].formControl.value)){
      let obj = {
        ArticleID:this.receptiondetsomme[i].ArticleID,
        PrixHT:this.receptiondetsomme[i].formControlPrixHT.value,
        QteBon:this.receptiondetsomme[i].formControl.value
         };
      this.newReceptiondet.push(obj);
     }
    }
  }


  somme(){
    let somme:ArticlePrixHT[]=[];
    let sommeRet=[];
    for (var i = 0;  i<this.receptiondet.length; i++ ) {
     let article_id = this.receptiondet[i].ArticleID;
     if(somme[article_id]){
     somme[article_id].Des=this.receptiondet[i].des;
     somme[article_id].PrixHT=this.receptiondet[i].PrixHT;
     somme[article_id].TTQteCmde+=this.receptiondet[i].QteCmde; console.log(this.receptiondet[i].QteCmde);
     somme[article_id].TTQteRecu+=this.receptiondet[i].QteRecu;
     }else{
      console.log(this.receptiondet[i].QteCmde);
       somme[article_id]={Des:this.receptiondet[i].des,TTQteCmde:this.receptiondet[i].QteCmde,TTQteRecu:this.receptiondet[i].QteRecu,PrixHT:this.receptiondet[i].PrixHT};
     }
    }
    var j=0;
    for (var i = 0;  i<somme.length; i++ ) {
     if(somme[i]){
        let obj = {ArticleID:i,Des:somme[i].Des,TTQteCmde:somme[i].TTQteCmde,TTQteRecu:somme[i].TTQteRecu,PrixHT:somme[i].PrixHT,open:0};
        sommeRet[j]=obj; j++; 
       } 
    }
    return sommeRet;
   }

   GetAnPrixHTByArticleID(ArticleID:number){
    for (var i = 0;  i<this.ArrArticleIDAnPrixHT.length; i++ ) {
     if(this.ArrArticleIDAnPrixHT[i].ArticleID == ArticleID){
       return this.ArrArticleIDAnPrixHT[i].AnPrixHT;
     }
    }
    
   }

   

   roundMath(value){ return (Math.round(value * 1000000)/1000000); }



    isNumber(value: string | number): boolean
    {
       return ((value != null) &&
               (value !== '') &&
               !isNaN(Number(value.toString())));
     }

  
    valideBon(){ 
      var isValid=true;
      for (var i = 0;  i<this.receptiondetsomme.length; i++ ) {
        var inputValue=this.receptiondetsomme[i].formControl.value;
        if(!this.isNumber(inputValue)){isValid=false;}
        if( inputValue<0 ){isValid=false;}
      }
      return isValid;
    }


    remiseAZero(){
      for (let i = 0; i < this.receptiondetsomme.length; i++) { 
         this.receptiondetsomme[i].formControl.setValue(0);
        }
    }

    remiseAZeroPrix(){
      for (let i = 0; i < this.receptiondetsomme.length; i++) { 
         this.receptiondetsomme[i].formControlPrixHT.setValue(0);
        }
    }


    CompletAll(){
      for (let i = 0; i < this.receptiondetsomme.length; i++) {
         this.receptiondetsomme[i].formControl.setValue(this.roundMath(this.receptiondetsomme[i].TTQteRecu));
        }
    }

    CompletPrice(){
      for (let i = 0; i < this.receptiondetsomme.length; i++) {
           this.receptiondetsomme[i].formControlPrixHT.setValue(this.receptiondetsomme[i].PrixHT);
      }
    }

    PrxiTTHT(){
      let PrixTTHT=0;
      for (var i = 0;  i<this.receptiondetsomme.length; i++ ) {
        var PrixUnHT=this.receptiondetsomme[i].formControlPrixHT.value;
        var qte=this.receptiondetsomme[i].formControl.value;
        if(this.isNumber(PrixUnHT) && this.isNumber(qte) ){
          PrixTTHT=PrixTTHT+ ( PrixUnHT * qte ) ;
        }
      }
      return PrixTTHT;
    }

    PrxiTTC(){
      return  this.PrxiTTHT() * ( 1 + ( this.reception.TVA/100) ) ;
    }



    // ------ Notification & Redirection  --------------
  UrlToRedirection="/gmao/achat/cmd/affbon/";
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
